// src/hooks/useEvents.js
// Real-time Firestore listener for the "events" collection,
// plus create/update/delete helpers used by the admin dashboard.

import {
    addDocument,
    deleteDocument,
    orderBy,
    subscribeToCollection,
    updateDocument,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'events'

export function useEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)

        // Sorted by start date ascending — soonest events first.
        // (Combined upcoming + past list, per product decision.)
        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [orderBy('startDateTime', 'asc')],
            (data) => {
                setEvents(data)
                setLoading(false)
            }
        )

        return unsubscribe
    }, [])

    async function createEvent(data) {
        return addDocument(COLLECTION, data)
    }

    async function editEvent(id, data) {
        return updateDocument(COLLECTION, id, data)
    }

    async function removeEvent(id) {
        return deleteDocument(COLLECTION, id)
    }

    return {
        events,
        loading,
        error,
        createEvent,
        editEvent,
        removeEvent,
    }
}