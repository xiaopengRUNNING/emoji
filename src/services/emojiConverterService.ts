// src/services/emojiConverterService.ts

// 固定的prompt，用于将诗词转换为emoji
const POETRY_TO_EMOJI_PROMPT = `
请将以下诗词转换为对应的emoji表情，要求：
1. 一个字一个字地转换为emoji，例如：停车 转换为 ✋🚗
2. 当某个字没有合适的emoji时，使用同音字和同义词对应的emoji，例如：花好月圆 转换为 🌸👌🌕️💵
3. 直接输出emoji表情，不要包含任何文字说明
4. 使用常见的emoji表情，确保在大多数平台上都能正常显示
5. 保持转换后的emoji顺序与原文字顺序一致
6. 标点符号无需转换，只转换中文字符

输入内容：
`;

// 火山引擎默认配置
const VOLC_ENGINE_CONFIG = {
  endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  model: 'doubao-seed-1-8-251228'
};

// 转换诗词为emoji的实现
export const convertPoetryToEmoji = async (text: string, apiKey: string): Promise<string> => {
  if (!text.trim()) {
    throw new Error('输入内容不能为空');
  }

  if (!apiKey) {
    throw new Error('请输入有效的API密钥');
  }

  const prompt = POETRY_TO_EMOJI_PROMPT + text;

  try {
    const response = await fetch(VOLC_ENGINE_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: VOLC_ENGINE_CONFIG.model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API错误: ${errorData.error?.message || response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content?.trim() || '';

    if (!result) {
      throw new Error('转换失败，请重试');
    }

    return result;
  } catch (error) {
    console.error('转换错误:', error);
    throw error;
  }
};