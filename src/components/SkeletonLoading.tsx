export default function SkeletonLoading() {
  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white dark:bg-gray-800 animate-pulse space-y-4">
      {}
      <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, j) => (
          <div key={j} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-700">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        ))}
      </div>

      {}
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-4"></div>
    </div>
  );
}