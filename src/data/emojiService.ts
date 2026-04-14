import { EmojiCategory } from '../types/emoji'
import emojiData from 'emoji-datasource'

// 构建emoji分类数据
export const getEmojiData = (): EmojiCategory[] => {
  // 按分类分组
  const groupedEmojis = emojiData.reduce((acc, emoji) => {
    const category = emoji.category
    
    if (!acc[category]) {
      acc[category] = []
    }
    
    // 只添加有统一码的emoji
    if (emoji.unified) {
      acc[category].push({
        emoji: String.fromCodePoint(...emoji.unified.split('-').map(hex => parseInt(hex, 16))),
        name: emoji.short_name.replace(/^:/, '').replace(/:$/, '')
      })
    }
    
    return acc
  }, {} as Record<string, Array<{ emoji: string; name: string }>>)
  
  // 转换为项目需要的格式
  return Object.entries(groupedEmojis).map(([category, emojis]) => ({
    category: category,
    emojis: emojis.map(item => ({
      emoji: item.emoji,
      name: item.name
    }))
  }))
}

// 获取所有emoji（用于搜索）
export const getAllEmojis = () => {
  const categories = getEmojiData()
  return categories.flatMap(category => category.emojis)
}
