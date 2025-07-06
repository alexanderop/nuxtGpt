import { defineNuxtPlugin } from '#app'
import { Effect, pipe } from 'effect'

export default defineNuxtPlugin(() => ({
  provide: { Effect, pipe },
}))
