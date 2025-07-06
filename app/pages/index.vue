<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useChat } from '~/composables/useChat'

const input = ref('')
const { messages, send, streaming } = useChat()
const scroller = ref<HTMLDivElement>()

async function onSend() {
  if (!input.value.trim())
    return
  const text = input.value
  input.value = ''
  await send(text)
  nextTick(() => scroller.value?.scrollTo(0, scroller.value.scrollHeight))
}
</script>

<template>
  <div class="p-4 flex flex-col h-screen bg-white dark:bg-gray-900">
    <!-- messages -->
    <div ref="scroller" class="flex-1 overflow-y-auto space-y-3 pr-2">
      <div
        v-for="(m, i) in messages"
        :key="i"
        :class="m.role === 'user' ? 'text-right' : ''"
      >
        <span
          class="px-4 py-3 rounded-lg inline-block max-w-[80%] shadow-sm"
          :class="[
            m.role === 'user' ? 'bg-blue-600 text-white' : 
            m.content.startsWith('⚠️') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
          ]"
        >
          {{ m.content }}
        </span>
      </div>
      <span
        v-if="streaming"
        class="px-4 py-3 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-lg inline-block animate-pulse shadow-sm"
      >…</span>
    </div>

    <!-- input -->
    <div class="mt-4 flex">
      <input
        v-model="input"
        class="p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask anything…"
        @keydown.enter.prevent="onSend"
      >
      <button class="text-white px-6 rounded-r-lg bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" @click="onSend">
        Send
      </button>
    </div>
  </div>
</template>
