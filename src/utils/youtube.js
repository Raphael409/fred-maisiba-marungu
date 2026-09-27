// src/utils/youtube.js
// Utilities for extracting YouTube video IDs and building thumbnail/embed URLs.

/**
 * Extracts YouTube video ID from any valid YouTube URL format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeId(url) {
    if (!url) return null
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/, // raw ID passed directly
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

/** Returns the best-quality thumbnail URL for a YouTube video */
export function getYouTubeThumbnail(videoId, quality = 'hqdefault') {
    if (!videoId) return null
    // Qualities: maxresdefault, hqdefault, mqdefault, sddefault, default
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/** Returns the YouTube embed URL */
export function getYouTubeEmbedUrl(videoId) {
    if (!videoId) return null
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
}

/** Returns the watch URL */
export function getYouTubeWatchUrl(videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`
}