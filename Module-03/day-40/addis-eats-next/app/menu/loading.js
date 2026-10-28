export default function MenuLoading() {
  return (
    <div className="p-4">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="border p-4 rounded-lg shadow-sm space-y-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}