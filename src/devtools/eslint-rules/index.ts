/**
 * Custom ESLint rules for project
 */

/**
 * rules utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of rules.
 */
export const rules = {
  'no-direct-store-import': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow direct store imports outside of hooks',
      },
    },
    create(context: any) {
      return {
        ImportDeclaration(node: any) {
          const importPath = node.source.value
          if (importPath.includes('/stores/') && !importPath.includes('/hooks/')) {
            const filename = context.getFilename()
            if (!filename.includes('/hooks/')) {
              context.report({
                node,
                message: 'Use store hooks instead of direct store imports',
              })
            }
          }
        },
      }
    },
  },

  'require-error-boundary': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Require error boundaries for async components',
      },
    },
    create(context: any) {
      return {
        CallExpression(node: any) {
          if (node.callee.name === 'lazy' || node.callee.name === 'Suspense') {
            // Check if wrapped in ErrorBoundary
            const ancestors = context.getAncestors()
            const hasErrorBoundary = ancestors.some(
              (ancestor: any) =>
                ancestor.type === 'JSXElement' &&
                ancestor.openingElement.name.name === 'ErrorBoundary'
            )

            if (!hasErrorBoundary) {
              context.report({
                node,
                message: 'Async components should be wrapped in ErrorBoundary',
              })
            }
          }
        },
      }
    },
  },
}
