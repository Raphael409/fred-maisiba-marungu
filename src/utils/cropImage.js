// src/utils/cropImage.js
// Takes a loaded image element and a pixelCrop object from react-easy-crop,
// returns a cropped Blob ready for upload.

export default async function getCroppedImg(imageSrc, pixelCrop, outputType = 'image/jpeg') {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) { reject(new Error('Canvas toBlob failed')); return }
            resolve(blob)
        }, outputType, 0.92)
    })
}

function createImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener('load', () => resolve(img))
        img.addEventListener('error', err => reject(err))
        img.setAttribute('crossOrigin', 'anonymous')
        img.src = url
    })
}