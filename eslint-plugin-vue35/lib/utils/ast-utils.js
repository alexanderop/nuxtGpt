/**
 * Check if a node is a specific Vue macro call
 * @param {object} node - AST node
 * @param {string} macroName - Name of the macro (e.g., 'defineProps', 'withDefaults')
 * @returns {boolean} - True if the node is a Vue macro call with the specified name
 */
function isVueMacroCall(node, macroName) {
  return (
    node
    && node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === macroName
  )
}

/**
 * Get the type parameter from a Vue macro call
 * @param {object} node - CallExpression node
 * @returns {object | null} - Type parameter node
 */
function getTypeParameter(node) {
  return node.typeParameters?.params?.[0] || null
}

/**
 * Check if a node is a template ref declaration
 * @param {object} node - AST node
 * @returns {boolean} - True if the node is a template ref declaration
 */
function isTemplateRefDeclaration(node) {
  if (node.type !== 'VariableDeclaration')
    return false

  const declarator = node.declarations[0]
  if (!declarator || !declarator.init)
    return false

  return (
    declarator.init.type === 'CallExpression'
    && declarator.init.callee.type === 'Identifier'
    && declarator.init.callee.name === 'ref'
  )
}

/**
 * Find template refs in Vue template
 * @param {object} templateBody - Template AST
 * @returns {Set<string>} - Set of ref names
 */
function findTemplateRefs(templateBody) {
  const refs = new Set()

  function traverse(node) {
    if (node.type === 'VAttribute' && node.key.name === 'ref' && node.value?.value) {
      refs.add(node.value.value)
    }

    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  if (templateBody) {
    traverse(templateBody)
  }

  return refs
}

module.exports = {
  isVueMacroCall,
  getTypeParameter,
  isTemplateRefDeclaration,
  findTemplateRefs,
}
