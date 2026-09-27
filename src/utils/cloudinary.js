// src/utils/cloudinary.js
// Handles all image uploads to Cloudinary.
// Uses unsigned uploads via an upload preset — no API secret exposed.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload a single image file to Cloudinary.
 *
 * @param {File}     file         - The File object from an <input type="file">
 * @param {string}   folder       - Cloudinary folder, e.g. "campaign/projects"
 * @param {Function} onProgress   - Optional callback receiving 0-100 progress
 * @returns {Promise<{url, publicId}>}
 */
export function uploadImage(file, folder = 'campaign', onProgress = () => { }) {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('folder', folder)

        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100)
                onProgress(pct)
            }
        })

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText)
                resolve({
                    url: response.secure_url,
                    publicId: response.public_id,
                })
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`))
            }
        })

        xhr.addEventListener('error', () => reject(new Error('Upload failed')))

        xhr.open(
            'POST',
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
        )
        xhr.send(formData)
    })
}

/**
 * Upload multiple images in parallel.
 *
 * @param {File[]}   files   - Array of File objects
 * @param {string}   folder  - Cloudinary folder
 * @returns {Promise<Array<{url, publicId}>>}
 */
export async function uploadMultipleImages(files, folder = 'campaign') {
    const uploads = Array.from(files).map(file => uploadImage(file, folder))
    return Promise.all(uploads)
}

/**
 * Delete an image from Cloudinary.
 * NOTE: Deletion requires a signed request (server-side or Firebase Function).
 * For now, images can be managed/deleted directly in the Cloudinary dashboard.
 * This is a placeholder for a future backend implementation.
 */
export async function deleteImage(publicId) {
    console.warn(
        'Client-side Cloudinary deletion requires a backend. ' +
        `Delete "${publicId}" manually at https://cloudinary.com/console/media_library`
    )
}

/**
 * Build a Cloudinary transformation URL for resizing/optimizing images.
 *
 * @param {string} url    - Original Cloudinary URL
 * @param {object} opts   - Transformation options
 * @returns {string}      - Transformed URL
 */
export function transformImage(url, { width, height, quality = 'auto', format = 'auto' } = {}) {
    if (!url || !url.includes('cloudinary.com')) return url

    const transformations = [
        `q_${quality}`,
        `f_${format}`,
        width ? `w_${width}` : '',
        height ? `h_${height}` : '',
        'c_fill',
    ].filter(Boolean).join(',')

    return url.replace('/upload/', `/upload/${transformations}/`)
}