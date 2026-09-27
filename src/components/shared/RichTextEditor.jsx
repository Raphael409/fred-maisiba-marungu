// src/components/shared/RichTextEditor.jsx
// Thin wrapper around React Quill so the rest of the app never imports
// react-quill directly — makes it easy to swap editors later if needed.

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const modules = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
    ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link',
]

export default function RichTextEditor({ label, value, onChange, error, placeholder }) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-semibold text-neutral-dark">{label}</label>
            )}

            <div className={`rounded border ${error ? 'border-red-500' : 'border-neutral-border'} overflow-hidden`}>
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    )
}