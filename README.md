# Sidebar Recency Prototype

A Next.js prototype demonstrating intelligent sidebar item reordering with smart animation mode. When a user sends a message in a chat, that chat automatically moves to the top of the sidebar with a contextually-aware animation.

## Features

- **Smart Animation Mode**: Automatically chooses the best animation based on item visibility
  - FLIP animation for visible items (smooth, continuous motion)
  - Fade animation for off-screen items (efficient, no wasted resources)
- **Recency-based Grouping**: Chats are organized by time (Today, Yesterday, Last 30 days, Older)
- **Smooth Transitions**: Hardware-accelerated CSS animations
- **Material-UI Components**: Built with MUI for a polished interface

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## How It Works

See [SMART-ANIMATION.md](./SMART-ANIMATION.md) for detailed documentation on the smart animation mode.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Material-UI (MUI)** - Component library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS

## Deployment

This project can be easily deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting platform**

Simply connect your GitHub repository to your hosting platform and it will auto-detect Next.js and deploy.

## License

MIT
