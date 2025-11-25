/**
 * Chat box component
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { Card } from '@/shared/components/Card'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import { formatDistanceToNow } from '@/shared/date'

interface ChatBoxProps {
  channelId: string
  playerId: string
  username: string
  height?: string
}

/**
 * ChatBox utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ChatBox.
 */
export function ChatBox({ channelId, playerId, username, height = '400px' }: ChatBoxProps) {
  const { messages, sendMessage } = useChat(channelId)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    try {
      sendMessage(playerId, username, inputValue)
      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="flex flex-col p-4" style={{ height }}>
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-white">{message.username}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.timestamp))}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-300">{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!inputValue.trim()} variant="primary">
          Send
        </Button>
      </div>
    </Card>
  )
}
