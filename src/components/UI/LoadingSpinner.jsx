export function LoadingSpinner({ size = 'md', message }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-bricol-blue rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
}
