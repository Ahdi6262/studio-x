# HEX THE ADD HUB

HEX THE ADD HUB is a comprehensive platform designed for Web3 creators, educators, and learners. It aims to provide a central hub for showcasing portfolios, delivering and enrolling in courses, engaging with a community, tracking progress, and participating in a gamified ecosystem.

## Core Features (Planned & In Development)

**User & Authentication:**
*   Email/Password and Social Login (Google, GitHub, Facebook)
*   Web3 Wallet Integration (MetaMask, WalletConnect) for authentication and on-chain interactions.
*   User Profiles with customizable avatars and bios.
*   Secure "Forgot Password" and account management.

**Portfolio & Projects:**
*   User-managed portfolios to showcase projects, skills, and testimonials.
*   Detailed project pages with descriptions, images, links, and tags.
*   Dedicated section for more technical "Projects & Research" with potential IPFS integration.

**Courses & Learning:**
*   Course catalog with filtering and search.
*   Detailed course landing pages with instructor info, syllabus, pricing.
*   Content delivery for various lesson types (text, video, quizzes).
*   Progress tracking for enrolled courses.
*   Payment integration (Fiat via Stripe/PayPal, Crypto).
*   Token-gated access to courses (ERC-20/NFT based).
*   Standard PDF and NFT-based course completion certificates.

**Community & Engagement:**
*   Leaderboard with points for contributions, course completions, and community engagement.
*   Achievement system with badges.
*   Community activity feed.
*   Direct messaging between users (planned).
*   Blog for news, insights, and tutorials.
*   Events calendar (integrated with Google Calendar).

**Personalization & AI:**
*   AI-powered content recommendations (courses, projects, users) using Genkit.
*   Customizable dashboard layout (planned).

**Web3 Specifics:**
*   Smart contracts for NFT certificates, token gating, community token (planned), and DAO governance (planned).
*   Integration with EVM-compatible blockchains.

**Knowledge & Life Tracking:**
*   "My Knowledge" section detailing academic background (e.g., IIT Delhi coursework) and areas of expertise (Quantitative Finance, AI, Programming, Mathematics).
*   "Life Tracking" dashboard to visualize life progress.

**Admin & Platform:**
*   Comprehensive Admin Dashboard for managing users, content, payments, and site settings.
*   Analytics and reporting.
*   Notification system (in-app and email).

## Technology Stack (Planned)

*   **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
*   **Backend:** Next.js API Routes / Potentially a separate Go backend (as per user exploration)
*   **Database:** Firebase Firestore
*   **Authentication:** Firebase Authentication
*   **AI/GenAI:** Genkit with Google AI (Gemini)
*   **Web3:** Ethers.js, WalletConnect
*   **Smart Contracts:** Solidity
*   **Storage:** Firebase Storage (for general uploads), potentially IPFS/Arweave for decentralized content.
*   **Deployment:** Self-hosted (Electron for desktop, standard web deployment).

## Getting Started

To run the Next.js development server:
```bash
npm run dev
```

To start the Genkit development server (if AI flows are being tested):
```bash
npm run genkit:dev
```

For Electron development:
```bash
npm run electron:dev
```

## Project Structure

*   `src/app/`: Next.js App Router pages.
*   `src/components/`: Reusable UI components.
*   `src/contexts/`: React Context providers (Auth, Theme).
*   `src/lib/`: Utility functions, Firebase configuration.
*   `src/ai/`: Genkit flows and AI-related code.
*   `src/hooks/`: Custom React hooks.
*   `docs/`: Project documentation, including database schema.
*   `electron/`: Electron main process code.
