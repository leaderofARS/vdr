# SipHeron VDR — Dashboard Reference

This directory contains the frontend web application built with **Next.js (App Router)** and **React**.

## Architecture & Directory Structure

The dashboard is a modern React application utilizing Server Components and Client Components where appropriate.

- **`src/app/`**: Next.js App Router definitions.
  - `layout.js` & `page.js`: The root unauthenticated landing page.
  - `auth/`: Login and registration routes.
  - `dashboard/`: The main authenticated workspace. 
    - `layout.js`: Acts as the security perimeter. It calls the backend API to verify the `HttpOnly` session cookie before rendering child routes.
    - `page.js`: The analytics and overview hub. Fetches statistics and displays the "Onboarding Wizard" if the user hasn't created an organization yet.
  - `verify/`: A public tool allowing anyone to upload a file into their browser memory to calculate its hash and mathematically verify its existence on the Solana ledger.
  - `explorer/`: A public ledger interface viewing recent anchors.
- **`src/components/`**: Reusable React components.
  - `FileUploader.jsx`: A drag-and-drop component that calculates SHA-256 hashes locally in the browser using the Web Crypto API. Fits the Zero-Knowledge model.
  - `WalletContextProvider.jsx`: Solana wallet adapter integration (Phantom, Solflare) for future decentralization features.
- **`src/utils/`**: Frontend helpers.
  - `api.js`: An Axios instance pre-configured with `withCredentials: true` to handle secure `HttpOnly` cookies. It includes a response interceptor that automatically calls `/auth/refresh` on 401 errors and retries failed requests.
  - `hash.js`: Web Crypto API hashing functions.
- **`src/middleware.js`**: Next.js Edge Middleware. Enforces HTTPS in production environments by actively rewriting standard HTTP requests and attaching strict HSTS/CSP security headers at the edge router level.

## Authentication & Security

The frontend **does not** store JWTs or sensitive tokens in `localStorage`. 

All session management is handled via `HttpOnly`, `Secure`, `SameSite=Strict` cookies issued by the backend API. The Axios client (`utils/api.js`) automatically attaches these cookies to every request. If an access token expires (15m TTL), the response interceptor seamlessly uses the refresh token (7d TTL) to obtain a new access cookie and replays the original request entirely transparently to the user.

## Running Locally

```bash
npm run dev
```

For production testing:
```bash
npm run build && npm start
```
