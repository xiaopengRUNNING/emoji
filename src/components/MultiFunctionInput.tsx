import { useState } from 'react';
import { convertPoetryToEmoji } from '../services/emojiConverterService';
import PoetryIdiomGuesser from './PoetryIdiomGuesser';

interface MultiFunctionInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type Mode = 'search' | 'poetry' | 'daily';

export default function MultiFunctionInput({
  searchQuery,
  onSearchChange
}: MultiFunctionInputProps) {
  const [mode, setMode] = useState<Mode>('search');
  const [poetry, setPoetry] = useState('');
  const [emojiResult, setEmojiResult] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
      alert('请配置火山引擎 API 密钥');
      return;
    }
    if (!poetry.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await convertPoetryToEmoji(poetry, apiKey);
      setEmojiResult(result);
    } catch (error) {
      console.error('转换失败:', error);
      alert('转换失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mode === 'poetry') {
      handleConvert();
    }
  };

  return (
    <div>
      {/* Mode Switch */}
      <div className="w-full max-w-lg mx-auto mb-8">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setMode('search')}
              className={`px-6 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${mode === 'search' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                搜索
              </span>
            </button>
            <button
              onClick={() => setMode('poetry')}
              className={`px-6 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${mode === 'poetry' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">🎨</span>
                诗词转 Emoji
              </span>
            </button>
            <button
              onClick={() => setMode('daily')}
              className={`px-6 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${mode === 'daily' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">📅</span>
                每日一题
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Area */}
      {mode === 'daily' ? (
        /* Daily Question Mode - Full width */
        <div className="w-full max-w-6xl mx-auto mb-12">
          <PoetryIdiomGuesser apiKey={localStorage.getItem('api_key') || ''} />
        </div>
      ) : (
        /* Search and Poetry Modes - Original width */
        <div className="w-full max-w-lg mx-auto mb-12">
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            {mode === 'search' ? (
              /* Search Mode */
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="搜索 emoji 名称或直接输入 emoji..."
                  className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-lg leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-indigo-600 transition-colors duration-200"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              /* Poetry Mode */
              <div>
                <div className="mb-5">
                  <textarea
                    value={poetry}
                    onChange={e => setPoetry(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入诗词或成语，例如：花好月圆、忽如一夜春风来"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg leading-relaxed placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none min-h-[120px] text-gray-900"
                  />
                </div>

                <button
                  onClick={handleConvert}
                  disabled={!poetry.trim() || isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        转换中...
                      </>
                    ) : (
                      '转换为 Emoji'
                    )}
                  </span>
                </button>

                {(emojiResult?.length ?? 0) > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200 animate-fadeIn">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      转换结果
                    </h3>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 text-center shadow-inner">
                      <p className="text-3xl sm:text-4xl md:text-5xl">
                        {emojiResult}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
