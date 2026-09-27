// src/components/shared/Button.jsx
// Primary action button used throughout the admin dashboard.

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) {
  const base = 'inline-flex items-center gap-2 font-heading font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-secondary text-white hover:bg-secondary-dark shadow-md',
    accent: 'bg-accent text-white hover:bg-accent-dark shadow-glow',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
    ghost: 'text-neutral-dark hover:bg-neutral-bg',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </button>
  )
}