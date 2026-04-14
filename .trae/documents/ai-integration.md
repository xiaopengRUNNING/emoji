# 前端对接AI大模型技术方案

## 1. 概述

本文档详细说明如何在前端项目中对接AI大模型，包括API调用、流式响应处理、错误处理和最佳实践。

## 2. 技术栈

- **前端框架**: React + TypeScript
- **HTTP客户端**: Fetch API (原生) 或 Axios
- **状态管理**: React useState + useEffect
- **UI框架**: Tailwind CSS
- **AI模型**: 支持OpenAI API格式的大模型

## 3. 实现方案

### 3.1 API集成方式

#### 3.1.1 直接调用外部API

**优点**: 实现简单，无需后端
**缺点**: API密钥暴露在前端，安全性低

#### 3.1.2 通过后端代理调用

**优点**: 安全性高，API密钥保存在服务器
**缺点**: 需要额外的后端开发

### 3.2 核心实现

#### 3.2.1 安装必要依赖

```bash
# 如需使用Axios
npm install axios

# 如需使用SSE (Server-Sent Events) 处理流式响应
npm install eventsource
```

#### 3.2.2 创建AI服务模块

```typescript
// src/services/aiService.ts

// 直接调用API的实现
export const directAICall = async (prompt: string, apiKey: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

// 流式调用API的实现
export const streamAICall = (prompt: string, apiKey: string, onChunk: (chunk: string) => void, onError: (error: Error) => void) => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true
    }),
    signal
  }).then(response => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    let buffer = '';

    const processChunk = async () => {
      const { done, value } = await reader.read();

      if (done) {
        return;
      }

      buffer += new TextDecoder().decode(value);

      // 处理SSE格式的响应
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const chunk = JSON.parse(data);
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (error) {
            onError(error as Error);
          }
        }
      }

      processChunk();
    };

    processChunk();
  }).catch(error => {
    onError(error);
  });

  return () => controller.abort();
};
```

#### 3.2.3 创建AI聊天组件

```typescript
// src/components/AIChat.tsx
import React, { useState, useRef } from 'react';
import { streamAICall } from '../services/aiService';

interface AIChatProps {
  apiKey: string;
}

const AIChat: React.FC<AIChatProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessage = { role: 'assistant' as const, content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    scrollToBottom();

    const abort = streamAICall(
      input,
      apiKey,
      (chunk) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content += chunk;
          }
          return newMessages;
        });
        scrollToBottom();
      },
      (error) => {
        console.error('AI call error:', error);
        setIsLoading(false);
      }
    );

    // 模拟完成
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => abort();
  };

  return (
    <div className="flex flex-col h-96 border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">AI Chat</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block p-3 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block p-3 rounded-lg bg-gray-100 animate-pulse">
              <div className="h-2 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-2 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
```

#### 3.2.4 创建主应用集成

```typescript
// src/App.tsx
import React, { useState } from 'react';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Model Integration Demo</h1>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">OpenAI API Key:</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="w-full p-2 border rounded-lg"
        />
        <p className="mt-2 text-sm text-gray-500">
          Note: For production, use a backend proxy to avoid exposing your API key
        </p>
      </div>

      <AIChat apiKey={apiKey} />
    </div>
  );
};

export default App;
```

## 4. 最佳实践

### 4.1 安全性

- **使用后端代理**: 不要在前端存储API密钥
- **环境变量**: 使用.env文件管理API密钥
- **请求限制**: 实现请求频率限制，防止滥用

### 4.2 性能优化

- **流式响应**: 使用SSE或WebSocket实现实时响应
- **防抖**: 对用户输入实现防抖，减少不必要的API调用
- **缓存**: 缓存常见查询的结果

### 4.3 用户体验

- **加载状态**: 显示加载指示器
- **错误处理**: 友好的错误提示
- **进度指示**: 显示AI生成的进度
- **取消功能**: 允许用户取消正在进行的请求

## 5. 部署考虑

- **CORS配置**: 确保API端点允许跨域请求
- **后端部署**: 如果使用后端代理，确保服务器配置正确
- **监控**: 实现基本的错误监控和日志记录

## 6. 扩展功能

- **多模型支持**: 集成不同的AI模型
- **上下文管理**: 维护对话上下文
- **工具集成**: 连接外部工具和服务
- **自定义指令**: 支持系统级指令定制

## 7. 总结

前端对接AI大模型主要通过API调用实现，推荐使用后端代理方式确保安全性。流式响应可以提供更好的用户体验，而良好的错误处理和状态管理则能确保应用的稳定性。

通过本文档的方案，您可以快速在前端项目中集成AI大模型功能，为用户提供智能交互体验。