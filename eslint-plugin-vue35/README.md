# ESLint Plugin for Vue 3.5 Modern Patterns

This ESLint plugin provides rules to encourage adoption of Vue 3.5's newer patterns and APIs.

## Installation

This plugin is included locally in the project. No additional installation needed.

## Rules

### `vue35/prefer-props-destructure`

Prefer the new destructuring syntax over `withDefaults` for defining props with default values.

**Why?** The destructuring syntax is cleaner and more idiomatic JavaScript.

#### ❌ Bad

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number
  msg?: string
}>(), {
  count: 0,
  msg: 'hello'
})

// Usage
console.log(props.count)
</script>
```

#### ✅ Good

```vue
<script setup lang="ts">
const { count = 0, msg = 'hello' } = defineProps<{
  count?: number
  msg?: string
}>()

// Usage
console.log(count)
</script>
```

### `vue35/prefer-use-template-ref`

Prefer `useTemplateRef()` over plain refs for template references.

**Why?** `useTemplateRef()` provides better type safety and supports dynamic ref bindings.

#### ❌ Bad

```vue
<script setup>
import { ref } from 'vue'

const input = ref()
</script>

<template>
  <input ref="input">
</template>
```

#### ✅ Good

```vue
<script setup>
import { useTemplateRef } from 'vue'

const input = useTemplateRef('input')
</script>

<template>
  <input ref="input">
</template>
```

## Configuration

The rules are already configured in the project's ESLint config:

```js
export default {
  rules: {
    'vue35/prefer-props-destructure': 'warn',
    'vue35/prefer-use-template-ref': 'warn',
  }
}
```

## Development

To add new rules:

1. Create a new rule file in `lib/rules/`
2. Export the rule from `lib/index.js`
3. Add the rule to the ESLint configuration
4. Document the rule in this README
