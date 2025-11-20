/**
 * Background Manager - Handle parallax scrolling backgrounds
 */

export interface BackgroundLayer {
  id: string
  image: string | HTMLImageElement
  x: number
  y: number
  width: number
  height: number
  speed: number
  repeat: boolean
  opacity: number
  scale: number
  offset: number
}

export interface BackgroundConfig {
  layers: Array<{
    image: string
    speed: number
    repeat?: boolean
    opacity?: number
    scale?: number
  }>
  baseSpeed: number
  autoScroll: boolean
}

export class BackgroundManager {
  private layers: BackgroundLayer[] = []
  private config: BackgroundConfig
  private canvasWidth: number
  private canvasHeight: number
  private isPaused: boolean = false
  private baseSpeed: number

  constructor(config: BackgroundConfig, canvasWidth: number, canvasHeight: number) {
    this.config = config
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.baseSpeed = config.baseSpeed
    this.initializeLayers()
  }

  /**
   * Initialize background layers
   */
  private initializeLayers(): void {
    this.config.layers.forEach((layerConfig, index) => {
      const layer: BackgroundLayer = {
        id: `layer-${index}`,
        image: layerConfig.image,
        x: 0,
        y: 0,
        width: this.canvasWidth,
        height: this.canvasHeight,
        speed: layerConfig.speed,
        repeat: layerConfig.repeat ?? true,
        opacity: layerConfig.opacity ?? 1,
        scale: layerConfig.scale ?? 1,
        offset: 0,
      }

      this.layers.push(layer)
    })
  }

  /**
   * Update background layers
   */
  update(deltaTime: number): void {
    if (this.isPaused || !this.config.autoScroll) {
      return
    }

    this.layers.forEach((layer) => {
      // Move layer based on speed
      layer.offset += layer.speed * this.baseSpeed * deltaTime * 0.06

      // Reset offset for seamless loop
      if (layer.repeat && layer.offset >= layer.width) {
        layer.offset = 0
      }
    })
  }

  /**
   * Render background layers
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save()

    this.layers.forEach((layer) => {
      ctx.globalAlpha = layer.opacity

      if (layer.repeat) {
        // Draw repeating background
        const numRepeats = Math.ceil(this.canvasWidth / layer.width) + 1

        for (let i = 0; i < numRepeats; i++) {
          const x = i * layer.width - layer.offset

          if (typeof layer.image === 'string') {
            // Placeholder for image loading
            ctx.fillStyle = this.getPlaceholderColor(layer.id)
            ctx.fillRect(x, layer.y, layer.width, layer.height)
          } else {
            ctx.drawImage(
              layer.image,
              x,
              layer.y,
              layer.width * layer.scale,
              layer.height * layer.scale
            )
          }
        }
      } else {
        // Draw single background
        const x = -layer.offset

        if (typeof layer.image === 'string') {
          ctx.fillStyle = this.getPlaceholderColor(layer.id)
          ctx.fillRect(x, layer.y, layer.width, layer.height)
        } else {
          ctx.drawImage(
            layer.image,
            x,
            layer.y,
            layer.width * layer.scale,
            layer.height * layer.scale
          )
        }
      }
    })

    ctx.restore()
  }

  /**
   * Get placeholder color for layer
   */
  private getPlaceholderColor(layerId: string): string {
    const colors = ['#87CEEB', '#B0E0E6', '#ADD8E6', '#E0F6FF']
    const index = parseInt(layerId.split('-')[1]) % colors.length
    return colors[index]
  }

  /**
   * Add layer
   */
  addLayer(layerConfig: BackgroundConfig['layers'][0]): void {
    const layer: BackgroundLayer = {
      id: `layer-${this.layers.length}`,
      image: layerConfig.image,
      x: 0,
      y: 0,
      width: this.canvasWidth,
      height: this.canvasHeight,
      speed: layerConfig.speed,
      repeat: layerConfig.repeat ?? true,
      opacity: layerConfig.opacity ?? 1,
      scale: layerConfig.scale ?? 1,
      offset: 0,
    }

    this.layers.push(layer)
  }

  /**
   * Remove layer
   */
  removeLayer(layerId: string): void {
    const index = this.layers.findIndex((l) => l.id === layerId)

    if (index !== -1) {
      this.layers.splice(index, 1)
    }
  }

  /**
   * Get layer by ID
   */
  getLayer(layerId: string): BackgroundLayer | undefined {
    return this.layers.find((l) => l.id === layerId)
  }

  /**
   * Set layer speed
   */
  setLayerSpeed(layerId: string, speed: number): void {
    const layer = this.getLayer(layerId)

    if (layer) {
      layer.speed = speed
    }
  }

  /**
   * Set layer opacity
   */
  setLayerOpacity(layerId: string, opacity: number): void {
    const layer = this.getLayer(layerId)

    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity))
    }
  }

  /**
   * Set layer scale
   */
  setLayerScale(layerId: string, scale: number): void {
    const layer = this.getLayer(layerId)

    if (layer) {
      layer.scale = scale
    }
  }

  /**
   * Set base speed
   */
  setBaseSpeed(speed: number): void {
    this.baseSpeed = speed
  }

  /**
   * Get base speed
   */
  getBaseSpeed(): number {
    return this.baseSpeed
  }

  /**
   * Pause scrolling
   */
  pause(): void {
    this.isPaused = true
  }

  /**
   * Resume scrolling
   */
  resume(): void {
    this.isPaused = false
  }

  /**
   * Toggle pause
   */
  togglePause(): void {
    this.isPaused = !this.isPaused
  }

  /**
   * Check if paused
   */
  isPausedState(): boolean {
    return this.isPaused
  }

  /**
   * Reset all layers
   */
  reset(): void {
    this.layers.forEach((layer) => {
      layer.offset = 0
    })
  }

  /**
   * Clear all layers
   */
  clear(): void {
    this.layers = []
  }

  /**
   * Get all layers
   */
  getLayers(): BackgroundLayer[] {
    return [...this.layers]
  }

  /**
   * Set canvas size
   */
  setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width
    this.canvasHeight = height

    // Update layer dimensions
    this.layers.forEach((layer) => {
      layer.width = width
      layer.height = height
    })
  }

  /**
   * Load layer image
   */
  async loadLayerImage(layerId: string, imageSrc: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const layer = this.getLayer(layerId)

      if (!layer) {
        reject(new Error(`Layer ${layerId} not found`))
        return
      }

      const img = new Image()

      img.onload = () => {
        layer.image = img
        resolve()
      }

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageSrc}`))
      }

      img.src = imageSrc
    })
  }

  /**
   * Load all layer images
   */
  async loadAllImages(): Promise<void> {
    const promises = this.layers
      .filter((layer) => typeof layer.image === 'string')
      .map((layer) => this.loadLayerImage(layer.id, layer.image as string))

    await Promise.all(promises)
  }

  /**
   * Get layer count
   */
  getLayerCount(): number {
    return this.layers.length
  }

  /**
   * Reorder layers
   */
  reorderLayers(layerIds: string[]): void {
    const reorderedLayers: BackgroundLayer[] = []

    layerIds.forEach((id) => {
      const layer = this.layers.find((l) => l.id === id)
      if (layer) {
        reorderedLayers.push(layer)
      }
    })

    this.layers = reorderedLayers
  }

  /**
   * Get layer index
   */
  getLayerIndex(layerId: string): number {
    return this.layers.findIndex((l) => l.id === layerId)
  }

  /**
   * Move layer up
   */
  moveLayerUp(layerId: string): void {
    const index = this.getLayerIndex(layerId)

    if (index > 0) {
      const temp = this.layers[index]
      this.layers[index] = this.layers[index - 1]
      this.layers[index - 1] = temp
    }
  }

  /**
   * Move layer down
   */
  moveLayerDown(layerId: string): void {
    const index = this.getLayerIndex(layerId)

    if (index < this.layers.length - 1 && index !== -1) {
      const temp = this.layers[index]
      this.layers[index] = this.layers[index + 1]
      this.layers[index + 1] = temp
    }
  }
}

export default BackgroundManager
