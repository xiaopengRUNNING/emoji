import React, { useState, useMemo, useCallback, useEffect } from 'react';
import EmojiGrid from './components/EmojiGrid';
import MultiFunctionInput from './components/MultiFunctionInput';
import { getEmojiData, getAllEmojis } from './data/emojiService';
import { EmojiItem } from './types/emoji';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  // 从本地存储加载 API Key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('api_key');
    if (savedApiKey) {
      setApiKeyInput(savedApiKey);
    }
  }, []);

  const emojiData = useMemo(() => getEmojiData(), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const allEmojis = getAllEmojis();
    const results: EmojiItem[] = [];

    for (const emoji of allEmojis) {
      if (
        emoji.name.toLowerCase().includes(query) ||
        emoji.emoji.includes(searchQuery)
      ) {
        results.push(emoji);
      }
    }

    return results;
  }, [searchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSaveApiKey = useCallback(() => {
    localStorage.setItem('api_key', apiKeyInput);
    setShowApiKeyModal(false);
  }, [apiKeyInput]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="py-12">
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                Emoji 表情库
              </h1>
              <p className="text-gray-600 text-lg">探索表情，与 AI 交流</p>
            </div>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="p-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
              aria-label="配置 API Key"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>

          {/* 内容区域 */}
          <MultiFunctionInput
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          
          <div className="w-full max-w-5xl mx-auto px-4 mb-6 mt-8">
            {searchResults ? (
              <EmojiGrid
                searchResults={searchResults}
                searchQuery={searchQuery}
              />
            ) : (
              <EmojiGrid categories={emojiData} />
            )}
          </div>
        </div>
      </div>

      {/* API Key 配置弹窗 */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-xl font-semibold text-gray-900">配置 API Key</h2>
              <p className="mt-1 text-gray-600 text-sm">填写您的 API Key 以使用 AI 功能</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    id="api-key"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="请输入 API Key"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(App);
