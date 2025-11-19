/**
 * In-game UI management system
 */

export interface UIElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  visible: boolean
  enabled: boolean
  render: (ctx: CanvasRenderingContext2D) => void
  onClick?: (x: number, y: number) => void
}

export class UIManager {
  private elements: Map<string, UIElement>
  private zOrder: string[]

  constructor() {
    this.elements = new Map()
    this.zOrder = []
  }

  addElement(element: UIElement, zIndex?: number): void {
    this.elements.set(element.id, element)

    if (zIndex !== undefined) {
      this.zOrder.splice(zIndex, 0, element.id)
    } else {
      this.zOrder.push(element.id)
    }
  }

  removeElement(id: string): void {
    this.elements.delete(id)
    const index = this.zOrder.indexOf(id)
    if (index !== -1) {
      this.zOrder.splice(index, 1)
    }
  }

  getElement(id: string): UIElement | undefined {
    return this.elements.get(id)
  }

  setVisible(id: string, visible: boolean): void {
    const element = this.elements.get(id)
    if (element) {
      element.visible = visible
    }
  }

  setEnabled(id: string, enabled: boolean): void {
    const element = this.elements.get(id)
    if (element) {
      element.enabled = enabled
    }
  }

  handleClick(x: number, y: number): boolean {
    // Check elements in reverse z-order (top to bottom)
    for (let i = this.zOrder.length - 1; i >= 0; i--) {
      const id = this.zOrder[i]
      const element = this.elements.get(id!)

      if (!element || !element.visible || !element.enabled) {
        continue
      }

      const inBounds =
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height

      if (inBounds && element.onClick) {
        element.onClick(x - element.x, y - element.y)
        return true
      }
    }

    return false
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const id of this.zOrder) {
      const element = this.elements.get(id)

      if (element && element.visible) {
        ctx.save()
        element.render(ctx)
        ctx.restore()
      }
    }
  }

  setZIndex(id: string, zIndex: number): void {
    const index = this.zOrder.indexOf(id)
    if (index !== -1) {
      this.zOrder.splice(index, 1)
      this.zOrder.splice(zIndex, 0, id)
    }
  }

  clear(): void {
    this.elements.clear()
    this.zOrder = []
  }

  getVisibleElements(): UIElement[] {
    return this.zOrder
      .map(id => this.elements.get(id))
      .filter((el): el is UIElement => el !== undefined && el.visible)
  }
}
