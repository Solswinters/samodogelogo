/**
 * Animation system for smooth transitions
 */

export type EasingFunction = (t: number) => number

export const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
}

export interface Animation {
  id: string
  from: number
  to: number
  duration: number
  elapsed: number
  easing: EasingFunction
  onUpdate: (value: number) => void
  onComplete?: () => void
}

export class Animator {
  private animations: Map<string, Animation> = new Map()

  animate(
    id: string,
    from: number,
    to: number,
    duration: number,
    onUpdate: (value: number) => void,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): void {
    const animation: Animation = {
      id,
      from,
      to,
      duration,
      elapsed: 0,
      easing: options.easing || Easing.linear,
      onUpdate,
      onComplete: options.onComplete,
    }

    this.animations.set(id, animation)
  }

  update(deltaTime: number): void {
    for (const [id, animation] of this.animations.entries()) {
      animation.elapsed += deltaTime

      const progress = Math.min(animation.elapsed / animation.duration, 1)
      const easedProgress = animation.easing(progress)
      const value = animation.from + (animation.to - animation.from) * easedProgress

      animation.onUpdate(value)

      if (progress >= 1) {
        animation.onComplete?.()
        this.animations.delete(id)
      }
    }
  }

  cancel(id: string): void {
    this.animations.delete(id)
  }

  cancelAll(): void {
    this.animations.clear()
  }

  isAnimating(id: string): boolean {
    return this.animations.has(id)
  }
}
