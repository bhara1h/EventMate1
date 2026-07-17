export default function Input({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg border-2 transition
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          border-gray-200 dark:border-gray-700
          focus:outline-none focus:border-purple-500 dark:focus:border-purple-400
          ${error ? 'border-red-500 dark:border-red-400' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
