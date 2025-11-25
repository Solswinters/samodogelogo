/**
 * Diagnostic utilities
 */

export interface DiagnosticInfo {
  connection: {
    status: string
    latency: number
    packetLoss: number
    jitter: number
  }
  performance: {
    fps: number
    frameTime: number
    memoryUsage: number
  }
  network: {
    bytesSent: number
    bytesReceived: number
    messagesPerSecond: number
  }
  errors: Array<{
    type: string
    message: string
    timestamp: number
  }>
}

export class Diagnostics {
  private startTime = Date.now()
  private frameCount = 0
  private lastFrameTime = Date.now()
  private errors: DiagnosticInfo['errors'] = []

  recordFrame(): void {
    this.frameCount++
  }

  recordError(type: string, message: string): void {
    this.errors.push({
      type,
      message,
      timestamp: Date.now(),
    })

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors.shift()
    }
  }

  getFPS(): number {
    const now = Date.now()
    const elapsed = (now - this.lastFrameTime) / 1000
    this.lastFrameTime = now

    if (elapsed === 0) return 0
    return Math.round(1 / elapsed)
  }

  getAverageFPS(): number {
    const elapsed = (Date.now() - this.startTime) / 1000
    if (elapsed === 0) return 0
    return Math.round(this.frameCount / elapsed)
  }

  getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return Math.round(memory.usedJSHeapSize / 1048576) // MB
    }
    return 0
  }

  getErrors(): DiagnosticInfo['errors'] {
    return [...this.errors]
  }

  getRecentErrors(count = 10): DiagnosticInfo['errors'] {
    return this.errors.slice(-count)
  }

  clearErrors(): void {
    this.errors = []
  }

  reset(): void {
    this.startTime = Date.now()
    this.frameCount = 0
    this.lastFrameTime = Date.now()
    this.errors = []
  }

  generateReport(
    connectionInfo: DiagnosticInfo['connection'],
    networkInfo: DiagnosticInfo['network']
  ): DiagnosticInfo {
    return {
      connection: connectionInfo,
      performance: {
        fps: this.getFPS(),
        frameTime: 1000 / this.getFPS(),
        memoryUsage: this.getMemoryUsage(),
      },
      network: networkInfo,
      errors: this.getRecentErrors(),
    }
  }
}

/**
 * formatDiagnostics utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatDiagnostics.
 */
export function formatDiagnostics(info: DiagnosticInfo): string {
  return `
Connection:
  Status: ${info.connection.status}
  Latency: ${info.connection.latency}ms
  Packet Loss: ${(info.connection.packetLoss * 100).toFixed(1)}%
  Jitter: ${info.connection.jitter.toFixed(1)}ms

Performance:
  FPS: ${info.performance.fps}
  Frame Time: ${info.performance.frameTime.toFixed(2)}ms
  Memory: ${info.performance.memoryUsage}MB

Network:
  Sent: ${(info.network.bytesSent / 1024).toFixed(2)}KB
  Received: ${(info.network.bytesReceived / 1024).toFixed(2)}KB
  Messages/sec: ${info.network.messagesPerSecond}

Recent Errors: ${info.errors.length}
`.trim()
}
