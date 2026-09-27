// src/hooks/useGallery.js
// Real-time Firestore listener for the "galleryItems" collection,
// plus create/update/delete helpers used by the admin dashboard.

import {
    addDocument,
    deleteDocument,
    orderBy,
    subscribeToCollection,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'galleryItems'

export function useGallery() {
    const [galleryItems, setGalleryItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [orderBy('createdAt', 'desc')],
            (data) => {
                setGalleryItems(data)
                setLoading(false)
            }
        )

        return unsubscribe
    }, [])

    // Add a single gallery item document (used internally for each
    // uploaded image in a bulk upload).
    async function addGalleryItem(data) {
        return addDocument(COLLECTION, data)
    }

    // Add multiple gallery items at once (one Firestore doc per image).
    async function addGalleryItems(itemsArray) {
        return Promise.all(itemsArray.map(item => addDocument(COLLECTION, item)))
    }

    async function removeGalleryItem(id) {
        return deleteDocument(COLLECTION, id)
    }

    return {
        galleryItems,
        loading,
        error,
        addGalleryItem,
        addGalleryItems,
        removeGalleryItem,
    }
}