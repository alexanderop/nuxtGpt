<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useChat } from '~/composables/useChat'

const input = ref('')
const { messages, send, streaming, streamingContent } = useChat()
const messagesContainer = ref<HTMLDivElement>()
const chatInput = ref<any>()

async function onSend() {
  if (!input.value.trim() || streaming.value)
    return
  const text = input.value
  input.value = ''
  await send(text)
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Auto-scroll when new content arrives
watch([messages, streamingContent], () => {
  scrollToBottom()
})

// Focus input on mount
onMounted(() => {
  chatInput.value?.focus()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Messages container -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto">
      <!-- Welcome message when no messages -->
      <div v-if="messages.length === 0" class="flex h-full items-center justify-center">
        <div class="mx-auto px-4 text-center max-w-2xl">
          <div class="i-carbon-chat text-6xl text-gray-300 mb-4 dark:text-gray-600" />
          <h2 class="text-2xl text-gray-700 font-semibold mb-2 dark:text-gray-300">
            Welcome to NuxtChat AI
          </h2>
          <p class="text-gray-500 mb-6 dark:text-gray-400">
            Start a conversation by typing a message below
          </p>
          <div class="mx-auto gap-3 grid grid-cols-1 max-w-lg md:grid-cols-2">
            <button
              type="button"
              class="p-3 text-left border border-gray-200 rounded-lg transition-colors dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="input = 'Tell me a joke'; onSend()"
            >
              <div class="text-sm text-gray-700 font-medium dark:text-gray-300">
                Tell me a joke
              </div>
              <div class="text-xs text-gray-500 mt-1 dark:text-gray-400">
                Get a quick laugh
              </div>
            </button>
            <button
              type="button"
              class="p-3 text-left border border-gray-200 rounded-lg transition-colors dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="input = 'Explain quantum computing'; onSend()"
            >
              <div class="text-sm text-gray-700 font-medium dark:text-gray-300">
                Explain quantum computing
              </div>
              <div class="text-xs text-gray-500 mt-1 dark:text-gray-400">
                Learn something new
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-else>
        <ChatMessage
          v-for="(message, i) in messages"
          :key="i"
          :role="message.role"
          :content="message.content"
        />

        <!-- Streaming message -->
        <ChatMessage
          v-if="streaming && streamingContent"
          role="assistant"
          :content="streamingContent"
          :is-streaming="true"
        />
      </div>
    </div>

    <!-- Input area -->
    <ChatInput
      ref="chatInput"
      v-model="input"
      :loading="streaming"
      placeholder="Type your message..."
      @submit="onSend"
    />
  </div>
</template>
