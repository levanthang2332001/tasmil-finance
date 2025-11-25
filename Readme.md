# Tasmil Finance

A sophisticated DeFi platform built on the Aptos blockchain, featuring AI-powered trading agents, community features, and comprehensive DeFi protocol integrations.

## Features

### Core Features
- **AI DeFi Agent**: Intelligent trading assistant powered by LangChain and OpenAI for automated market analysis and trading recommendations
- **Community Feed**: Social platform for sharing insights, market analysis, and trading strategies with real-time updates
- **Multi-Wallet Support**: Integrated support for Martian, Petra, OKX, and Pontem wallets via Aptos Wallet Adapter
- **DeFi Protocol Integration**: Direct integration with major Aptos DeFi protocols including:
  - Liquidswap (DEX)
  - Merkletrade (Derivatives)
  - Thala, Aries, Echelon (Lending)
  - Amnis, Echo (Liquid Staking)
  - Stargate, Joule (Cross-chain)

### Technical Features
- Real-time chat and community interactions
- Secure JWT-based authentication
- Redis caching for optimal performance
- Supabase integration for data persistence
- Responsive UI with dark mode support
- Advanced error handling and loading states

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives (Dialog, Dropdown, Select, etc.)
- **State Management**:
  - TanStack Query (React Query) for server state
  - Zustand for client state
- **Blockchain**:
  - @aptos-labs/ts-sdk
  - @aptos-labs/wallet-adapter-react
- **Animations**: Framer Motion, React Spring
- **3D Graphics**: Spline for interactive 3D elements
- **Forms & Validation**: Zod
- **HTTP Client**: Axios
- **Markdown**: react-markdown with syntax highlighting

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: Passport JWT
- **Caching**: Redis with @nestjs/cache-manager
- **Database**: Supabase (PostgreSQL)
- **Rate Limiting**: @nestjs/throttler
- **Scheduling**: @nestjs/schedule
- **AI Integration**:
  - LangChain Core & OpenAI
- **Blockchain SDKs**:
  - @aptos-labs/ts-sdk
  - @pontem/liquidswap-sdk
  - @merkletrade/ts-sdk
  - @pythnetwork/pyth-aptos-js

## Project Structure

```
tasmil-finance/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (root)/    # Main application routes
│   │   │   │   ├── community/      # Community feed page
│   │   │   │   └── defi-agent/     # AI agent interface
│   │   │   └── api/       # API routes
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── providers/     # Context providers
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
│
└── server/                # NestJS backend application
    ├── src/
    │   ├── chat/          # Chat module
    │   ├── community/     # Community feed module
    │   ├── wallet/        # Wallet & auth module
    │   ├── redis/         # Redis caching module
    │   ├── supabase/      # Supabase integration
    │   ├── tools/         # DeFi protocol integrations
    │   │   ├── liquidswap/
    │   │   ├── merkletrade/
    │   │   ├── thala/
    │   │   ├── aries/
    │   │   ├── echelon/
    │   │   ├── amnis/
    │   │   ├── echo/
    │   │   ├── stargate/
    │   │   └── joule/
    │   └── utils/         # Utility functions
    └── test/              # E2E tests
```

## Prerequisites

- **Node.js**: >= 22.x
- **Package Managers**:
  - Yarn 1.22+ (for client)
  - pnpm (for server)
- **Redis**: For caching (cloud or local)
- **Supabase Account**: For database

## Environment Setup

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_PASSWORD_ENCRYPT=your_encryption_key
```

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Authentication
PASSWORD_ENCRYPT=your_encryption_key
JWT_SECRET=your_jwt_secret

# Redis
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=12522

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_ROLE_KEY=your_supabase_service_role_key

# Optional: Twitter API
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

```

## Getting Started

### Install Dependencies

```bash
# Install client dependencies
cd client
yarn install

# Install server dependencies
cd ../server
pnpm install
```

### Development Mode

#### Run Client
```bash
cd client
yarn dev
```
The client will be available at [http://localhost:3000](http://localhost:3000)

Production staging: [https://tasmil-finance.vercel.app/](https://tasmil-finance.vercel.app/)

#### Run Server
```bash
cd server
pnpm start:dev
```
The API will be available at [http://localhost:5000/api](http://localhost:5000/api)

API Documentation: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

### Production Build

#### Client
```bash
cd client
yarn build
yarn start
```

#### Server
```bash
cd server
pnpm build
pnpm start:prod

# Or use PM2
pnpm pm2:start:prod
```

## Available Scripts

### Client Scripts
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier

### Server Scripts
- `pnpm start:dev` - Start development server with watch mode
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm pm2:start` - Start with PM2 (development)
- `pnpm pm2:start:prod` - Start with PM2 (production)

## Key Features Implementation

### Wallet Integration
The application supports multiple Aptos wallets through a unified provider system:
- Martian Wallet
- Petra Wallet (via Aptos Wallet Adapter)
- OKX Wallet
- Pontem Wallet

### AI Agent
The DeFi Agent uses LangChain and OpenAI to provide:
- Market analysis and insights
- Trading recommendations
- Protocol comparison
- Risk assessment

### Community Features
- Real-time feed updates
- Infinite scroll pagination
- Rich text markdown support
- Error boundaries and loading states
- Optimistic UI updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

UNLICENSED - Private project

## Repository

- GitHub: [https://github.com/x-defi/tasmil-finance](https://github.com/x-defi/tasmil-finance)
- Issues: [https://github.com/x-defi/tasmil-finance/issues](https://github.com/x-defi/tasmil-finance/issues)
