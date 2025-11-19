/**
 * Transaction status badge component
 */

'use client'

import { Badge } from '@/shared/components/Badge'

export type TransactionStatus = 'pending' | 'confirming' | 'confirmed' | 'failed' | 'cancelled'

interface TransactionStatusBadgeProps {
  status: TransactionStatus
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const config = getStatusConfig(status)

  return <Badge variant={config.variant}>{config.label}</Badge>
}

function getStatusConfig(status: TransactionStatus): {
  label: string
  variant: 'default' | 'primary' | 'success' | 'warning' | 'error'
} {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        variant: 'warning',
      }
    case 'confirming':
      return {
        label: 'Confirming',
        variant: 'primary',
      }
    case 'confirmed':
      return {
        label: 'Confirmed',
        variant: 'success',
      }
    case 'failed':
      return {
        label: 'Failed',
        variant: 'error',
      }
    case 'cancelled':
      return {
        label: 'Cancelled',
        variant: 'default',
      }
    default:
      return {
        label: 'Unknown',
        variant: 'default',
      }
  }
}
