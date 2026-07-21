// src/firebase/auth.js
// Firebase authentication helpers used across admin login/logout.

import {
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from './config'

export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  return firebaseSignOut(auth)
}