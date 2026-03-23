const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div
      className={`rounded-full border-accent/30 border-t-accent animate-spin ${sizeMap[size]} ${className}`}
    />
  );
}
