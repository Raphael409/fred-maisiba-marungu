// src/components/shared/Button.jsx

import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary:   'bg-secondary text-primary hover:bg-secondary-dark',
  secondary: 'bg-transparent text-neutral-on-dark border border-neutral-on-dark hover:bg-neutral-on-dark hover:text-primary',
  outline:   'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'bg-transparent text-primary hover:bg-neutral-bg',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
}

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-content gap-2
        font-heading font-semibold rounded
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}
