/**
 * Social Links Store — Firestore-backed
 *
 * Shown in the dock and the Contact window. Managed from the Admin Panel.
 * Until any links are added in Firestore, GitHub + LinkedIn from
 * portfolio.js are shown as a fallback.
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
import { personal } from './portfolio';

const COLLECTION = 'socials';

export const DEFAULT_SOCIALS = [
  { platform: 'github', label: 'GitHub', url: personal.github },
  { platform: 'linkedin', label: 'LinkedIn', url: personal.linkedin },
];

/* ── Read ────────────────────────────────────────── */

export async function getAdminSocials() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Firestore socials read error:', err);
    return [];
  }
}

/** Links for the public site — falls back to the defaults when none are stored. */
export async function getSocials() {
  const stored = await getAdminSocials();
  return stored.length > 0 ? stored : DEFAULT_SOCIALS;
}

/* ── Write ───────────────────────────────────────── */

/** Email / phone entries become mailto: / tel: links; bare domains get https://. */
function normalize(link) {
  let url = (link.url || '').trim();
  if (link.platform === 'email' && url && !url.startsWith('mailto:')) url = `mailto:${url}`;
  else if (link.platform === 'phone' && url && !url.startsWith('tel:')) url = `tel:${url.replace(/[^+\d]/g, '')}`;
  else if (url && !/^(https?:|mailto:|tel:)/i.test(url)) url = `https://${url}`;
  return { platform: link.platform || 'website', label: (link.label || '').trim(), url };
}

export async function addSocial(link) {
  const existing = await getAdminSocials();
  const maxOrder = existing.reduce((max, s) => Math.max(max, s.order || 0), 0);
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...normalize(link),
    order: maxOrder + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...link };
}

export async function updateSocial(id, updates) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...normalize(updates),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSocial(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Swap the order of two links (used by the ↑ / ↓ buttons). */
export async function swapSocialOrder(a, b) {
  await Promise.all([
    updateDoc(doc(db, COLLECTION, a.id), { order: b.order }),
    updateDoc(doc(db, COLLECTION, b.id), { order: a.order }),
  ]);
}

/** Copy the default GitHub + LinkedIn links into Firestore so they can be edited. */
export async function seedSocialsFromDefaults() {
  const existing = await getAdminSocials();
  if (existing.length > 0) return existing;
  for (let i = 0; i < DEFAULT_SOCIALS.length; i++) {
    await addDoc(collection(db, COLLECTION), {
      ...DEFAULT_SOCIALS[i],
      order: i + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return getAdminSocials();
}
