// @ts-check
import antfu from '@antfu/eslint-config'
import effectPlugin from '@effect/eslint-plugin'
import nuxt from './.nuxt/eslint.config.mjs'
import vue35Plugin from './eslint-plugin-vue35/lib/index.js'

export default antfu(
  {
    unocss: true,
    formatters: true,
    pnpm: true,
  },
)
  .append(nuxt())
  .append({
    plugins: {
      'vue35': vue35Plugin,
      '@effect': effectPlugin,
    },
    rules: {
      'vue35/prefer-props-destructure': 'warn',
      'vue35/prefer-use-template-ref': 'warn',
      '@effect/no-import-from-barrel-package': 'error',
    },
  })
  .append({
    files: ['**/eslint-plugin-vue35/**'],
    rules: {
      'vue35/prefer-props-destructure': 'off',
      'vue35/prefer-use-template-ref': 'off',
    },
  })
