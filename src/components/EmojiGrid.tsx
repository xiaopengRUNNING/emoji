import React, { useState, useCallback } from 'react'
import { EmojiCategory, EmojiItem } from '../types/emoji'

interface EmojiGridProps {
  category?: EmojiCategory
  categories?: EmojiCategory[]
  searchResults?: EmojiItem[]
  searchQuery?: string
}

const EmojiGrid = ({ category, categories, searchResults, searchQuery }: EmojiGridProps) => {
  const [toast, setToast] = useState<{ visible: boolean; emoji: string }>({ visible: false, emoji: '' })
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = useCallback(async (emoji: string, index: number) => {
    try {
      await navigator.clipboard.writeText(emoji)
      setCopiedIndex(index)
      setToast({ visible: true, emoji })
      
      setTimeout(() => setCopiedIndex(null), 500)
      setTimeout(() => setToast({ visible: false, emoji: '' }), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }, [])

  if (searchResults && searchResults.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="border border-gray-200 rounded-xl p-12 text-center bg-white shadow-sm">
          <span className="text-6xl block mb-6">😕</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">未找到匹配的 emoji</h2>
          <p className="text-gray-600">尝试使用其他关键词搜索</p>
        </div>
      </div>
    )
  }

  // 搜索结果显示
  if (searchResults) {
    const title = `搜索结果: "${searchQuery}"`
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        {toast.visible && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
              <span className="text-lg">{toast.emoji}</span>
              <span className="text-sm font-medium">已复制到剪贴板</span>
            </div>
          </div>
        )}
        
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
              {searchResults.length} 个
            </span>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {searchResults.map((item, index) => (
              <div
                key={`${title}-${index}`}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 relative
                  ${copiedIndex === index ? 'bg-indigo-50' : 'hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1'}
                `}
                title={`点击复制: ${item.name}`}
                onClick={() => handleCopy(item.emoji, index)}
              >
                {copiedIndex === index && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center z-10 animate-pulse">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <span className="text-2xl sm:text-3xl">
                  {item.emoji}
                </span>
                <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 单个分类显示
  if (category) {
    const title = category.category
    const displayEmojis = category.emojis
    return (
      <div className="w-full max-w-5xl mx-auto px-4">
        {toast.visible && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
              <span className="text-lg">{toast.emoji}</span>
              <span className="text-sm font-medium">已复制到剪贴板</span>
            </div>
          </div>
        )}
        
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
              {displayEmojis.length} 个
            </span>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {displayEmojis.map((item, index) => (
              <div
                key={`${title}-${index}`}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 relative
                  ${copiedIndex === index ? 'bg-indigo-50' : 'hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1'}
                `}
                title={`点击复制: ${item.name}`}
                onClick={() => handleCopy(item.emoji, index)}
              >
                {copiedIndex === index && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center z-10 animate-pulse">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <span className="text-2xl sm:text-3xl">
                  {item.emoji}
                </span>
                <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 多个分类显示
  if (categories) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 space-y-8">
        {toast.visible && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg">
              <span className="text-lg">{toast.emoji}</span>
              <span className="text-sm font-medium">已复制到剪贴板</span>
            </div>
          </div>
        )}
        
        {categories.map((category) => (
          <div 
            key={category.category}
            className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {category.category}
              </h2>
              <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                {category.emojis.length} 个
              </span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {category.emojis.map((item, index) => (
                <div
                  key={`${category.category}-${index}`}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 relative
                    ${copiedIndex === index ? 'bg-indigo-50' : 'hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1'}
                  `}
                  title={`点击复制: ${item.name}`}
                  onClick={() => handleCopy(item.emoji, index)}
                >
                  {copiedIndex === index && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center z-10 animate-pulse">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <span className="text-2xl sm:text-3xl">
                    {item.emoji}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default React.memo(EmojiGrid)
