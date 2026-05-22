/**
 * Project Store — Firestore-backed
 *
 * Static projects live in portfolio.js (shown first).
 * Admin-added projects are stored in Firestore so they
 * persist for every visitor, on every device.
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
import { projects as staticProjects } from './portfolio';

const COLLECTION = 'projects';

/* ── Read ────────────────────────────────────────── */

/** Fetch admin-added projects from Firestore */
export async function getAdminProjects() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Firestore read error:', err);
    return [];
  }
}

/** Returns every project — static first, then Firestore admin projects */
export async function getAllProjects() {
  const adminProjects = await getAdminProjects();
  return [...staticProjects, ...adminProjects];
}

/* ── Create ──────────────────────────────────────── */

export async function addProject(project) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    title: project.title || '',
    description: project.description || '',
    tags: project.tags || [],
    github: project.github || '',
    live: project.live || '',
    featured: project.featured || false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...project };
}

/* ── Update ──────────────────────────────────────── */

export async function updateProject(id, updates) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/* ── Delete ──────────────────────────────────────── */

export async function deleteProject(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
