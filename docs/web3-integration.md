# Web3 Integration Plan for HEX THE ADD HUB

This document outlines the current status and future plans for Web3 integration within the HEX THE ADD HUB platform.

## Phase 3: Integrating Web3 Foundation (Current Focus)

### 1. Frontend Wallet Integration

*   **Browser Wallet Detection (MetaMask & EIP-1193 Compatibles):**
    *   **Status:** Implemented in `src/contexts/auth-context.tsx`.
    *   **Details:** The application checks for `window.ethereum` to detect browser-based wallets. Users are prompted if no wallet is detected when trying to connect.
*   **WalletConnect:**
    *   **Status:** Not yet implemented.
    *   **Plan:** Integrate a WalletConnect provider (e.g., using `@walletconnect/web3-provider` or a similar library for Next.js/React) to support mobile and other QR-code based wallets. This will involve UI for displaying QR codes and handling connection events.
*   **Account Connection & Display:**
    *   **Status:** Implemented.
    *   **Details:** Users can connect their detected browser wallet. The connected wallet address is displayed in the UI (e.g., Navbar) and stored in the `AuthContext`.
*   **Network Switching:**
    *   **Status:** Basic chain ID detection implemented. Explicit network switching UI/logic is not yet implemented.
    *   **Plan:** Add functionality to prompt users to switch to a supported network if they are connected to an incorrect one, especially before performing on-chain actions (e.g., using `wallet_switchEthereumChain`). Define a list of supported networks.
*   **Link Wallets to User Accounts:**
    *   **Status:** Implemented.
    *   **Details:** When an authenticated user connects a new wallet, the wallet address and chain ID are stored in their user profile in Firestore under the `web3_wallets` array (see `docs/database-schema.md`). The first wallet connected is typically marked as primary.

### 2. Web3 Authentication (Signature-Based Login/Signup)

*   **Status:** Placeholder implemented. Full functionality requires backend API.
*   **Frontend Flow (`src/contexts/auth-context.tsx` - `signInWithWalletSignature`):**
    1.  User initiates "Login/Sign Up with Wallet".
    2.  Application checks if a wallet is connected. If not, prompts user to connect.
    3.  (Backend Step 1 - Needed) Frontend calls a new API endpoint (e.g., `/api/auth/request-message`) with the connected wallet address.
    4.  (Backend Step 2 - Needed) Backend generates a unique, secure message (nonce) for the user to sign and returns it.
    5.  Frontend prompts the user to sign this message using `window.ethereum.request({ method: 'personal_sign', params: [messageToSign, address] })`.
    6.  (Backend Step 3 - Needed) Frontend sends the original message, signature, and wallet address to another API endpoint (e.g., `/api/auth/verify-signature`).
    7.  (Backend Step 4 - Needed) Backend verifies the signature. If valid:
        *   Checks if a user account exists for this wallet address.
        *   If not, creates a new user account in Firestore.
        *   If exists, retrieves the user.
        *   Generates a custom Firebase authentication token for this user.
        *   Returns the custom token to the frontend.
    8.  Frontend uses `signInWithCustomToken(auth, customToken)` to log the user into Firebase.
*   **Backend Requirements (To be built as Next.js API Routes):**
    *   `/api/auth/request-message`:
        *   Accepts: `walletAddress`
        *   Generates and stores a temporary nonce associated with the wallet address (e.g., in Redis or Firestore with an expiry).
        *   Returns: `messageToSign` (containing the nonce).
    *   `/api/auth/verify-signature`:
        *   Accepts: `message`, `signature`, `walletAddress`
        *   Retrieves the expected nonce for `walletAddress`.
        *   Verifies the signature against the message and `walletAddress`.
        *   If valid and nonce matches:
            *   Looks up or creates a user in Firestore.
            *   Generates a Firebase custom auth token using the Firebase Admin SDK.
            *   Returns: `{ customToken }` or an error.
*   **Security:**
    *   Nonces must be single-use and expire quickly.
    *   Protect backend API endpoints.

### 3. Backend Web3 Service (Future - Next.js API Routes)

*   **Status:** Not yet implemented.
*   **Plan:** Create a set of Next.js API routes that will act as the backend for Web3 interactions. These routes will use libraries like Ethers.js or Web3.js.
*   **Functionality:**
    *   **Query Token Balances:** API endpoint to fetch ERC-20 or native token balances for a given wallet address and token contract.
    *   **Check NFT Ownership:** API endpoint to verify if a wallet address owns a specific ERC-721 or ERC-1155 NFT.
    *   **Listen for On-Chain Events (Optional/Advanced):** For features like real-time updates based on smart contract events, a more persistent backend service or polling mechanism via these API routes might be needed.
*   **RPC Node Interaction:**
    *   These API routes will connect to EVM-compatible blockchain networks via RPC nodes (e.g., Infura, Alchemy, or a self-hosted node).
    *   RPC URLs and API keys will be stored securely as environment variables.

### 4. Token-Gated Access (Future - Depends on Backend Web3 Service)

*   **Status:** Not yet implemented.
*   **Admin Interface:**
    *   Allow administrators to define token-gating rules for courses or content (e.g., requires holding X amount of Y_TOKEN, or owning Z_NFT from_contract_ABC).
    *   Store these rules in Firestore, linked to the respective content.
*   **Frontend Checks:**
    *   Before displaying gated content, the frontend will call the "Backend Web3 Service" API to check if the connected user's wallet meets the criteria.
    *   UI will show/hide content or display prompts accordingly.
*   **Backend Middleware:**
    *   Protect API routes serving gated content. This middleware will re-verify token/NFT ownership on the backend before returning data.
    *   Implement caching for ownership checks to reduce RPC calls, with appropriate cache invalidation strategies.

## Security Considerations (General)

*   **RPC Endpoints & API Keys:** Store all third-party API keys and RPC endpoint URLs in environment variables (`.env.local`) and never commit them to the repository. Use these variables in backend (API route) configurations.
*   **Input Sanitization:** Ensure all user-provided data (especially data that might be displayed or used in queries) is properly sanitized on both frontend and backend to prevent XSS and other injection attacks.
*   **Rate Limiting:** Implement rate limiting on critical backend API endpoints (auth, transactions, etc.) to prevent abuse.
*   **Smart Contract Monitoring (If applicable, for Phase 6+):** Once custom smart contracts are deployed, tools or services should be used to monitor their activity and health.

This document will be updated as Web3 features are implemented and refined.
