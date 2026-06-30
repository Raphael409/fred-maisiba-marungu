// src/firebase/firestore.js
// Generic Firestore helpers used across all custom hooks.

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './config'

// ─── Read ────────────────────────────────────────────────────

export function getCollection(collectionName) {
  return collection(db, collectionName)
}

export async function getDocuments(collectionName, constraints = []) {
  const ref = collection(db, collectionName)
  const q   = constraints.length ? query(ref, ...constraints) : ref
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getDocument(collectionName, docId) {
  const ref  = doc(db, collectionName, docId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export function subscribeToCollection(collectionName, constraints = [], callback) {
  const ref = collection(db, collectionName)
  const q   = constraints.length ? query(ref, ...constraints) : ref
  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(data)
  })
}

// ─── Write ───────────────────────────────────────────────────

export async function addDocument(collectionName, data) {
  const ref = collection(db, collectionName)
  return addDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateDocument(collectionName, docId, data) {
  const ref = doc(db, collectionName, docId)
  return updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteDocument(collectionName, docId) {
  const ref = doc(db, collectionName, docId)
  return deleteDoc(ref)
}

// ─── Re-export Firestore query helpers for use in hooks ──────

export { where, orderBy, limit, serverTimestamp }
