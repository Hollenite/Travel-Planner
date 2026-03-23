import LoadingSpinner from './LoadingSpinner';

const variants = {
  primary: 'bg-accent text-white hover:shadow-[0_0_24px_rgba(108,99,255,0.4)] hover:scale-[1.02] active:scale-[0.98]',
  outline: 'bg-transparent border border-border text-text hover:border-accent hover:text-accent active:scale-[0.98]',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-surface2 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-input',
  md: 'px-6 py-3 text-base rounded-input',
  lg: 'px-8 py-4 text-lg rounded-card',
};

export default function Button({ variant = 'primary', size = 'md', loading = false, children, className = '', disabled, ...props }) {
  return (
    <button
      className={`font-sans font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
