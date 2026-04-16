# NeoBank Frontend

Angular SPA for the NeoBank Platform.
PMIS Internship · Infosys Bhubaneswar DC · Lab 4 & Lab 5

## Tech Stack
- Angular 21+
- TypeScript
- Reactive Forms
- Signals + Computed
- JWT HTTP Interceptor
- Functional Route Guards

## Local Setup

### Prerequisites
- Node.js LTS (20+)
- Angular CLI 21+

### Install
```bash
npm install
```

### Run
```bash
ng serve
```
Navigate to `http://localhost:4200`

### Build
```bash
ng build --configuration=production
```

## Environment
`src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## ✅ Sprint 1 E2E Acceptance Criteria (Sign-off Ready)
### 🛡 User Flow & Security
. AC02: Valid JWT storage verified in LocalStorage (DevTools > Application tab).

. AC06: Functional Register, Login, and Profile UIs with real-time validation.

. AC07: AuthGuard implemented: Direct URL access to /dashboard without login redirects to /auth/login.

### 📊 Banking UI Logic
. AC11: Transaction history is dynamically sorted (Newest first).

. AC12: Dashboard successfully aggregates account balances and lists recent activity.

. AC13: Visual Logic: DEBIT transactions are styled in RED, while CREDIT transactions appear in GREEN.

## Routes
|       Path      |   Guard   |      Description        |
|-----------------|-----------|-------------------------|
|   /auth/login   |     —     | Login page              |
| /auth/register  |     —     | Registration page       |
|   /dashboard    | authGuard | Main dashboard          |
|   /accounts     | authGuard | Account management      |
| /accounts/:id   | authGuard | Transaction history     |
|    /profile     | authGuard | User profile            |
|   /admin/users  | authGuard + adminGuard | Admin only |

## Architecture
```
src/app/
├── auth/          → AuthService + login/register components
├── dashboard/     → Dashboard page
├── accounts/      → Account management
├── transactions/  → Transaction history
├── profile/       → User profile
├── admin/         → Admin pages
├── shared/        → Sidebar component
└── core/          → Guards + interceptors
```

## 🌿 Branching Strategy
```
. main: Sprint sign-off only
. develop: Integration branch
. feature/ : Daily feature work
```