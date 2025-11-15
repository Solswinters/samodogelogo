/**
 * Chat system with moderation
 */

import { IService } from "@/common/interfaces";

export interface ChatMessage {
  id: string;
  roomId: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
  type: "user" | "system" | "announcement";
}

export interface ChatFilter {
  bannedWords: string[];
  maxLength: number;
  rateLimitMs: number;
}

const DEFAULT_FILTER: ChatFilter = {
  bannedWords: ["spam", "bad", "offensive"],
  maxLength: 200,
  rateLimitMs: 1000,
};

export class ChatService implements IService {
  public readonly serviceName = "ChatService";
  private messages: Map<string, ChatMessage[]> = new Map();
  private filter: ChatFilter = DEFAULT_FILTER;
  private lastMessageTime: Map<string, number> = new Map();
  private nextId = 0;

  /**
   * Send message
   */
  sendMessage(
    roomId: string,
    playerId: string,
    playerName: string,
    content: string
  ): ChatMessage | null {
    // Rate limiting
    const lastTime = this.lastMessageTime.get(playerId) ?? 0;
    const now = Date.now();
    if (now - lastTime < this.filter.rateLimitMs) {
      return null; // Rate limited
    }

    // Validate and filter message
    const filtered = this.filterMessage(content);
    if (!filtered) return null;

    const message: ChatMessage = {
      id: `msg-${this.nextId++}`,
      roomId,
      playerId,
      playerName,
      content: filtered,
      timestamp: now,
      type: "user",
    };

    // Store message
    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, []);
    }
    this.messages.get(roomId)!.push(message);

    // Update rate limit
    this.lastMessageTime.set(playerId, now);

    return message;
  }

  /**
   * Send system message
   */
  sendSystemMessage(roomId: string, content: string): ChatMessage {
    const message: ChatMessage = {
      id: `msg-${this.nextId++}`,
      roomId,
      playerId: "system",
      playerName: "System",
      content,
      timestamp: Date.now(),
      type: "system",
    };

    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, []);
    }
    this.messages.get(roomId)!.push(message);

    return message;
  }

  /**
   * Get room messages
   */
  getMessages(roomId: string, limit?: number): ChatMessage[] {
    const messages = this.messages.get(roomId) ?? [];
    return limit ? messages.slice(-limit) : messages;
  }

  /**
   * Filter message content
   */
  private filterMessage(content: string): string | null {
    // Check length
    if (content.length > this.filter.maxLength) {
      return null;
    }

    // Check banned words
    const lowerContent = content.toLowerCase();
    for (const word of this.filter.bannedWords) {
      if (lowerContent.includes(word.toLowerCase())) {
        return null;
      }
    }

    return content.trim();
  }

  /**
   * Clear room messages
   */
  clearRoom(roomId: string): void {
    this.messages.delete(roomId);
  }

  destroy(): void {
    this.messages.clear();
    this.lastMessageTime.clear();
  }
}

