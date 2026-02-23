# Contributing to OpenCalisthenics

Thank you for taking the time to contribute. This document covers conventions for both the web app (Next.js) and the Android app (Kotlin/Compose).

---

## Table of Contents

- [Development Setup](#development-setup)
- [Reporting Issues](#reporting-issues)
- [General Guidelines](#general-guidelines)
- [Pull Request Process](#pull-request-process)
- [Web App](#web-app-nextjs)
- [Android App](#android-app-kotlincompose)
- [Internationalization](#internationalization)

---

## Development Setup

```bash
# Clone the repo
git clone https://github.com/ItzRoBeerT/calisteniapp.git
cd calisteniapp

# Install dependencies
pnpm install

# Start dev server at http://localhost:3000
pnpm run dev
```

See the [README](README.md) for environment variables and Android setup.

---

## Reporting Issues

Before opening an issue:

1. Search existing issues to avoid duplicates.
2. Include the relevant platform (web / Android), browser or OS version, and steps to reproduce.
3. Use the smallest reproduction case possible.

---

## General Guidelines

- Keep changes focused — one feature or fix per PR.
- Follow existing code style; do not refactor code unrelated to your change.
- Update translations in `messages/en.json` **and** `messages/es.json` for any new user-facing strings.
- When modifying TypeScript interfaces that map to database tables, also update `supabase/schema.sql` and `supabase/seed.sql`.

### Git

- Branch off `main` for new work.
- Use conventional commit messages: `feat:`, `fix:`, `chore:`, `docs:`, etc.

---

## Pull Request Process

1. Make sure `pnpm run lint` and `npx tsc --noEmit` pass before opening a PR.
2. For Android changes, run `./gradlew lint` and `./gradlew test`.
3. Keep the PR description focused: what changed and why.
4. Request a review once CI is green.

**Checklist before requesting review:**

- [ ] Linter passes (web: `pnpm run lint` / Android: `./gradlew lint`)
- [ ] Type-check passes: `npx tsc --noEmit`
- [ ] New user-facing strings added to both `en.json` and `es.json`
- [ ] `supabase/schema.sql` and `supabase/seed.sql` updated if types changed
- [ ] PR scope is focused — one feature or fix

---

## Web App (Next.js)

### Structure

```
app/[locale]/       Routes — each folder is a page
components/         Reusable components grouped by feature
types/              TypeScript interfaces and unions
stores/             Zustand client-side state
actions/            Next.js server actions
data/               Static JSON data
messages/           Translation files
```

### Conventions

- **Routing**: All pages live under `app/[locale]/`. The default locale is `es`.
- **i18n**: Use `useTranslations('Namespace')` inside components. Never hardcode user-facing strings.
- **Styling**: Tailwind CSS only. Use the custom design tokens (`primary-*`, `secondary-*`, `surface`, `foreground`, `background`). Fonts: `Orbitron` for headings, `Space Grotesk` for body.
- **State**: Zustand for global client state. Avoid prop-drilling more than two levels.
- **Supabase**: Use the server client (`utils/supabase/server.ts`) in Server Components and server actions. Use the browser client (`utils/supabase/client.ts`) only in Client Components.

### Adding a New Roadmap Node Type

The roadmap system is the most complex part of the web app. Adding a node requires changes in eleven places:

1. **`types/RoadmapNodes.ts`** — Add the type to the `RoadmapNodeType` union and create a `*NodeData` interface.
2. **`components/roadmaps/nodes/[category]/`** — Create the node component.
3. **`components/roadmaps/nodes/builderNodeTypes.ts`** — Register the node for builder mode.
4. **`components/roadmaps/nodes/viewerNodeTypes.ts`** — Register the node for viewer mode.
5. **`components/roadmaps/nodes/index.ts`** — Export the component.
6. **`components/roadmaps/config/`** — Add a config panel or extend an existing one.
7. **`components/roadmaps/config/NodeConfigRouter.tsx`** — Add the routing case.
8. **`components/roadmaps/sidebar/templates.ts`** — Add the node template for drag-and-drop.
9. **`components/roadmaps/sidebar/NodeTemplatesSidebar.tsx`** — Add the icon and translation key.
10. **`components/roadmaps/sidebar/ComponentsListSidebar.tsx`** — Add to the label and color mappings.
11. **`messages/en.json`** and **`messages/es.json`** — Add translation strings.

---

## Android App (Kotlin/Compose)

### Architecture

The Android app follows **MVVM + Clean Architecture** with three layers:

```
data/           Repository implementations, Supabase client, DTOs
domain/         Pure Kotlin — models, repository interfaces, use cases
presentation/   Compose screens + ViewModels
```

**Dependency flow:** `Screen → ViewModel → UseCase → Repository interface → Repository implementation`

### Screen Pattern

Every screen requires three parts:

**1. UiState** — immutable data class:

```kotlin
data class ExampleUiState(
    val isLoading: Boolean = false,
    val error: String? = null
)
```

**2. ViewModel** — owns state, delegates logic to use cases:

```kotlin
class ExampleViewModel(
    private val exampleUseCase: ExampleUseCase = ExampleUseCase(ExampleRepositoryImpl())
) : ViewModel() {
    var uiState by mutableStateOf(ExampleUiState())
        private set
}
```

**3. Composable** — pure UI, reads state from ViewModel. No business logic inside composables.

### Domain Layer Rules

The `domain/` package must be **pure Kotlin** with zero Android or framework dependencies:

- No imports from `android.*`, `androidx.*`, or any third-party library.
- Repository interfaces live in `domain/repository/`.
- Use cases live in `domain/usecase/{feature}/` and use `operator fun invoke`.
- Models in `domain/model/` are plain Kotlin data classes.

### Repository Conventions

```kotlin
// domain/repository/ — interface only
interface ExampleRepository {
    suspend fun fetchData(): Result<List<Item>>
}

// data/repository/ — Supabase/network implementation
class ExampleRepositoryImpl : ExampleRepository {
    override suspend fun fetchData(): Result<List<Item>> = runCatching {
        // Supabase or network call
    }
}
```

- Always return `Result<T>`. Never throw exceptions from repositories.
- Wrap all external calls with `runCatching`.

### Error Handling

- Errors are stored in `UiState.error` and displayed in the UI.
- Clear the error before each new action: `uiState = uiState.copy(error = null)`.
- Default error language is Spanish.

### Testing

- Unit tests go in `app/src/test/`.
- Test use cases with a `Fake*Repository` implementation.
- Test ViewModels by injecting fake use cases.
- Use `kotlinx-coroutines-test` (`runTest`, `TestDispatcher`) for coroutine testing.

```kotlin
class FakeExampleRepository : ExampleRepository {
    var shouldFail = false
    override suspend fun fetchData(): Result<List<Item>> =
        if (shouldFail) Result.failure(Exception("error")) else Result.success(emptyList())
}
```

### Android Build Commands

```bash
cd android
./gradlew assembleDebug    # Build debug APK
./gradlew installDebug     # Install on device / emulator
./gradlew test             # Run unit tests
./gradlew lint             # Run Android lint
```

---

## Internationalization

All user-facing strings must exist in both `messages/en.json` and `messages/es.json`. Spanish is the default locale.

- Group strings under a meaningful namespace that matches the component or feature.
- Use `useTranslations('Namespace')` in web components.
- In Android, add strings to the appropriate `strings.xml` resource file.
