module.exports = {
  rules: {
    'prefer-props-destructure': require('./rules/prefer-props-destructure'),
    'prefer-use-template-ref': require('./rules/prefer-use-template-ref'),
  },
  configs: {
    recommended: {
      rules: {
        'vue35/prefer-props-destructure': 'warn',
        'vue35/prefer-use-template-ref': 'warn',
      },
    },
  },
}
