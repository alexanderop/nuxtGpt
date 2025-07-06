<script setup lang="ts">
interface Props {
  modelValue: string
  loading?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}

const { placeholder = 'Type a message...', loading = false, modelValue } = defineProps<Props>()

const emit = defineEmits<Emits>()

const textarea = ref<HTMLTextAreaElement>()
const inputValue = computed({
  get: () => modelValue,
  set: value => emit('update:modelValue', value),
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (inputValue.value.trim() && !loading) {
      emit('submit')
    }
  }
}

function adjustTextareaHeight() {
  if (!textarea.value)
    return

  textarea.value.style.height = 'auto'
  const scrollHeight = textarea.value.scrollHeight
  const maxHeight = 200 // Max height in pixels

  textarea.value.style.height = `${Math.min(scrollHeight, maxHeight)}px`
}

watch(inputValue, () => {
  nextTick(adjustTextareaHeight)
})

onMounted(() => {
  adjustTextareaHeight()
})

function focusInput() {
  textarea.value?.focus()
}

defineExpose({
  focus: focusInput,
})
</script>

<template>
  <div class="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <div class="mx-auto px-4 py-4 container max-w-4xl">
      <form @submit.prevent="$emit('submit')">
        <div class="relative">
          <textarea
            ref="textarea"
            v-model="inputValue"
            :placeholder="placeholder"
            :disabled="loading"
            class="focus:ring-primary px-4 py-3 pr-12 border border-gray-300 rounded-xl bg-gray-50 w-full resize-none transition-all duration-200 focus:outline-none dark:border-gray-600 focus:border-transparent dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2"
            rows="1"
            @keydown="handleKeydown"
          />

          <button
            type="submit"
            :disabled="!inputValue.trim() || loading"
            class="text-white p-2 rounded-lg transition-all duration-200 bottom-2 right-2 absolute"
            :class="{
              'bg-primary hover:bg-primary/90': inputValue.trim() && !loading,
              'bg-gray-300 dark:bg-gray-600 cursor-not-allowed': !inputValue.trim() || loading,
            }"
          >
            <div v-if="loading" class="i-carbon-circle-dash animate-spin" />
            <div v-else class="i-carbon-send-alt" />
          </button>
        </div>

        <div class="text-xs text-gray-500 mt-2 flex items-center justify-between dark:text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span v-if="inputValue.length > 0">
            {{ inputValue.length }} characters
          </span>
        </div>
      </form>
    </div>
  </div>
</template>
