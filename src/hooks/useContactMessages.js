// src/hooks/useContactMessages.js
import {
    deleteDocument,
    subscribeToCollection,
    updateDocument,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'contactMessages'

export function useContactMessages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let unsubscribe

        try {
            unsubscribe = subscribeToCollection(
                COLLECTION,
                [], // no orderBy constraint — sort client-side to avoid index issues
                (data) => {
                    const sorted = [...data].sort((a, b) => {
                        const aTime = a.submittedAt?.toMillis?.() ?? new Date(a.submittedAt).getTime() ?? 0
                        const bTime = b.submittedAt?.toMillis?.() ?? new Date(b.submittedAt).getTime() ?? 0
                        return bTime - aTime
                    })
                    setMessages(sorted)
                    setLoading(false)
                }
            )
        } catch (err) {
            console.error('ContactMessages hook error:', err)
            setLoading(false)
        }

        // Safety timeout — prevents infinite spinner if collection is empty or rules block access
        const timeout = setTimeout(() => setLoading(false), 8000)

        return () => {
            clearTimeout(timeout)
            if (typeof unsubscribe === 'function') unsubscribe()
        }
    }, [])

    async function updateStatus(id, status) {
        return updateDocument(COLLECTION, id, { status })
    }

    async function removeMessage(id) {
        return deleteDocument(COLLECTION, id)
    }

    return { messages, loading, updateStatus, removeMessage }
}