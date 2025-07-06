<script setup lang="ts">
import { appName } from '~/constants'

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="border-b border-gray-200 bg-white/80 top-0 sticky z-50 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
    <div class="mx-auto px-4 container">
      <div class="flex h-16 items-center justify-between">
        <div class="flex gap-2 items-center">
          <div class="text-primary i-carbon-chat text-2xl" />
          <h1 class="text-xl font-semibold">
            {{ appName }}
          </h1>
        </div>

        <nav class="flex gap-6 items-center">
          <button
            type="button"
            aria-label="Toggle color mode"
            class="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="toggleColorMode"
          >
            <div v-if="colorMode.value === 'dark'" class="i-carbon-sun text-xl" />
            <div v-else class="i-carbon-moon text-xl" />
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>
