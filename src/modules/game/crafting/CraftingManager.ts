/**
 * Manager for crafting system
 */

import { Recipe, RecipeConfig } from './Recipe'

interface CraftingJob {
  recipeId: string
  startTime: number
  completionTime: number
}

export class CraftingManager {
  private recipes: Map<string, Recipe>
  private craftingQueue: CraftingJob[]
  private maxQueueSize: number

  constructor(maxQueueSize = 5) {
    this.recipes = new Map()
    this.craftingQueue = []
    this.maxQueueSize = maxQueueSize
  }

  addRecipe(config: RecipeConfig): Recipe {
    const recipe = new Recipe(config)
    this.recipes.set(config.id, recipe)
    return recipe
  }

  getRecipe(id: string): Recipe | undefined {
    return this.recipes.get(id)
  }

  getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values())
  }

  getAvailableRecipes(inventory: Map<string, number>, playerLevel: number): Recipe[] {
    return this.getAllRecipes().filter(recipe => recipe.canCraft(inventory, playerLevel))
  }

  startCrafting(recipeId: string): boolean {
    const recipe = this.recipes.get(recipeId)
    if (!recipe) {
      return false
    }

    if (this.craftingQueue.length >= this.maxQueueSize) {
      return false
    }

    const now = Date.now()
    this.craftingQueue.push({
      recipeId,
      startTime: now,
      completionTime: now + recipe.craftingTime,
    })

    return true
  }

  update(): string[] {
    const completed: string[] = []
    const now = Date.now()

    this.craftingQueue = this.craftingQueue.filter(job => {
      if (now >= job.completionTime) {
        completed.push(job.recipeId)
        return false
      }
      return true
    })

    return completed
  }

  getCraftingQueue(): CraftingJob[] {
    return [...this.craftingQueue]
  }

  getQueueProgress(): number[] {
    const now = Date.now()
    return this.craftingQueue.map(job => {
      const elapsed = now - job.startTime
      const total = job.completionTime - job.startTime
      return Math.min((elapsed / total) * 100, 100)
    })
  }

  cancelCrafting(index: number): boolean {
    if (index < 0 || index >= this.craftingQueue.length) {
      return false
    }

    this.craftingQueue.splice(index, 1)
    return true
  }

  clearQueue(): void {
    this.craftingQueue = []
  }

  getStats() {
    return {
      totalRecipes: this.recipes.size,
      queueSize: this.craftingQueue.length,
      queueCapacity: this.maxQueueSize,
    }
  }
}
