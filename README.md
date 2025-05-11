
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

## Technology Stack (Current & Planned)

*   **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
*   **Backend (Current - Next.js API Routes):** Next.js API Routes serve as the primary backend.
*   **Backend (Potential Separate Services - Conceptual):**
    *   **Django (Python):** Could be used for complex business logic, data processing, or admin interfaces if preferred. Next.js would interact via REST APIs.
    *   **FastAPI (Python):** Ideal for high-performance, specialized microservices (e.g., ML model serving, complex calculations). Next.js would interact via REST APIs.
*   **Database:**
    *   **MySQL:** Primary relational database for structured data (users, courses, projects, etc.).
    *   **MongoDB:** For flexible, document-based data (e.g., user activity logs, cached recommendations).
    *   **Firebase Firestore (Phasing out):** Previously used, now migrating data to MySQL/MongoDB.
*   **Authentication:** Firebase Authentication (for Web2 user management & social logins). Custom logic for Web3 signature authentication.
*   **AI/GenAI:** Genkit with Google AI (Gemini)
*   **Web3:** Ethers.js, WalletConnect
*   **Smart Contracts:** Solidity
*   **Storage:** Firebase Storage (for general uploads like avatars), potentially IPFS/Arweave for decentralized content.
*   **Deployment:** Self-hosted (Electron for desktop, standard web deployment for Next.js app).

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

*   `src/app/`: Next.js App Router pages and API routes.
*   `src/components/`: Reusable UI components.
*   `src/contexts/`: React Context providers (Auth, Theme).
*   `src/lib/`: Utility functions, Firebase configuration, MySQL & MongoDB connection utilities.
*   `src/ai/`: Genkit flows and AI-related code.
*   `src/hooks/`: Custom React hooks.
*   `docs/`: Project documentation, including database schema.
*   `electron/`: Electron main process code.

## Conceptual Backend Integration (Django/FastAPI)

If you choose to implement parts of your backend using Django or FastAPI, these would run as separate services. Your Next.js application (both client-side components and API routes) would interact with them via HTTP requests.

**Example: Fetching data from a hypothetical Django API endpoint in Next.js:**
```javascript
// In a Next.js Server Component or API Route
async function getDjangoData() {
  try {
    const response = await fetch('https://your-django-api.example.com/api/some-data/', {
      headers: {
        // Add authorization headers if needed
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data from Django API');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
```

**Example: Fetching data from a hypothetical FastAPI endpoint in Next.js:**
```javascript
// In a Next.js Server Component or API Route
async function getFastApiData() {
  try {
    const response = await fetch('https://your-fastapi.example.com/items/some-item', {
      headers: {
        // Add authorization headers if needed
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data from FastAPI');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
```
Ensure CORS is properly configured on your Django/FastAPI backends to allow requests from your Next.js application's domain.

## Advanced Web3 & Community Features (Phase 6 - Planned)

This phase focuses on deeper Web3 integrations and community empowerment tools.

*   **Community Token (HEXA):**
    *   Deployment of an ERC-20 token smart contract.
    *   Mechanisms for token distribution (e.g., airdrops, rewards for platform activity).
    *   Integration of the token for platform utilities (e.g., payments, staking, unlocking special features).
*   **DAO Governance:**
    *   Deployment of governance smart contracts (e.g., based on OpenZeppelin Governor).
    *   Frontend UI for community members to create and vote on proposals.
    *   Backend integration to manage proposal lifecycle and reflect voting outcomes.
*   **Extended NFT Utility:**
    *   Beyond certificates, NFTs might grant tiered access, special roles, or be used in staking mechanisms.
    *   Potential integration with Discord for role assignment based on NFT ownership.

## Testing, Deployment, & Operations (Phase 7 - Planned)

Ensuring the platform is robust, secure, and maintainable for self-hosting.

*   **Comprehensive Testing Strategy:**
    *   **Unit Tests:** For individual functions and components.
    *   **Integration Tests:** Verifying interactions between different parts of the application (e.g., frontend to backend API, backend to database).
    *   **End-to-End (E2E) Tests:** Simulating user flows through the entire application (e.g., user registration, course enrollment, portfolio creation).
    *   **Web3 Interaction Testing:** Thorough testing of all blockchain interactions (wallet connections, smart contract calls, transaction monitoring) on testnets.
    *   **Security Testing:** Vulnerability scanning, and ideally, penetration testing.
    *   **Load Testing:** To understand performance under expected user loads.
    *   **User Acceptance Testing (UAT):** Getting feedback from target users.
*   **Production Deployment (Self-Hosting):**
    *   Finalize server configurations (performance tuning, security hardening for OS, web server, database).
    *   Securely manage environment variables and API keys for production.
    *   Automated deployment scripts or CI/CD pipelines.
    *   Database schema migration and initial data seeding if necessary.
    *   Configuration of web server (Nginx/Apache) as a reverse proxy.
    *   Ensure HTTPS is enforced with valid SSL certificates.
*   **Operational Setup & Maintenance:**
    *   **Monitoring:** Implement system monitoring (CPU, RAM, disk, network), application performance monitoring (APM), and error tracking (e.g., Sentry).
    *   **Alerting:** Set up alerts for critical system events, errors, or security issues.
    *   **Backup & Recovery:** Automated database and file backups with regular testing of the restore process. Off-site storage for backups.
    *   **Logging:** Centralized logging for application and system logs (e.g., ELK stack or similar). Log rotation and retention policies.
    *   **Security:** Regular security patching for OS and all software dependencies. Firewall rule reviews. Intrusion detection systems.
    *   **Documentation:** Detailed documentation of the infrastructure, deployment process, and maintenance procedures.
    *   **Maintenance Plan:** Schedule for regular updates, security checks, and potential downtime.
    *   **Incident Response Plan:** Procedures for handling outages, security breaches, or critical bugs.
```