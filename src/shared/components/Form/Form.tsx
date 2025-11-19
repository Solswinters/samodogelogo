/**
 * Form component with validation
 */

'use client'

import { FormEvent, ReactNode } from 'react'

export interface FormProps {
  onSubmit: (data: FormData) => void | Promise<void>
  children: ReactNode
  className?: string
  id?: string
}

export function Form({ onSubmit, children, className = '', id }: FormProps) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={className} id={id} noValidate>
      {children}
    </form>
  )
}
