import process from 'node:process'
import { PassThrough } from 'node:stream'
import { Effect } from 'effect'
import { readBody, sendStream, setHeader } from 'h3'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default eventHandler(event =>
  Effect.runPromise(
    Effect.gen(function* () {
      // get messages from the request body
      const { messages } = yield* Effect.tryPromise({
        try: () => readBody(event),
        catch: (e: unknown) => new Error(String(e)),
      })

      // call OpenAI with streaming turned on
      const resp = yield* Effect.tryPromise({
        try: () => openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          stream: true, // <-- key flag
        }),
        catch: (e: unknown) => e as Error,
      })

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
    }),
  ),
)
