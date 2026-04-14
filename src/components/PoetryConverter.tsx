// src/components/PoetryConverter.tsx
import React, { useState } from 'react';
import { convertPoetryToEmoji } from '../services/emojiConverterService';

interface PoetryConverterProps {
  apiKey: string;
}

const PoetryConverter: React.FC<PoetryConverterProps> = ({ apiKey }) => {
  const [poetry, setPoetry] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!poetry.trim()) {
      setError('请输入诗词');
      return;
    }

    if (!apiKey) {
      setError('请输入有效的API密钥');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const emojiResult = await convertPoetryToEmoji(poetry, apiKey);
      setResult(emojiResult);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      setError('复制失败，请手动复制');
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">诗词转Emoji</h2>
        <p className="text-gray-600">将古典诗词转化为现代表情符号</p>
      </div>
      
      <div className="mb-8">
        <label className="block mb-3 font-medium text-gray-700">输入诗词</label>
        <textarea
          value={poetry}
          onChange={(e) => setPoetry(e.target.value)}
          placeholder="例如：床前明月光，疑是地上霜。举头望明月，低头思故乡。"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          rows={5}
          style={{
            resize: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <button
        onClick={handleConvert}
        disabled={isLoading || !poetry.trim()}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            转换中...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            转换为Emoji
          </div>
        )}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-fadeIn">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.633-1.964-.633-2.732 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="font-semibold text-gray-700 text-lg">转换结果</h3>
            <button
              onClick={handleCopy}
              className={`text-sm px-4 py-2 rounded-md transition-all duration-200 flex items-center ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </>
              )}
            </button>
          </div>
          <div className="p-8 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-center shadow-inner">
            <div className="text-5xl sm:text-6xl md:text-7xl font-light">{result}</div>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p className="flex items-start">
          <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          提示：输入诗词后点击转换按钮，系统会通过火山引擎AI将其转换为对应的Emoji表情。每个字会被转换为一个Emoji，没有合适Emoji的字会使用同音字替代。
        </p>
      </div>
    </div>
  );
};

export default PoetryConverter;