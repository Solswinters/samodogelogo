import { checkAABB, AABB } from '@/modules/game/physics/collision/aabb'

describe('AABB Collision Detection', () => {
  it('should detect collision between overlapping boxes', () => {
    const box1: AABB = { x: 0, y: 0, width: 50, height: 50 }
    const box2: AABB = { x: 25, y: 25, width: 50, height: 50 }
    expect(checkAABB(box1, box2)).toBe(true)
  })

  it('should not detect collision for separate boxes', () => {
    const box1: AABB = { x: 0, y: 0, width: 50, height: 50 }
    const box2: AABB = { x: 100, y: 100, width: 50, height: 50 }
    expect(checkAABB(box1, box2)).toBe(false)
  })

  it('should detect edge collision', () => {
    const box1: AABB = { x: 0, y: 0, width: 50, height: 50 }
    const box2: AABB = { x: 50, y: 0, width: 50, height: 50 }
    expect(checkAABB(box1, box2)).toBe(true)
  })

  it('should handle completely overlapping boxes', () => {
    const box1: AABB = { x: 0, y: 0, width: 50, height: 50 }
    const box2: AABB = { x: 10, y: 10, width: 20, height: 20 }
    expect(checkAABB(box1, box2)).toBe(true)
  })
})
