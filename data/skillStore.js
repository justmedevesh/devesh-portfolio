/**
 * Skill Store — Firestore-backed
 *
 * Static skills live in portfolio.js (used as fallback).
 * Admin-managed skills are stored in Firestore so they
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
import { skills as staticSkills } from './portfolio';

const COLLECTION = 'skills';

/* ── Read ────────────────────────────────────────── */

/** Fetch admin-managed skills from Firestore */
export async function getAdminSkills() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Firestore skills read error:', err);
    return [];
  }
}

/**
 * Returns skills to display on the portfolio.
 * If there are any admin-managed skills in Firestore, those are used exclusively.
 * Otherwise falls back to the static skills in portfolio.js.
 */
export async function getDisplaySkills() {
  const adminSkills = await getAdminSkills();
  if (adminSkills.length > 0) {
    return adminSkills;
  }
  return staticSkills;
}

/* ── Create ──────────────────────────────────────── */

export async function addSkill(skill) {
  // Auto-assign order — put it at the end
  const existing = await getAdminSkills();
  const maxOrder = existing.reduce((max, s) => Math.max(max, s.order || 0), 0);

  const docRef = await addDoc(collection(db, COLLECTION), {
    name: skill.name || '',
    icon: skill.icon || '⚡',
    level: Number(skill.level) || 50,
    category: skill.category || '',
    order: maxOrder + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...skill };
}

/* ── Update ──────────────────────────────────────── */

export async function updateSkill(id, updates) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    name: updates.name || '',
    icon: updates.icon || '⚡',
    level: Number(updates.level) || 50,
    category: updates.category || '',
    ...(updates.order !== undefined ? { order: updates.order } : {}),
    updatedAt: serverTimestamp(),
  });
}

/* ── Delete ──────────────────────────────────────── */

export async function deleteSkill(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

/* ── Seed from static ────────────────────────────── */

/**
 * Copies the static skills from portfolio.js into Firestore.
 * Useful when first setting up admin skill management.
 */
export async function seedSkillsFromStatic() {
  const existing = await getAdminSkills();
  if (existing.length > 0) {
    return existing; // Already seeded
  }

  const results = [];
  for (let i = 0; i < staticSkills.length; i++) {
    const skill = staticSkills[i];
    const docRef = await addDoc(collection(db, COLLECTION), {
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      category: skill.category,
      order: i + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    results.push({ id: docRef.id, ...skill, order: i + 1 });
  }
  return results;
}
