/**
 * Experience Store — Firestore-backed
 *
 * Static experiences live in portfolio.js (used as fallback).
 * Admin-managed experiences are stored in Firestore so they
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
import { experience as staticExperience } from './portfolio';

const COLLECTION = 'experience';

/* ── Read ────────────────────────────────────────── */

/** Fetch admin-managed experiences from Firestore */
export async function getAdminExperiences() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Firestore experience read error:', err);
    return [];
  }
}

/**
 * Returns experiences to display on the portfolio.
 * If there are any admin-managed experiences in Firestore, those are used exclusively.
 * Otherwise falls back to the static experiences in portfolio.js.
 */
export async function getDisplayExperiences() {
  const adminExperiences = await getAdminExperiences();
  if (adminExperiences.length > 0) {
    return adminExperiences;
  }
  return staticExperience;
}

/* ── Create ──────────────────────────────────────── */

export async function addExperience(exp) {
  const existing = await getAdminExperiences();
  const maxOrder = existing.reduce((max, e) => Math.max(max, e.order || 0), 0);

  const docRef = await addDoc(collection(db, COLLECTION), {
    period: exp.period || '',
    duration: exp.duration || '',
    role: exp.role || '',
    company: exp.company || '',
    type: exp.type || '',
    location: exp.location || '',
    current: exp.current || false,
    description: exp.description || '',
    tags: exp.tags || [],
    order: maxOrder + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...exp };
}

/* ── Update ──────────────────────────────────────── */

export async function updateExperience(id, updates) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    period: updates.period || '',
    duration: updates.duration || '',
    role: updates.role || '',
    company: updates.company || '',
    type: updates.type || '',
    location: updates.location || '',
    current: updates.current || false,
    description: updates.description || '',
    tags: updates.tags || [],
    ...(updates.order !== undefined ? { order: updates.order } : {}),
    updatedAt: serverTimestamp(),
  });
}

/* ── Delete ──────────────────────────────────────── */

export async function deleteExperience(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

/* ── Seed from static ────────────────────────────── */

export async function seedExperiencesFromStatic() {
  const existing = await getAdminExperiences();
  if (existing.length > 0) {
    return existing;
  }

  const results = [];
  for (let i = 0; i < staticExperience.length; i++) {
    const exp = staticExperience[i];
    const docRef = await addDoc(collection(db, COLLECTION), {
      period: exp.period,
      duration: exp.duration,
      role: exp.role,
      company: exp.company,
      type: exp.type,
      location: exp.location,
      current: exp.current,
      description: exp.description,
      tags: exp.tags || [],
      order: i + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    results.push({ id: docRef.id, ...exp, order: i + 1 });
  }
  return results;
}
