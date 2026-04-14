export interface EmojiItem {
  emoji: string
  name: string
}

export interface EmojiCategory {
  category: string
  emojis: EmojiItem[]
}
