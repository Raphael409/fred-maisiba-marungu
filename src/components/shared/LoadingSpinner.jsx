// src/components/shared/LoadingSpinner.jsx

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
}

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        ${sizes[size]}
        rounded-full
        border-neutral-border
        border-t-primary
        animate-spin
        ${className}
      `}
    />
  )
}
