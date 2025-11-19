/**
 * Custom Webpack plugins
 */

export class BundleSizePlugin {
  constructor(private maxSize: number) {}

  apply(compiler: any) {
    compiler.hooks.done.tap('BundleSizePlugin', (stats: any) => {
      const { assets } = stats.toJson()

      assets.forEach((asset: any) => {
        if (asset.size > this.maxSize) {
          console.warn(
            `⚠️  Bundle ${asset.name} exceeds size limit: ${(asset.size / 1024).toFixed(2)}KB > ${(this.maxSize / 1024).toFixed(2)}KB`
          )
        }
      })
    })
  }
}

export class CircularDependencyPlugin {
  apply(compiler: any) {
    compiler.hooks.compilation.tap('CircularDependencyPlugin', (compilation: any) => {
      const detectedCycles = new Set<string>()

      compilation.hooks.optimizeModules.tap('CircularDependencyPlugin', (modules: any[]) => {
        modules.forEach(module => {
          if (module.reasons) {
            const path: string[] = []
            this.detectCycle(module, path, detectedCycles)
          }
        })

        if (detectedCycles.size > 0) {
          console.warn(`Found ${detectedCycles.size} circular dependencies`)
          detectedCycles.forEach(cycle => console.warn(`  ${cycle}`))
        }
      })
    })
  }

  private detectCycle(module: any, path: string[], detectedCycles: Set<string>) {
    if (path.includes(module.resource)) {
      const cycle = [...path, module.resource].join(' -> ')
      detectedCycles.add(cycle)
      return
    }

    if (module.reasons) {
      module.reasons.forEach((reason: any) => {
        if (reason.module) {
          this.detectCycle(reason.module, [...path, module.resource], detectedCycles)
        }
      })
    }
  }
}

