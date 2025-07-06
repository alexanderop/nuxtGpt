# NuxtGPT

A real-time streaming chat application built with Nuxt 3 and OpenAI's GPT-4 API.

## Features

- 🤖 **Real-time Chat** - Stream responses from OpenAI's GPT-4 API
- 💬 **Clean UI** - Modern chat interface with message bubbles
- 🌗 **Dark Mode** - Automatic dark/light mode support
- 💚 **Nuxt 3** - Built on the latest Nuxt framework
- ⚡️ **Vite** - Lightning-fast HMR and builds
- 🎨 **UnoCSS** - Atomic CSS for styling
- 🦾 **TypeScript** - Full type safety
- 📲 **PWA Ready** - Installable as a Progressive Web App

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nuxtgpt.git
cd nuxtgpt
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

4. Start the development server:

```bash
pnpm dev
```

5. Open http://localhost:3000 and start chatting!

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Tech Stack

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: UnoCSS (Atomic CSS)
- **AI Integration**: OpenAI GPT-4 API with streaming
- **Type Safety**: TypeScript
- **Package Manager**: pnpm with workspace catalogs
- **Code Quality**: ESLint with @antfu/eslint-config
- **Commit Style**: Conventional Commits

## Project Structure

```
nuxtgpt/
├── app/
│   ├── components/     # Auto-imported Vue components
│   ├── composables/    # Composition utilities and stores
│   ├── layouts/        # Application layouts
│   ├── pages/          # File-based routing
│   └── plugins/        # Nuxt plugins
├── server/
│   └── api/           # API endpoints
├── public/            # Static assets
└── nuxt.config.ts     # Nuxt configuration
```

## License

MIT
