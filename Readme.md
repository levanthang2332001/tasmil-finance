# Tasmil Finance (Trading Platform on Aptos)

An AI-powered trading platform built on Aptos blockchain with natural language DeFi operations, portfolio tracking, and curated crypto news.

## 🚀 Features

- **🤖 DeFi Chat**: Natural language AI agent for DeFi operations (swaps, lending, staking, bridging)
- **💱 Token Swaps**: Liquidswap AMM integration with optimized routing
- **🌉 Cross-Chain Bridge**: Stargate bridge (Aptos to BSC, Polygon, Base)
- **📊 Portfolio**: Token holdings with risk profile and visual charts
- **📈 Market Dashboard**: Real-time BTC, ETH, SOL, APT prices with charts
- **📰 Community Feed**: AI-curated crypto news from Twitter/X
- **🔊 Voice Commands**: Voice message support for chat
- **💰 Earn**: Staking and lending via Amnis, Aries, Echelon, Thala

## 📡 Article Sources

AI-curated content from **Twitter/X**:
- Twitter v2 API - Real-time crypto news
- GPT-4o-mini selects relevant, high-quality tweets
- Auto-synced every 30 minutes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, Radix
- **Backend**: NestJS, Redis, Supabase
- **Blockchain**: Aptos protocol
- **AI**: GPT-4o-mini (content curation + intent extraction)
- **State**: Zustand, React Query
- **Auth**: Thirdweb wallet + JWT

## 🔧 Environment Variables

Rename a `.env.development` file to `.env` file (both client & server folder)

## 🚀 Run Commands

#### Client ([Staging](https://tasmil-finance.vercel.app/))

```sh
cd client && yarn && yarn dev
```

#### Server ([📚 Document](http://localhost:5000/api/docs))

```sh
cd server && pnpm i && pnpm start:dev
```
