const { isVueMacroCall, getTypeParameter } = require('../utils/ast-utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'prefer destructuring syntax over withDefaults for props with default values',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      preferDestructure: 'Use destructuring syntax instead of withDefaults for better readability.',
    },
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      'VariableDeclaration:has(CallExpression[callee.name="withDefaults"])': function (node) {
        const declarator = node.declarations[0]
        if (!declarator || !declarator.init)
          return

        // Check if this is a withDefaults call
        if (!isVueMacroCall(declarator.init, 'withDefaults'))
          return

        const withDefaultsCall = declarator.init
        const definePropsCall = withDefaultsCall.arguments[0]
        const defaultsObject = withDefaultsCall.arguments[1]

        // Ensure we have a defineProps call as the first argument
        if (!isVueMacroCall(definePropsCall, 'defineProps'))
          return

        // Get the props name (e.g., 'props')
        const propsName = declarator.id.name

        context.report({
          node: withDefaultsCall,
          messageId: 'preferDestructure',
          fix(fixer) {
            const fixes = []

            // Get the type parameter from defineProps
            const typeParam = getTypeParameter(definePropsCall)
            if (!typeParam)
              return null

            // Get the defaults object properties
            const defaults = {}
            if (defaultsObject && defaultsObject.type === 'ObjectExpression') {
              defaultsObject.properties.forEach((prop) => {
                if (prop.type === 'Property' && prop.key.type === 'Identifier') {
                  const defaultValue = sourceCode.getText(prop.value)
                  defaults[prop.key.name] = defaultValue
                }
              })
            }

            // Build destructured props with defaults
            const propsWithDefaults = Object.entries(defaults).map(
              ([propName, defaultValue]) => `${propName} = ${defaultValue}`,
            )

            // For simplified version, we'll just include props with defaults
            // In a complete implementation, we'd parse the interface to get all props
            const destructurePattern = `const { ${propsWithDefaults.join(', ')} } = defineProps${sourceCode.getText(definePropsCall.typeParameters)}()`

            // Replace the entire variable declaration
            fixes.push(fixer.replaceText(node, destructurePattern))

            // Find and update all references from props.xxx to xxx
            const scope = context.getScope()
            const variable = scope.variables.find(v => v.name === propsName)

            if (variable) {
              variable.references.forEach((ref) => {
                const parent = ref.identifier.parent
                if (parent && parent.type === 'MemberExpression' && parent.object === ref.identifier) {
                  // Replace props.xxx with xxx
                  fixes.push(fixer.replaceText(parent, parent.property.name))
                }
              })
            }

            return fixes
          },
        })
      },
    }
  },
}
