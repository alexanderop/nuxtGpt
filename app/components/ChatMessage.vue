<script setup lang="ts">
interface Props {
  role: 'user' | 'assistant' | 'system'
  content: string
  isStreaming?: boolean
}

const props = defineProps<Props>()

const formattedContent = computed(() => {
  if (props.role === 'assistant') {
    // For now, just return content as-is
    // We'll add markdown support later
    return props.content
  }
  return props.content
})
</script>

<script lang="ts">
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div
    class="group relative"
    :class="{
      'bg-white dark:bg-gray-800': role === 'user',
      'bg-gray-50 dark:bg-gray-900': role === 'assistant',
    }"
  >
    <div class="mx-auto px-4 py-6 container max-w-4xl">
      <div class="flex gap-4">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <div
            v-if="role === 'user'"
            class="bg-primary/10 rounded-full flex h-8 w-8 items-center justify-center"
          >
            <div class="text-primary i-carbon-user" />
          </div>
          <div
            v-else-if="role === 'assistant'"
            class="rounded-full bg-green-100 flex h-8 w-8 items-center justify-center dark:bg-green-900/20"
          >
            <div class="i-carbon-bot text-green-600 dark:text-green-400" />
          </div>
        </div>

        <!-- Message content -->
        <div class="flex-1 min-w-0">
          <div class="max-w-none prose prose-gray dark:prose-invert">
            <div class="whitespace-pre-wrap break-words">
              {{ formattedContent }}
              <span
                v-if="isStreaming"
                class="ml-1 bg-gray-400 h-4 w-2 inline-block animate-pulse dark:bg-gray-600"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="opacity-0 flex-shrink-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            class="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Copy message"
            @click="copyToClipboard(content)"
          >
            <div class="i-carbon-copy text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
