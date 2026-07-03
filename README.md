# OpenCalisthenics

<p align="center">
  <img src="public/images/logo.png" alt="OpenCalisthenics logo" width="180" />
</p>

A free, open-source platform for calisthenics training — web app (Next.js) and native Android app (Kotlin/Compose) backed by Supabase.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Android](https://img.shields.io/badge/Android-Kotlin-3DDC84?logo=android&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts-web)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## About

Most fitness apps are locked behind subscriptions or push proprietary workout plans. OpenCalisthenics is a fully open platform where anyone can explore exercises, build custom workouts, and share structured learning roadmaps — no paywall, no account required to browse. It runs fully offline-capable with mock data when Supabase is not configured, making it easy to self-host or contribute.

---

## Features

- **Exercise catalog** — 50+ exercises with difficulty levels, muscle groups, and progression paths
- **Workout management** — Create, run, and track custom workout routines
- **Interactive roadmaps** — Node-based learning paths built with a drag-and-drop editor
- **Blog** — Educational content with multi-locale support
- **Bilingual** — Spanish (default) and English
- **No-config mode** — Works with static mock data when Supabase is not configured

---

## Tech Stack

### Web

| Layer | Technology |
|---|---|
| Framework | Next.js 15, React 19 RC, TypeScript |
| Styling | Tailwind CSS (dark theme, custom palette) |
| State | Zustand 5 |
| i18n | next-intl |
| Database / Auth | Supabase (optional — mock data fallback included) |
| Roadmap builder | ReactFlow / XYFlow |

### Android

| Layer | Technology |
|---|---|
| Language | Kotlin |
| UI | Jetpack Compose + Material 3 |
| Architecture | MVVM + Clean Architecture |
| Auth | supabase-kt + Ktor Client |
| Min / Target SDK | 24 / 36 |

---

## Getting Started

### Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io/)
- (Optional) [Docker](https://www.docker.com/) to run the full Supabase stack locally, or a [Supabase](https://supabase.com/) cloud project — the app works with mock data without either

### Web app

```bash
# Install dependencies
pnpm install

# Start dev server at http://localhost:3000
pnpm run dev
```

#### Environment variables (optional)

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If these variables are not set the app runs with mock/static data.

#### Local Supabase (optional, requires Docker)

Run the full backend locally — Postgres, Auth, Storage and Studio — with schema and seed data applied automatically:

```bash
pnpm db:start   # first run downloads the Docker images
```

Copy the printed `API URL` and `anon key` into your `.env`, then `pnpm run dev`. See [docs/local-development.md](docs/local-development.md) for the full guide.

### Android app

Open the `android/` directory in Android Studio, or build from the command line:

```bash
cd android

# Build debug APK
./gradlew assembleDebug

# Install on connected device or emulator
./gradlew installDebug
```

Add Supabase credentials to `android/local.properties`:

```properties
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Available Scripts (web)

| Command | Description |
|---|---|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Production build |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Run ESLint |
| `pnpm run sync-exercises` | Sync exercises from external source |
| `npx tsc --noEmit` | Type-check without emitting |

---

## Project Structure

```
app/[locale]/          # Next.js locale-prefixed routes (es | en)
  ├── (auth)/          # Login and register
  ├── exercises/       # Exercise catalog
  ├── workouts/        # Workout management
  ├── roadmaps/        # Roadmap builder and viewer
  └── blog/            # Blog posts

components/            # Reusable React components grouped by feature
types/                 # TypeScript interfaces and unions
stores/                # Zustand client-side state
actions/               # Next.js server actions
data/                  # Static JSON data (exercises, roadmaps)
messages/              # i18n translation files (en.json, es.json)
android/               # Native Android app (Kotlin/Compose)
supabase/              # Database schema and seed data
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, conventions, and the PR process.

---

## License

OpenCalisthenics is licensed under the MIT license. See the [`LICENSE`](LICENSE) file for more information.
