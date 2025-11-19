/**
 * Component generator utility
 */

export interface ComponentOptions {
  name: string
  type: 'functional' | 'class'
  typescript: boolean
  styled: boolean
  test: boolean
}

export function generateComponent(options: ComponentOptions): Record<string, string> {
  const { name, typescript, styled, test } = options
  const ext = typescript ? 'tsx' : 'jsx'
  const files: Record<string, string> = {}

  // Component file
  files[`${name}.${ext}`] = `
/**
 * ${name} component
 */

'use client'

export interface ${name}Props {
  className?: string
  children?: React.ReactNode
}

export function ${name}({ className = '', children }: ${name}Props) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
`.trim()

  // Test file
  if (test) {
    files[`${name}.test.${ext}`] = `
import { render, screen } from '@testing-library/react'
import { ${name} } from './${name}'

describe('${name}', () => {
  it('renders children', () => {
    render(<${name}>Test content</${name}>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
`.trim()
  }

  // Index file
  files['index.ts'] = `export { ${name} } from './${name}'
export type { ${name}Props } from './${name}'`

  return files
}

export function writeComponentFiles(
  basePath: string,
  componentName: string,
  files: Record<string, string>
) {
  console.log(`Generating component: ${componentName}`)
  console.log(`Base path: ${basePath}`)
  console.log('Files:', Object.keys(files))
  // In real implementation, write files to disk
}
