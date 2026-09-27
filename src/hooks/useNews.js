// src/hooks/useNews.js
// Real-time Firestore listener for the "news" collection,
// plus create/update/delete helpers used by the admin dashboard.

import {
    addDocument,
    deleteDocument,
    orderBy,
    subscribeToCollection,
    updateDocument,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'news'

export function useNews() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [orderBy('createdAt', 'desc')],
            (data) => {
                setNews(data)
                setLoading(false)
            }
        )

        return unsubscribe
    }, [])

    async function createNews(data) {
        return addDocument(COLLECTION, data)
    }

    async function editNews(id, data) {
        return updateDocument(COLLECTION, id, data)
    }

    async function removeNews(id) {
        return deleteDocument(COLLECTION, id)
    }

    return {
        news,
        loading,
        error,
        createNews,
        editNews,
        removeNews,
    }
}