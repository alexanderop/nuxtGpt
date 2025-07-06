import { Effect, Fiber } from 'effect'

interface Msg { role: 'user' | 'assistant', content: string }

export function useChat() {
  const messages = ref<Msg[]>([])
  const streaming = ref(false)
  let fiber: Fiber.RuntimeFiber<never, void> | undefined

  const send = (content: string) => {
    // Cancel any previous stream
    if (fiber) {
      fiber.interrupt()
    }

    // Build the Effect
    const program = Effect.gen(function* () {
      messages.value.push({ role: 'user', content })
      streaming.value = true

      // Network request
      const res = yield* Effect.tryPromise({
        try: () => fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages.value }),
        }),
        catch: (e) => new Error(String(e)),
      })

      // Read the stream
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      const assistant: Msg = { role: 'assistant', content: '' }
      messages.value.push(assistant)

      while (true) {
        const { done, value } = yield* Effect.tryPromise({
          try: () => reader.read(),
          catch: (e) => new Error(String(e)),
        })
        if (done) break
        assistant.content += decoder.decode(value)
      }
      streaming.value = false
    }).pipe(
      Effect.catchAll((err) => {
        messages.value.push({ role: 'assistant', content: `⚠️ ${err.message}` })
        streaming.value = false
        return Effect.void
      })
    )

    // Fork instead of runPromise
    fiber = Effect.runFork(program)
  }

  // Interrupt if component unmounts
  onScopeDispose(() => {
    if (fiber) {
      fiber.interrupt()
    }
  })

  return { messages, send, streaming }
}
