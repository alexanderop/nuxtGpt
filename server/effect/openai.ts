import type { ChatCompletionMessageParam } from 'openai/resources'
import process from 'node:process'
import { Context, Effect, Layer } from 'effect'
import OpenAI from 'openai'

export class OpenAIService extends Context.Tag('OpenAIService')<
  OpenAIService,
  {
    readonly chat: (messages: ChatCompletionMessageParam[]) => Effect.Effect<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>, Error>
  }
>() {}

export const OpenAILayer = Layer.scoped(
  OpenAIService,
  Effect.gen(function* () {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return yield* Effect.fail(new Error('OPENAI_API_KEY environment variable is not set'))
    }

    const client = new OpenAI({ apiKey })

    return OpenAIService.of({
      chat: messages =>
        Effect.tryPromise({
          try: () => client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            stream: true,
          }),
          catch: e => new Error(String(e)),
        }),
    })
  }),
)
