/**
 * Blog Store — Firestore-backed
 *
 * Blog posts are managed from the Admin Panel and stored
 * in Firestore so they persist for every visitor.
 *
 * Posts have a `status` field: 'draft' or 'published'.
 * Only published posts appear on the public website.
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

const COLLECTION = 'blogs';

/* ── Read ────────────────────────────────────────── */

/** Fetch ALL blog posts (drafts + published) — for admin */
export async function getAllBlogs() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Firestore blog read error:', err);
    return [];
  }
}

/** Fetch only published blog posts — for the public website */
export async function getPublishedBlogs() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((b) => b.status !== 'draft');
  } catch (err) {
    console.error('Firestore blog read error:', err);
    return [];
  }
}

/* ── Create ──────────────────────────────────────── */

export async function addBlog(blog) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    title: blog.title || '',
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    coverImage: blog.coverImage || '',
    tags: blog.tags || [],
    author: blog.author || 'Devesh Kumar Mandal',
    featured: blog.featured || false,
    status: blog.status || 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...blog };
}

/* ── Update ──────────────────────────────────────── */

export async function updateBlog(id, updates) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/* ── Publish (draft → published) ─────────────────── */

export async function publishBlog(id) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    status: 'published',
    updatedAt: serverTimestamp(),
  });
}

/* ── Unpublish (published → draft) ───────────────── */

export async function unpublishBlog(id) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    status: 'draft',
    updatedAt: serverTimestamp(),
  });
}

/* ── Delete ──────────────────────────────────────── */

export async function deleteBlog(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
