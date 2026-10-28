export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <h2 className="text-3xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-4">Could not find the requested resource or page.</p>
      <a 
        href="/" 
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Return Home
      </a>
    </div>
  );
}