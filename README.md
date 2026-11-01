# Habit Tracker (React + Vite)

    npm install
    npm run dev       # http://localhost:5173
    npm run build
    npm test          # engine tests (plain node)

Accounts: register/login page, stored in localStorage (salted SHA-256). Demo-grade only.
Data keys: `ht:users`, `ht:session`, `ht:{userId}:idx`, `ht:{userId}:h:{habitId}`.
`src/core/engine.js` has no React/DOM code, so it can be reused or moved to a backend.
