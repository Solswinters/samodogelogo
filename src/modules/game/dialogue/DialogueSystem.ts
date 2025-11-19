/**
 * Dialogue system for in-game conversations
 */

export interface DialogueChoice {
  id: string
  text: string
  nextNodeId: string | null
  condition?: () => boolean
}

export interface DialogueNode {
  id: string
  speaker: string
  text: string
  choices?: DialogueChoice[]
  autoAdvance?: boolean
  delay?: number
}

export interface DialogueTree {
  id: string
  startNodeId: string
  nodes: Map<string, DialogueNode>
}

export class DialogueSystem {
  private trees: Map<string, DialogueTree>
  private currentTree: DialogueTree | null
  private currentNode: DialogueNode | null
  private history: string[]

  constructor() {
    this.trees = new Map()
    this.currentTree = null
    this.currentNode = null
    this.history = []
  }

  addTree(tree: DialogueTree): void {
    this.trees.set(tree.id, tree)
  }

  startDialogue(treeId: string): boolean {
    const tree = this.trees.get(treeId)
    if (!tree) {
      return false
    }

    this.currentTree = tree
    const startNode = tree.nodes.get(tree.startNodeId)
    if (!startNode) {
      return false
    }

    this.currentNode = startNode
    this.history = [startNode.id]
    return true
  }

  makeChoice(choiceId: string): boolean {
    if (!this.currentNode || !this.currentTree) {
      return false
    }

    const choice = this.currentNode.choices?.find(c => c.id === choiceId)
    if (!choice) {
      return false
    }

    // Check condition
    if (choice.condition && !choice.condition()) {
      return false
    }

    // End dialogue if no next node
    if (!choice.nextNodeId) {
      this.endDialogue()
      return true
    }

    // Move to next node
    const nextNode = this.currentTree.nodes.get(choice.nextNodeId)
    if (!nextNode) {
      return false
    }

    this.currentNode = nextNode
    this.history.push(nextNode.id)
    return true
  }

  advance(): boolean {
    if (!this.currentNode || !this.currentTree) {
      return false
    }

    if (this.currentNode.autoAdvance && this.currentNode.choices?.length === 1) {
      return this.makeChoice(this.currentNode.choices[0].id)
    }

    return false
  }

  getCurrentNode(): DialogueNode | null {
    return this.currentNode
  }

  getAvailableChoices(): DialogueChoice[] {
    if (!this.currentNode?.choices) {
      return []
    }

    return this.currentNode.choices.filter(choice => !choice.condition || choice.condition())
  }

  isActive(): boolean {
    return this.currentNode !== null
  }

  endDialogue(): void {
    this.currentTree = null
    this.currentNode = null
  }

  getHistory(): string[] {
    return [...this.history]
  }

  reset(): void {
    this.currentTree = null
    this.currentNode = null
    this.history = []
  }
}
