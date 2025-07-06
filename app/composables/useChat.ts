import { Effect } from 'effect'

interface Msg { role: 'user' | 'assistant', content: string }

export function useChat() {
  const messages = ref<Msg[]>([])
  const streaming = ref(false)

  const send = (content: string) =>
    Effect.runPromise(
      Effect.gen(function* () {
        // show your message right away
        messages.value.push({ role: 'user', content })
        streaming.value = true

        // call the server
        const res = yield* Effect.tryPromise({
          try: () => fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messages.value }),
          }),
          catch: (e: unknown) => e as Error,
        })

        // read the stream
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        const assistant: Msg = { role: 'assistant', content: '' }
        messages.value.push(assistant)

        while (true) {
          const { done, value } = yield* Effect.tryPromise({
            try: () => reader.read(),
            catch: (e: unknown) => e as Error,
          })

          if (done)
            break
          assistant.content += decoder.decode(value)
        }

        streaming.value = false
      }),
    ).catch(console.error)

  return { messages, send, streaming }
}
