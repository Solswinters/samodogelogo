/**
 * Chat input component
 */

'use client'

import { useState, KeyboardEvent } from 'react'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  maxLength?: number
  placeholder?: string
}

/**
 * ChatInput utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ChatInput.
 */
export function ChatInput({
  onSend,
  disabled = false,
  maxLength = 500,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmed = message.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="flex-1"
      />
      <Button onClick={handleSend} disabled={!message.trim() || disabled}>
        Send
      </Button>
    </div>
  )
}
