/**
 * Education Store — Firestore-backed
 *
 * Static education entries live in portfolio.js (used as fallback).
 * Admin-managed education entries are stored in Firestore so they
 * can be added/edited/removed from the admin panel.
 */

import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { education as staticEducation } from './portfolio';

const COLLECTION = 'education';

/* ── Read ────────────────────────────────────────── */

/** Fetch admin-managed education entries from Firestore */
export async function getAdminEducation() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Firestore education read error:', err);
    return [];
  }
}

/**
 * Returns education entries to display on the portfolio.
 * If there are any admin-managed entries in Firestore, those are used exclusively.
 * Otherwise falls back to the static entries in portfolio.js.
 */
export async function getDisplayEducation() {
  const adminEducation = await getAdminEducation();
  if (adminEducation.length > 0) {
    return adminEducation;
  }
  return staticEducation;
}

/* ── Create ──────────────────────────────────────── */

export async function addEducationEntry(entry) {
  const existing = await getAdminEducation();
  const maxOrder = existing.reduce((max, e) => Math.max(max, e.order || 0), 0);

  const docRef = await addDoc(collection(db, COLLECTION), {
    degree: entry.degree || '',
    school: entry.school || '',
    period: entry.period || '',
    current: entry.current || false,
    order: maxOrder + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...entry };
}

/* ── Update ──────────────────────────────────────── */

export async function updateEducationEntry(id, updates) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    degree: updates.degree || '',
    school: updates.school || '',
    period: updates.period || '',
    current: updates.current || false,
    ...(updates.order !== undefined ? { order: updates.order } : {}),
    updatedAt: serverTimestamp(),
  });
}

/* ── Delete ──────────────────────────────────────── */

export async function deleteEducationEntry(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

/* ── Seed from static ────────────────────────────── */

export async function seedEducationFromStatic() {
  const existing = await getAdminEducation();
  if (existing.length > 0) {
    return existing;
  }

  const results = [];
  for (let i = 0; i < staticEducation.length; i++) {
    const entry = staticEducation[i];
    const docRef = await addDoc(collection(db, COLLECTION), {
      degree: entry.degree,
      school: entry.school,
      period: entry.period,
      current: entry.current,
      order: i + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    results.push({ id: docRef.id, ...entry, order: i + 1 });
  }
  return results;
}
