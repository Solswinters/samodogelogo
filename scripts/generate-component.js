#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

/**
 * Component generator script
 * Usage: npm run generate:component ComponentName [path]
 */

const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const componentName = args[0]
const targetPath = args[1] || 'shared/components'

if (!componentName) {
  console.error('❌ Error: Component name is required')
  console.log('Usage: npm run generate:component ComponentName [path]')
  process.exit(1)
}

// Validate component name
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ Error: Component name must be PascalCase (e.g., MyComponent)')
  process.exit(1)
}

const baseDir = path.join(process.cwd(), 'src', targetPath)
const componentDir = path.join(baseDir, componentName)

// Check if component already exists
if (fs.existsSync(componentDir)) {
  console.error(`❌ Error: Component ${componentName} already exists`)
  process.exit(1)
}

// Create component directory
fs.mkdirSync(componentDir, { recursive: true })

// Component template
const componentTemplate = `import { FC } from 'react'
import styles from './${componentName}.module.css'

export interface ${componentName}Props {
  // Add props here
}

export const ${componentName}: FC<${componentName}Props> = ({}) => {
  return (
    <div className={styles.container}>
      <h2>${componentName}</h2>
    </div>
  )
}
`

// CSS module template
const cssTemplate = `.container {
  /* Add styles here */
}
`

// Test template
const testTemplate = `import { render, screen } from '@testing-library/react'
import { ${componentName} } from './${componentName}'

describe('${componentName}', () => {
  it('should render', () => {
    render(<${componentName} />)
    expect(screen.getByText('${componentName}')).toBeInTheDocument()
  })
})
`

// Storybook template
const storybookTemplate = `import type { Meta, StoryObj } from '@storybook/react'
import { ${componentName} } from './${componentName}'

const meta = {
  title: '${targetPath}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ${componentName}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
`

// Index template
const indexTemplate = `export * from './${componentName}'
`

// Write files
const files = [
  {
    name: `${componentName}.tsx`,
    content: componentTemplate,
  },
  {
    name: `${componentName}.module.css`,
    content: cssTemplate,
  },
  {
    name: `${componentName}.test.tsx`,
    content: testTemplate,
  },
  {
    name: `${componentName}.stories.tsx`,
    content: storybookTemplate,
  },
  {
    name: 'index.ts',
    content: indexTemplate,
  },
]

files.forEach(({ name, content }) => {
  const filePath = path.join(componentDir, name)
  fs.writeFileSync(filePath, content)
  console.log(`✅ Created ${name}`)
})

console.log(`\n✨ Component ${componentName} created successfully!`)
console.log(`📁 Location: ${path.relative(process.cwd(), componentDir)}`)
console.log(`\nNext steps:`)
console.log(`1. Implement your component logic`)
console.log(`2. Add Storybook stories`)
console.log(`3. Write comprehensive tests`)
console.log(`4. Update barrel exports if needed`)
