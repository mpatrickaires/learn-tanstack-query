# TanStack Query Examples

This repository contains a comprehensive collection of examples demonstrating various features and use cases of TanStack Query (formerly React Query). Each example showcases different aspects of the library, helping developers understand and implement common patterns in their applications.

## 🚀 Features

The examples cover various TanStack Query features including:

- [Data Fetching Indicators](client/src/routes/fetching-indicators.tsx)
- [Query Deduplication](client/src/routes/deduping.tsx)
- [Infinite Queries](client/src/routes/infinite-queries.tsx)
- [Initial Query Data](client/src/routes/initial-query-data.tsx)
- [Query Invalidation](client/src/routes/invalidate-queries.tsx)
- [Mutations and Optimistic Updates](client/src/routes/optimistic-updates.tsx)
- [Paginated Queries](client/src/routes/paginated-queries.tsx)
- [Parallel Queries (Dynamic)](client/src/routes/parallel-queries-dynamic.tsx) & [Manual](client/src/routes/parallel-queries-manual.tsx)
- [Placeholder Data](client/src/routes/placeholder-data.tsx)
- [Query Cancellation](client/src/routes/query-cancellation.tsx)
- [Query Retries](client/src/routes/query-retries.tsx)
- [Refetch on Mount](client/src/routes/refetch-on-mount.tsx)
- [Scroll Restoration](client/src/routes/scroll-restoration.tsx)
- [Tracked Properties](client/src/routes/tracked-properties.tsx)

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- TanStack Query v5
- Material-UI (MUI)
- Node.js (Express backend)

## 📦 Project Structure

```
client/          # Frontend React application
  src/
    components/  # Reusable UI components
    contexts/    # React context providers
    hooks/       # Custom React hooks
    routes/      # Route components with examples

server/          # Backend Express server
  routes/        # API route handlers
```

## 🚦 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/mpatrickaires/learn-tanstack-query.git
```

2. Install dependencies:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Start the development servers:

In the root directory:

```bash
./run.sh
```
