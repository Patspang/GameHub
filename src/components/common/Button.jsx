// Shared button component with child-friendly sizing and interaction
// Min 60px height, rounded corners, hover/active scale effects

const VARIANTS = {
  primary: 'bg-primary-blue text-white',
  success: 'bg-primary-green text-white',
  warning: 'bg-primary-coral text-white',
  accent: 'bg-primary-yellow text-text-primary',
  ghost: 'bg-white/80 text-text-primary border-2 border-primary-blue',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  ...props
}) {
  const sizeClasses = size === 'lg'
    ? 'text-xl px-8 py-4 min-h-[60px]'
    : 'text-lg px-6 py-3 min-h-[48px]';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        game-interactive font-display font-bold
        rounded-2xl shadow-lg
        ${sizeClasses}
        ${VARIANTS[variant] || VARIANTS.primary}
        ${disabled ? 'opacity-50 cursor-not-allowed !transform-none' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
