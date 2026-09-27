// src/hooks/useFeaturedProjects.js
// Public hook for Home page — returns featured projects only.

import { orderBy, subscribeToCollection, where } from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'projects'

export function useFeaturedProjects() {
    const [featuredProjects, setFeaturedProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [where('featured', '==', true), orderBy('createdAt', 'desc')],
            (data) => {
                setFeaturedProjects(data)
                setLoading(false)
            }
        )
        return unsubscribe
    }, [])

    return { featuredProjects, loading }
}