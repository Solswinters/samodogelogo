import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'danger', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Primary utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Primary.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

/**
 * Secondary utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Secondary.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}

/**
 * Danger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Danger.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
}

/**
 * Outline utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Outline.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancel',
  },
}

/**
 * Small utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Small.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

/**
 * Large utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Large.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

/**
 * Disabled utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Disabled.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}
