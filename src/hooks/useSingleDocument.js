// src/hooks/useSingleDocument.js
// Generic hook to fetch a single Firestore document by collection + id.
// Used by detail pages (ProjectDetail, NewsDetail).

import { getDocument } from '@/firebase/firestore'
import { useEffect, useState } from 'react'

export function useSingleDocument(collectionName, docId) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!docId) {
            setLoading(false)
            return
        }

        let cancelled = false
        setLoading(true)

        getDocument(collectionName, docId)
            .then(result => {
                if (!cancelled) {
                    setData(result)
                    setLoading(false)
                }
            })
            .catch(err => {
                if (!cancelled) {
                    setError(err)
                    setLoading(false)
                }
            })

        return () => { cancelled = true }
    }, [collectionName, docId])

    return { document: data, loading, error }
}