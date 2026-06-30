// src/firebase/auth.js
// Thin wrappers around Firebase Auth methods.

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config'

export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  return firebaseSignOut(auth)
}

export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback)
}
