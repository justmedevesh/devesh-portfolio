/**
 * Firebase Configuration — Devesh Portfolio
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'REDACTED',
  authDomain:        'myportfolio-93d6e.firebaseapp.com',
  projectId:         'myportfolio-93d6e',
  storageBucket:     'myportfolio-93d6e.firebasestorage.app',
  messagingSenderId: '400587596692',
  appId:             '1:400587596692:web:5c7e6a573a8a3ca4d52581',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
