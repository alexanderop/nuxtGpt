import type { Fiber } from 'effect'
import { Effect } from 'effect'

interface Msg { role: 'user' | 'assistant', content: string }

export function useChat() {
  const messages = ref<Msg[]>([])
  const streaming = ref(false)
  const streamingContent = ref('')
  let fiber: Fiber.RuntimeFiber<void, never> | undefined

  const send = (content: string) => {
    // Cancel any previous stream
    if (fiber) {
      Effect.runFork(fiber.interruptAsFork(fiber.id()))
    }

    // Build the Effect
    const program = Effect.gen(function* () {
      messages.value.push({ role: 'user', content })
      streaming.value = true
      streamingContent.value = ''

      // Network request
      const res = yield* Effect.tryPromise({
        try: () => fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages.value }),
        }),
        catch: e => new Error(String(e)),
      })

      // Read the stream
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = yield* Effect.tryPromise({
          try: () => reader.read(),
          catch: e => new Error(String(e)),
        })
        if (done)
          break
        const chunk = decoder.decode(value)
        fullContent += chunk
        streamingContent.value = fullContent
      }

      // Add the complete message to messages array
      messages.value.push({ role: 'assistant', content: fullContent })
      streaming.value = false
      streamingContent.value = ''
    }).pipe(
      Effect.catchAll((err) => {
        messages.value.push({ role: 'assistant', content: `⚠️ ${err.message}` })
        streaming.value = false
        streamingContent.value = ''
        return Effect.void
      }),
    )

    // Fork instead of runPromise
    fiber = Effect.runFork(program)
  }

  // Interrupt if component unmounts
  onScopeDispose(() => {
    if (fiber) {
      Effect.runFork(fiber.interruptAsFork(fiber.id()))
    }
  })

  return { messages, send, streaming, streamingContent }
}
