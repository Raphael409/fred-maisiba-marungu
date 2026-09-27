// src/hooks/useNewsletterSubscribers.js
import {
    deleteDocument,
    orderBy,
    subscribeToCollection,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'newsletterSubscribers'

export function useNewsletterSubscribers() {
    const [subscribers, setSubscribers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let unsubscribe

        // Order by createdAt (added by addDocument automatically via serverTimestamp)
        // This avoids a composite index requirement on subscribedAt.
        try {
            unsubscribe = subscribeToCollection(
                COLLECTION,
                [orderBy('createdAt', 'desc')],
                (data) => {
                    setSubscribers(data)
                    setLoading(false)
                }
            )
        } catch (err) {
            console.error('NewsletterSubscribers hook error:', err)
            setLoading(false)
        }

        // Safety timeout — stops spinner if collection is empty or rules block access
        const timeout = setTimeout(() => setLoading(false), 8000)

        return () => {
            clearTimeout(timeout)
            if (typeof unsubscribe === 'function') unsubscribe()
        }
    }, [])

    async function removeSubscriber(id) {
        return deleteDocument(COLLECTION, id)
    }

    return { subscribers, loading, removeSubscriber }
}