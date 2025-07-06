import { PassThrough } from 'node:stream'
import { Effect } from 'effect'
import { readBody, sendStream, setHeader } from 'h3'
import { OpenAILayer, OpenAIService } from '../effect/openai'

export default eventHandler(event =>
  Effect.gen(function* () {
    // get messages from the request body
    const { messages } = yield* Effect.tryPromise({
      try: () => readBody(event),
      catch: (e: unknown) => new Error(String(e)),
    })

    // get the OpenAI service
    const service = yield* OpenAIService

    // call OpenAI with streaming turned on
    const resp = yield* service.chat(messages)

    // push tokens into a Node stream
    const out = new PassThrough()

    // Process the stream asynchronously
    ;(async () => {
      try {
        for await (const part of resp) {
          const tok = part.choices[0]?.delta?.content
          if (tok) {
            out.write(tok)
          }
        }
      }
      finally {
        out.end()
      }
    })()

    // send the stream back to the browser
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return sendStream(event, out)
  }).pipe(
    Effect.provide(OpenAILayer),
    Effect.runPromise,
  ),
)
