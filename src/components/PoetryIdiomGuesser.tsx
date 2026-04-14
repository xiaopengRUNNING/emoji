import React, { useState, useEffect } from 'react';
import { generateFamousPoetryOrIdiom } from '../services/aiService';
import { convertPoetryToEmoji } from '../services/emojiConverterService';

interface PoetryIdiomGuesserProps {
  apiKey: string;
}

// 简单的加密函数
const encrypt = (text: string): string => {
  return btoa(unescape(encodeURIComponent(text)));
};

// 简单的解密函数
const decrypt = (text: string): string => {
  return decodeURIComponent(escape(atob(text)));
};

// 获取当前日期的字符串表示（YYYY-MM-DD）
const getCurrentDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const PoetryIdiomGuesser: React.FC<PoetryIdiomGuesserProps> = ({ apiKey }) => {
  const [emoji, setEmoji] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState('');

  // 初始化时检查是否已有当日题目
  useEffect(() => {
    if (!apiKey) return;

    const checkDailyQuestion = async () => {
      try {
        const storedData = localStorage.getItem('dailyPoetryQuestion');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const { date, encryptedEmoji, encryptedAnswer } = parsedData;
          
          // 检查是否是当天的题目
          if (date === getCurrentDate()) {
            // 解密并加载数据
            const decryptedEmoji = decrypt(encryptedEmoji);
            const decryptedAnswer = decrypt(encryptedAnswer);
            setEmoji(decryptedEmoji);
            setCorrectAnswer(decryptedAnswer);
            return;
          }
        }
        
        // 如果没有当日题目，生成新题目
        await handleGenerate();
      } catch (err) {
        console.error('加载每日题目失败:', err);
        // 加载失败时生成新题目
        await handleGenerate();
      }
    };

    checkDailyQuestion();
  }, [apiKey]);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('请输入有效的API密钥');
      return;
    }

    setIsLoading(true);
    setError('');
    setEmoji('');
    setAnswer('');
    setFeedback('');
    setIsCorrect(null);
    setCorrectAnswer('');

    try {
      // 生成著名诗词或成语
      const poetryOrIdiom = await generateFamousPoetryOrIdiom(apiKey);
      setCorrectAnswer(poetryOrIdiom);
      
      // 转换为Emoji
      const emojiResult = await convertPoetryToEmoji(poetryOrIdiom, apiKey);
      setEmoji(emojiResult);

      // 加密并存储到本地存储
      const encryptedEmoji = encrypt(emojiResult);
      const encryptedAnswer = encrypt(poetryOrIdiom);
      const currentDate = getCurrentDate();
      
      const dataToStore = {
        date: currentDate,
        encryptedEmoji,
        encryptedAnswer
      };
      
      localStorage.setItem('dailyPoetryQuestion', JSON.stringify(dataToStore));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('请输入答案');
      return;
    }

    // 实现宽松的答案验证逻辑
    const userAnswer = answer.trim().replace(/\s+/g, '');
    const correctAnswerClean = correctAnswer.trim().replace(/\s+/g, '');
    
    const isCorrectAnswer = userAnswer === correctAnswerClean;
    setIsCorrect(isCorrectAnswer);
    
    if (isCorrectAnswer) {
      setFeedback('恭喜你，答对了！');
    } else {
      setFeedback('很遗憾，答错了！');
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">猜诗词和成语</h2>
        <p className="text-gray-600">根据Emoji表情猜测对应的诗词或成语</p>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            生成中...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            生成新题目
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

      {emoji && (
        <div className="mt-10 animate-fadeIn">
          <h3 className="font-semibold text-gray-700 text-lg mb-6">猜一猜这是什么？</h3>
          <div className="p-8 border border-gray-200 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-center shadow-inner">
            <div className="text-5xl sm:text-6xl md:text-7xl font-light">{emoji}</div>
          </div>

          <div className="mt-8">
            <label className="block mb-3 font-medium text-gray-700">输入你的答案</label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="请输入诗词或成语"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
            
            <button
              onClick={handleSubmit}
              disabled={isLoading || !answer.trim()}
              className="mt-5 w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            >
              提交答案
            </button>
          </div>

          {feedback && (
            <div className={`mt-6 p-5 rounded-xl border ${isCorrect ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} animate-fadeIn`}>
              <div className="flex items-start">
                <svg className={`w-6 h-6 mr-3 mt-0.5 ${isCorrect ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isCorrect ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.633-1.964-.633-2.732 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                </svg>
                <div>
                  <p className="text-lg font-medium">{feedback}</p>
                  {!isCorrect && correctAnswer && (
                    <p className="mt-2 text-sm font-medium">正确答案：{correctAnswer}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 text-sm text-gray-600 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
        <p className="flex items-start">
          <svg className="w-4 h-4 mr-3 mt-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          提示：点击"生成新题目"按钮，系统会通过AI生成一个著名的诗词或成语，并将其转换为Emoji表情。根据Emoji表情猜测对应的诗词或成语，输入答案后点击"提交答案"按钮查看结果。
        </p>
      </div>
    </div>
  );
};

export default PoetryIdiomGuesser;