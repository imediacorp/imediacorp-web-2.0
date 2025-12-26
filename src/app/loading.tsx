/**
 * Global Loading Component
 * Shows loading state for route transitions
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

