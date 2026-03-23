const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export default function Avatar({ user, size = 'md' }) {
  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || 'User avatar'}
        className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-accent/20`}
      />
    );
  }

  // Fallback to initials if no photo
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 font-mono font-semibold text-white ${sizeMap[size]}`}
    >
      {getInitials(user?.displayName)}
    </div>
  );
}
