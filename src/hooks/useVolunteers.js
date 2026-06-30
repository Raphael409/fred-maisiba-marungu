// src/hooks/useVolunteers.js
// Real-time Firestore listener for the "volunteers" collection.
// Public submissions are created via the Volunteer Registration form
// (built later); this hook is read + status-update only for admin use.

import {
    deleteDocument,
    orderBy,
    subscribeToCollection,
    updateDocument,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'volunteers'

export function useVolunteers() {
    const [volunteers, setVolunteers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [orderBy('submittedAt', 'desc')],
            (data) => {
                setVolunteers(data)
                setLoading(false)
            }
        )

        return unsubscribe
    }, [])

    async function updateVolunteerStatus(id, status) {
        return updateDocument(COLLECTION, id, { status })
    }

    async function removeVolunteer(id) {
        return deleteDocument(COLLECTION, id)
    }

    return {
        volunteers,
        loading,
        error,
        updateVolunteerStatus,
        removeVolunteer,
    }
}