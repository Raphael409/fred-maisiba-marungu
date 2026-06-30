// src/hooks/usePublicEvents.js
import { orderBy, subscribeToCollection } from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'events'

export function usePublicEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
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

    return { events, loading }
}