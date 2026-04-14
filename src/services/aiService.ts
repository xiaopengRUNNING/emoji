// src/services/aiService.ts

// 直接调用API的实现
export const directAICall = async (prompt: string, apiKey: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
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
export const streamAICall = (
  prompt: string,
  apiKey: string,
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void
) => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true
    }),
    signal
  })
    .then(response => {
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
    })
    .catch(error => {
      onError(error);
    });

  return () => controller.abort();
};

const VOLC_ENGINE_CONFIG = {
  endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  model: 'doubao-seed-1-8-251228'
};

// 生成著名诗词或成语的函数
export const generateFamousPoetryOrIdiom = async (
  apiKey: string
): Promise<string> => {
  const prompt = `请随机生成一个著名的中国诗词或成语，要求：
1. 诗词选择五言或七言绝句，确保是广为人知的名篇
2. 成语选择常用且知名度高的
3. 只输出诗词或成语本身，不要包含作者信息或解释
4. 输出格式：如果是诗词，直接输出一句完整的诗句；如果是成语，直接输出成语

示例：
诗词示例：举头望明月、两个黄鹂鸣翠柳。
成语示例：画龙点睛`;

  const response = await fetch(VOLC_ENGINE_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: VOLC_ENGINE_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const result = data.choices[0]?.message?.content?.trim() || '';

  if (!result) {
    throw new Error('生成失败，请重试');
  }

  return result;
};
