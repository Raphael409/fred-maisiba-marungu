// src/hooks/usePublicNews.js
// Public-facing news hook — only returns published articles,
// since the admin "news" collection includes drafts the public
// should never see (enforced by Firestore rules + this filter).

import { orderBy, subscribeToCollection, where } from '@/firebase/firestore'
import { useEffect, useState } from 'react'

const COLLECTION = 'news'

export function usePublicNews() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const unsubscribe = subscribeToCollection(
            COLLECTION,
            [where('isPublished', '==', true), orderBy('createdAt', 'desc')],
            (data) => {
                setNews(data)
                setLoading(false)
            }
        )
        return unsubscribe
    }, [])

    return { news, loading }
}