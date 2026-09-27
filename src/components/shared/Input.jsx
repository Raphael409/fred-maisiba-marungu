// src/components/shared/Input.jsx

export default function Input({
  label,
  id,
  error,
  className = '',
  textarea  = false,
  rows      = 4,
  ...props
}) {
  const base = `
    w-full px-4 py-2.5 rounded border
    font-body text-neutral-dark bg-white
    transition-colors duration-150
    focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
    ${error ? 'border-red-500' : 'border-neutral-border'}
    ${className}
  `

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-neutral-dark">
          {label}
        </label>
      )}

      {textarea ? (
        <textarea id={id} rows={rows} className={base} {...props} />
      ) : (
        <input id={id} className={base} {...props} />
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
