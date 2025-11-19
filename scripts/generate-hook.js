#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

/**
 * Hook generator script
 * Usage: npm run generate:hook hookName [path]
 */

const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const hookName = args[0]
const targetPath = args[1] || 'hooks'

if (!hookName) {
  console.error('❌ Error: Hook name is required')
  console.log('Usage: npm run generate:hook hookName [path]')
  process.exit(1)
}

// Validate hook name
if (!/^use[A-Z][a-zA-Z0-9]*$/.test(hookName)) {
  console.error('❌ Error: Hook name must start with "use" and be camelCase (e.g., useMyHook)')
  process.exit(1)
}

const baseDir = path.join(process.cwd(), 'src', targetPath)
const hookFile = path.join(baseDir, `${hookName}.ts`)
const testFile = path.join(process.cwd(), 'src', '__tests__', targetPath, `${hookName}.test.ts`)

// Check if hook already exists
if (fs.existsSync(hookFile)) {
  console.error(`❌ Error: Hook ${hookName} already exists`)
  process.exit(1)
}

// Create directories
fs.mkdirSync(baseDir, { recursive: true })
fs.mkdirSync(path.dirname(testFile), { recursive: true })

// Hook template
const hookTemplate = `import { useState, useEffect } from 'react'

/**
 * ${hookName} - Custom React hook
 */
export function ${hookName}() {
  const [value, setValue] = useState<unknown>(null)

  useEffect(() => {
    // Add effect logic here
  }, [])

  return value
}
`

// Test template
const testTemplate = `import { renderHook } from '@testing-library/react'
import { ${hookName} } from '@/${targetPath}/${hookName}'

describe('${hookName}', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => ${hookName}())
    expect(result.current).toBeDefined()
  })

  // Add more tests here
})
`

// Write files
fs.writeFileSync(hookFile, hookTemplate)
console.log(`✅ Created ${hookName}.ts`)

fs.writeFileSync(testFile, testTemplate)
console.log(`✅ Created ${hookName}.test.ts`)

console.log(`\n✨ Hook ${hookName} created successfully!`)
console.log(`📁 Location: ${path.relative(process.cwd(), hookFile)}`)
console.log(`\nNext steps:`)
console.log(`1. Implement your hook logic`)
console.log(`2. Write comprehensive tests`)
console.log(`3. Add JSDoc comments`)
console.log(`4. Update barrel exports in ${targetPath}/index.ts`)
