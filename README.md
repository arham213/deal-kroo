# Deal Kroo (Web)

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white&style=flat-square)

Dealer-to-dealer real estate web platform. Serves as the web interface for the Deal Krein system, backed by a shared Node.js REST API used by both the web and mobile applications.

**Live:** [dealkroo.com](https://dealkroo.com) &nbsp;|&nbsp; **Backend:** [Deal-Karo-Backend](https://github.com/arham213/Deal-Karo-Backend) &nbsp;|&nbsp; **Mobile:** [Deal-Karo-Frontend](https://github.com/arham213/Deal-Karo-Frontend)

---

<!-- Add a screenshot or GIF of the app here -->
<!-- ![App Preview](./docs/screenshot.png) -->

## System Overview

```text
Deal Krein
├── deal-kroo              # Next.js web application (this repo)
├── Deal-Karo-Frontend     # React Native mobile application
└── Deal-Karo-Backend      # Shared Node.js REST API
```

---

## Features

- OTP-based authentication and multi-step user onboarding
- Property listings with search, filtering, and pagination
- Supports plots, houses, and commercial deals (cash and installment)
- Property notes, profile management, and account deletion
- Responsive UI with client-side form validation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js, React, TypeScript |
| Styling & UI| Tailwind CSS, Radix UI, Lucide React |
| API | REST — shared with mobile via Deal-Karo-Backend |
| Monorepo | Turborepo, pnpm |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites
- Node.js 18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Deal-Karo-Backend](https://github.com/arham213/Deal-Karo-Backend) running locally or remotely *(required — must be running before starting the frontend)*

```bash
git clone https://github.com/arham213/deal-kroo.git
cd deal-kroo
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=your_backend_url
```

### Running the App

Start the development server via Turborepo:

```bash
pnpm dev
```

See the [backend README](https://github.com/arham213/Deal-Karo-Backend#readme) for full backend setup instructions.

---

## Contact / Author

[LinkedIn](https://linkedin.com/in/arhamasjid) · arhamasjid213@gmail.com
