// src/firebase/storage.js
// Upload and delete helpers for Firebase Storage.

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

/**
 * Upload a file to Firebase Storage with progress reporting.
 * @param {string} path       - Storage path, e.g. "projects/abc123/cover.jpg"
 * @param {File}   file       - The File object from an <input type="file">
 * @param {Function} onProgress - Called with 0–100 progress percentage
 * @returns {Promise<string>}  - Resolves to the public download URL
 */
export function uploadFile(path, file, onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const storageRef  = ref(storage, path)
    const uploadTask  = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        onProgress(pct)
      },
      error  => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}

/**
 * Delete a file from Firebase Storage by its full storage path.
 * @param {string} path - e.g. "projects/abc123/cover.jpg"
 */
export async function deleteFile(path) {
  const storageRef = ref(storage, path)
  return deleteObject(storageRef)
}

/**
 * Build a namespaced storage path.
 * @param {string} collection - e.g. "projects"
 * @param {string} docId      - Firestore document ID
 * @param {string} filename   - Original file name
 */
export function buildStoragePath(collection, docId, filename) {
  const ext       = filename.split('.').pop()
  const timestamp = Date.now()
  return `${collection}/${docId}/${timestamp}.${ext}`
}
