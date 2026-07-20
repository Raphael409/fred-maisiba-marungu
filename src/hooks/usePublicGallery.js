// src/hooks/usePublicGallery.js
import { orderBy, subscribeToCollection } from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'galleryItems'

export function usePublicGallery() {
    const [galleryItems, setGalleryItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let unsubscribe

        try {
            unsubscribe = subscribeToCollection(
                COLLECTION,
                [orderBy('createdAt', 'desc')],
                (data) => {
                    setGalleryItems(data)
                    setLoading(false)
                }
            )
        } catch (err) {
            console.error('[usePublicGallery] error:', err?.message)
            setLoading(false)
        }

        const timeout = setTimeout(() => setLoading(false), 8000)
        return () => {
            clearTimeout(timeout)
            if (typeof unsubscribe === 'function') unsubscribe()
        }
    }, [])

    return { galleryItems, loading }
}