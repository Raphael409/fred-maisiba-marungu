// src/hooks/useProjects.js
// Real-time Firestore listener for the "projects" collection,
// plus create/update/delete helpers used by the admin dashboard.

import {
    addDocument,
    deleteDocument,
    orderBy,
    subscribeToCollection,
    updateDocument,
} from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'projects'

export function useProjects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)

        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [orderBy('createdAt', 'desc')],
            (data) => {
                setProjects(data)
                setLoading(false)
            }
        )

        return unsubscribe
    }, [])

    async function createProject(data) {
        return addDocument(COLLECTION, data)
    }

    async function editProject(id, data) {
        return updateDocument(COLLECTION, id, data)
    }

    async function removeProject(id) {
        return deleteDocument(COLLECTION, id)
    }

    return {
        projects,
        loading,
        error,
        createProject,
        editProject,
        removeProject,
    }
}