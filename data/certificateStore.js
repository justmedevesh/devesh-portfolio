/**
 * Certificate Store — Firestore-backed
 *
 * Two places in Firestore:
 *   certificates/{id}                     PUBLIC  — title, issuer, date, links and a
 *                                                   small watermarked preview image
 *   certificateFiles/{id}/chunks/{n}      PRIVATE — the original file (PDF / image),
 *                                                   split into base64 chunks because a
 *                                                   Firestore document is capped at 1 MiB
 *
 * Security rules must make certificateFiles readable by the admin only,
 * so visitors never receive the original file.
 */

import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'certificates';
const FILES = 'certificateFiles';
const CHUNK_CHARS = 700_000; // base64 chars per chunk — safely under the 1 MiB doc limit
export const MAX_FILE_BYTES = 8 * 1024 * 1024;

const chunksOf = (id) => collection(db, FILES, id, 'chunks');

/* ── Read ────────────────────────────────────────── */

/** All certificates (metadata + preview only) — safe for the public site */
export async function getCertificates() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Firestore certificates read error:', err);
    return [];
  }
}

/** Rebuild the original file from its private chunks — admin only */
export async function getCertificateFile(cert) {
  const snap = await getDocs(query(chunksOf(cert.id), orderBy('index', 'asc')));
  if (snap.empty) throw new Error('No file stored for this certificate.');
  const base64 = snap.docs.map((d) => d.data().data).join('');
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: cert.fileType || 'application/octet-stream' });
}

/* ── File helpers ────────────────────────────────── */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function deleteFileChunks(id) {
  const snap = await getDocs(chunksOf(id));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

async function writeFileChunks(id, file) {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`File is too large (max ${MAX_FILE_BYTES / 1024 / 1024} MB).`);
  }
  const base64 = await fileToBase64(file);
  const count = Math.ceil(base64.length / CHUNK_CHARS);
  // Sequential writes keep each request well under Firestore's size limits
  for (let i = 0; i < count; i++) {
    await setDoc(doc(chunksOf(id), String(i)), {
      index: i,
      data: base64.slice(i * CHUNK_CHARS, (i + 1) * CHUNK_CHARS),
    });
  }
  return { fileName: file.name, fileType: file.type, fileSize: file.size, chunkCount: count };
}

function cleanMeta(cert) {
  return {
    title: cert.title || '',
    issuer: cert.issuer || '',
    issueDate: cert.issueDate || '',
    credentialId: cert.credentialId || '',
    credentialUrl: cert.credentialUrl || '',
    skills: cert.skills || [],
    preview: cert.preview || '',
  };
}

/* ── Create ──────────────────────────────────────── */

export async function addCertificate(cert, file) {
  const existing = await getCertificates();
  const maxOrder = existing.reduce((max, c) => Math.max(max, c.order || 0), 0);

  // Reserve an id, store the private file first, then publish the metadata
  const ref = doc(collection(db, COLLECTION));
  const fileInfo = file ? await writeFileChunks(ref.id, file) : {};

  await setDoc(ref, {
    ...cleanMeta(cert),
    ...fileInfo,
    order: maxOrder + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: ref.id, ...cert, ...fileInfo };
}

/* ── Update ──────────────────────────────────────── */

/** Pass `file` only when replacing the stored certificate file */
export async function updateCertificate(id, updates, file) {
  let fileInfo = {};
  if (file) {
    await deleteFileChunks(id);
    fileInfo = await writeFileChunks(id, file);
  }
  await updateDoc(doc(db, COLLECTION, id), {
    ...cleanMeta(updates),
    ...fileInfo,
    updatedAt: serverTimestamp(),
  });
}

/* ── Delete ──────────────────────────────────────── */

export async function deleteCertificate(id) {
  await deleteFileChunks(id);
  await deleteDoc(doc(db, COLLECTION, id));
}
