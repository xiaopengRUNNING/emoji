interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-lg mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索 emoji 名称或直接输入 emoji..."
            className="block w-full pl-14 pr-14 py-4 border-0 rounded-full leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-200 shadow-soft-lg transition-all duration-300 hover:shadow-glow text-gray-800"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center group/btn"
            >
              <div className="p-1 rounded-full bg-gray-100 group-hover/btn:bg-red-100 transition-colors">
                <svg className="h-5 w-5 text-gray-400 group-hover/btn:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
