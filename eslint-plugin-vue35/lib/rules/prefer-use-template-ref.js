const { isTemplateRefDeclaration, findTemplateRefs } = require('../utils/ast-utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'prefer useTemplateRef over plain refs for template references',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      preferUseTemplateRef: 'Use useTemplateRef(\'{{refName}}\') instead of plain ref() for template references.',
    },
    schema: [],
  },

  create(context) {
    let templateRefs = new Set()
    let hasUseTemplateRefImport = false
    let vueImportNode = null

    // Get the Vue SFC descriptor if available
    const parserServices = context.parserServices
    const documentFragment = parserServices?.getDocumentFragment?.()

    // Find all ref attributes in the template
    if (documentFragment) {
      const templateElement = documentFragment.children.find(
        el => el.type === 'VElement' && el.name === 'template',
      )
      if (templateElement) {
        templateRefs = findTemplateRefs(templateElement)
      }
    }

    return {
      // Check for existing useTemplateRef import
      ImportDeclaration(node) {
        if (node.source.value === 'vue') {
          vueImportNode = node
          node.specifiers.forEach((spec) => {
            if (spec.type === 'ImportSpecifier' && spec.imported.name === 'useTemplateRef') {
              hasUseTemplateRefImport = true
            }
          })
        }
      },

      VariableDeclaration(node) {
        if (!isTemplateRefDeclaration(node))
          return

        const declarator = node.declarations[0]
        const refName = declarator.id.name

        // Check if this ref name matches any template refs
        if (!templateRefs.has(refName))
          return

        context.report({
          node: declarator.init,
          messageId: 'preferUseTemplateRef',
          data: { refName },
          fix(fixer) {
            const fixes = []

            // Add useTemplateRef to imports if not already present
            if (!hasUseTemplateRefImport && vueImportNode) {
              const lastSpecifier = vueImportNode.specifiers[vueImportNode.specifiers.length - 1]
              fixes.push(fixer.insertTextAfter(lastSpecifier, ', useTemplateRef'))
            }

            // Replace ref() with useTemplateRef('refName')
            fixes.push(fixer.replaceText(declarator.init, `useTemplateRef('${refName}')`))

            return fixes
          },
        })
      },
    }
  },
}
