// src/hooks/usePublicGallery.js
import { orderBy, subscribeToCollection } from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'galleryItems'

export function usePublicGallery() {
    const [galleryItems, setGalleryItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [orderBy('createdAt', 'desc')],
            (data) => {
                setGalleryItems(data)
                setLoading(false)
            }
        )
        return unsubscribe
    }, [])

    return { galleryItems, loading }
}