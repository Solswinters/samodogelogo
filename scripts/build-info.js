#!/usr/bin/env node

/**
 * Generate build information
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function getBuildInfo() {
  try {
    const gitCommit = execSync('git rev-parse HEAD').toString().trim()
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    const buildTime = new Date().toISOString()
    const version = require('../package.json').version

    return {
      version,
      commit: gitCommit,
      branch: gitBranch,
      buildTime,
      nodeVersion: process.version,
    }
  } catch (error) {
    console.error('Error generating build info:', error.message)
    return {
      version: '0.0.0',
      commit: 'unknown',
      branch: 'unknown',
      buildTime: new Date().toISOString(),
      nodeVersion: process.version,
    }
  }
}

function writeBuildInfo() {
  const buildInfo = getBuildInfo()
  const outputPath = path.join(__dirname, '../public/build-info.json')

  fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2))

  // eslint-disable-next-line no-console
  console.log('✅ Build info generated:')
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(buildInfo, null, 2))
}

writeBuildInfo()
