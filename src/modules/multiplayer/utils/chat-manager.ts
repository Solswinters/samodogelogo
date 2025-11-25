/**
 * Chat management utilities for multiplayer
 */

export interface ChatMessage {
  id: string
  playerId: string
  playerName: string
  message: string
  timestamp: number
  type: 'player' | 'system'
}

let messageIdCounter = 0

/**
 * generateMessageId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateMessageId.
 */
export function generateMessageId(): string {
  messageIdCounter++
  return `msg-${Date.now()}-${messageIdCounter}`
}

/**
 * createChatMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createChatMessage.
 */
export function createChatMessage(
  playerId: string,
  playerName: string,
  message: string
): ChatMessage {
  return {
    id: generateMessageId(),
    playerId,
    playerName,
    message: sanitizeChatMessage(message),
    timestamp: Date.now(),
    type: 'player',
  }
}

/**
 * createSystemMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createSystemMessage.
 */
export function createSystemMessage(message: string): ChatMessage {
  return {
    id: generateMessageId(),
    playerId: 'system',
    playerName: 'System',
    message,
    timestamp: Date.now(),
    type: 'system',
  }
}

/**
 * sanitizeChatMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeChatMessage.
 */
export function sanitizeChatMessage(message: string): string {
  return message.trim().slice(0, 200).replace(/[<>]/g, '')
}

/**
 * isValidChatMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidChatMessage.
 */
export function isValidChatMessage(message: string): boolean {
  const trimmed = message.trim()
  return trimmed.length > 0 && trimmed.length <= 200
}

/**
 * formatTimestamp utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatTimestamp.
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export class ChatHistory {
  private messages: ChatMessage[] = []
  private readonly maxMessages = 100

  addMessage(message: ChatMessage): void {
    this.messages.push(message)

    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages)
    }
  }

  getMessages(): ChatMessage[] {
    return [...this.messages]
  }

  getRecentMessages(count: number): ChatMessage[] {
    return this.messages.slice(-count)
  }

  clear(): void {
    this.messages = []
  }

  getMessageCount(): number {
    return this.messages.length
  }
}
