/**
 * Crafting system for item creation
 */

export interface RecipeIngredient {
  itemId: string
  quantity: number
}

export interface RecipeOutput {
  itemId: string
  quantity: number
}

export interface RecipeConfig {
  id: string
  name: string
  description: string
  ingredients: RecipeIngredient[]
  output: RecipeOutput
  craftingTime?: number
  requiredLevel?: number
}

export class Recipe {
  id: string
  name: string
  description: string
  ingredients: RecipeIngredient[]
  output: RecipeOutput
  craftingTime: number
  requiredLevel: number

  constructor(config: RecipeConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.ingredients = config.ingredients
    this.output = config.output
    this.craftingTime = config.craftingTime ?? 0
    this.requiredLevel = config.requiredLevel ?? 1
  }

  canCraft(inventory: Map<string, number>, playerLevel: number): boolean {
    if (playerLevel < this.requiredLevel) {
      return false
    }

    for (const ingredient of this.ingredients) {
      const available = inventory.get(ingredient.itemId) ?? 0
      if (available < ingredient.quantity) {
        return false
      }
    }

    return true
  }

  getMissingIngredients(inventory: Map<string, number>): RecipeIngredient[] {
    const missing: RecipeIngredient[] = []

    for (const ingredient of this.ingredients) {
      const available = inventory.get(ingredient.itemId) ?? 0
      const needed = ingredient.quantity - available

      if (needed > 0) {
        missing.push({
          itemId: ingredient.itemId,
          quantity: needed,
        })
      }
    }

    return missing
  }
}
