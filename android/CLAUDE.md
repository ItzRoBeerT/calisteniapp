# CLAUDE.md - Android App

## Commands

```bash
./gradlew assembleDebug    # Build debug APK
./gradlew installDebug     # Install on connected device/emulator
./gradlew test             # Run unit tests
./gradlew lint             # Run Android lint
```

## Tech Stack
- **Kotlin** with Jetpack Compose and Material 3
- **Compose Navigation** (type-safe with `@Serializable` routes)
- **Supabase Auth** (supabase-kt 3.1.1 + Ktor Client Android)
- **Material 3 Adaptive** (`NavigationSuiteScaffold` for responsive nav)
- **Target SDK 36**, Min SDK 24, Gradle 9.0.0

## Architecture Pattern: MVVM + Clean Architecture

All Android code follows **MVVM with Clean Architecture layers**. Do NOT put business logic directly in Composables.

```
app/src/main/java/com/opencalisthenics/
├── data/                          # Data layer
│   ├── SupabaseClient.kt         # Supabase singleton
│   └── repository/                # Repository implementations
│       └── AuthRepositoryImpl.kt  # Auth repository (Supabase)
├── domain/                        # Domain layer (pure Kotlin)
│   ├── model/                     # Domain models
│   ├── repository/                # Repository interfaces
│   │   └── AuthRepository.kt      # Auth contract
│   └── usecase/                   # Use cases (business logic)
│       └── auth/
│           ├── SignInUseCase.kt
│           ├── SignUpUseCase.kt
│           └── SignOutUseCase.kt
├── presentation/                  # Presentation layer
│   ├── user/                      # User-related features
│   │   ├── auth/                  # Authentication
│   │   │   ├── login/             # Login feature
│   │   │   │   ├── LoginScreen.kt
│   │   │   │   └── LoginViewModel.kt
│   │   │   └── register/          # Register feature
│   │   │       ├── RegisterScreen.kt
│   │   │       └── RegisterViewModel.kt
│   │   └── profile/               # Profile feature
│   │       ├── ProfileScreen.kt
│   │       └── ProfileViewModel.kt
│   ├── home/                      # Home feature
│   │   └── OpenCalisthenicsAppViewModel.kt
│   └── common/                    # Shared UI components
├── navigation/                    # Navigation graph
│   └── AppNavigation.kt
├── ui/theme/                      # Theme (Color, Theme, Type)
└── MainActivity.kt                # Single Activity entry point
```

## Screen Implementation Rules

Every screen MUST follow this pattern:

**1. UiState data class** - Immutable state representation:
```kotlin
data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)
```

**2. ViewModel** - Owns state, delegates business logic to Use Cases:
```kotlin
class LoginViewModel(
    private val signInUseCase: SignInUseCase = SignInUseCase(AuthRepositoryImpl())
) : ViewModel() {
    var uiState by mutableStateOf(LoginUiState())
        private set

    fun onEmailChange(email: String) {
        uiState = uiState.copy(email = email)
    }

    fun login(onSuccess: () -> Unit) {
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true, error = null)
            signInUseCase(uiState.email, uiState.password)
                .onSuccess { onSuccess() }
                .onFailure { e -> uiState = uiState.copy(error = e.message) }
            uiState = uiState.copy(isLoading = false)
        }
    }
}
```

**Important:** ViewModels MUST depend on Use Cases, NOT directly on Repositories. The flow is: **Screen → ViewModel → UseCase → Repository**.

**3. Composable Screen** - Pure UI, reads state from ViewModel:
```kotlin
@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit,
    viewModel: LoginViewModel = viewModel()
) {
    val uiState = viewModel.uiState  // mutableStateOf, not StateFlow
    // UI only - delegate all actions to viewModel
}
```

## Current Screens

| Screen | Route | Status | Description |
|--------|-------|--------|-------------|
| `LoginScreen` | `Login` | Done | Email/password login with Supabase |
| `RegisterScreen` | `Register` | Done | Registration with validation |
| `ProfileScreen` | `Profile` (tab) | Done | Logout button |
| `Home` | `Home` (tab) | Placeholder | Shows "Hello Android" |
| `Favorites` | `Favorites` (tab) | Placeholder | Not implemented |

## Navigation Structure

```
AppNavigation (NavHost)
├── Login → composable<Login> { LoginScreen }
├── Register → composable<Register> { RegisterScreen }
└── Home → composable<Home> { OpenCalisthenicsApp }
    └── NavigationSuiteScaffold (bottom nav / rail)
        ├── HOME tab → placeholder
        ├── FAVORITES tab → placeholder
        └── PROFILE tab → ProfileScreen
```

- Routes defined as `@Serializable object` in `navigation/AppNavigation.kt`
- Session-aware start destination (checks `SupabaseClient.client.auth.sessionStatus`)
- Transitions: 300ms fade + slide animations

## Use Case Conventions

Every Use Case MUST follow this pattern:

- **One public action per UseCase** - Single Responsibility Principle
- **`operator fun invoke`** - Allows calling the UseCase like a function: `signInUseCase(email, password)`
- **Receives repository interfaces** via constructor (never implementations)
- **Organized by feature** under `domain/usecase/{feature}/`

```kotlin
class SignInUseCase(
    private val authRepository: AuthRepository  // Interface, not Impl
) {
    suspend operator fun invoke(email: String, password: String): Result<Unit> {
        return authRepository.signIn(email, password)
    }
}
```

When a UseCase needs validation or orchestration logic beyond a simple repository call, that logic belongs here (not in the ViewModel):
```kotlin
class SignUpUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String): Result<Unit> {
        // Business validation belongs in the UseCase
        if (password.length < 6) return Result.failure(IllegalArgumentException("Password too short"))
        return authRepository.signUp(email, password)
    }
}
```

## Repository Conventions

- **Interface in `domain/repository/`** - Pure Kotlin, no framework dependencies
- **Implementation in `data/repository/`** - Contains Supabase/network/database specifics
- **Always return `Result<T>`** - Use `runCatching` to wrap external calls
- **Never throw exceptions** - All errors wrapped in `Result.failure()`

```kotlin
// domain/repository/ - contract
interface AuthRepository {
    suspend fun signIn(email: String, password: String): Result<Unit>
}

// data/repository/ - implementation
class AuthRepositoryImpl : AuthRepository {
    override suspend fun signIn(email: String, password: String): Result<Unit> = runCatching {
        SupabaseClient.client.auth.signInWith(Email) {
            this.email = email
            this.password = password
        }
    }
}
```

## Error Handling

- Repositories wrap all external calls with `runCatching` and return `Result<T>`
- ViewModels handle `Result` with `.onSuccess {}` / `.onFailure {}`
- Error messages are stored in `UiState.errorMessage` and displayed in the UI
- All error strings default to Spanish: `e.message ?: "Error al iniciar sesion"`
- Errors are cleared before each new action: `uiState = uiState.copy(errorMessage = null)`

## Dependency Injection Strategy

Currently using **manual constructor injection with defaults**. No DI framework (Hilt/Koin) is configured yet.

```kotlin
// ViewModel receives UseCase with a default instance
class LoginViewModel(
    private val signInUseCase: SignInUseCase = SignInUseCase(AuthRepositoryImpl())
) : ViewModel()
```

This pattern allows:
- Simple setup without framework overhead
- Easy testing by passing mock UseCases in constructor
- Future migration to Hilt by adding `@HiltViewModel` + `@Inject constructor`

**Rule:** ViewModels instantiate UseCases with default Impl. UseCases receive repository interfaces only.

## Domain Layer Purity

The `domain/` package MUST be **pure Kotlin** with zero Android framework dependencies:
- **No imports from** `android.*`, `androidx.*`, `io.github.jan.supabase.*`, or any framework
- `domain/repository/` contains only interfaces
- `domain/usecase/` depends only on `domain/repository/` and `domain/model/`
- `domain/model/` contains plain Kotlin data classes

This ensures the domain layer is testable without Android instrumentation and portable across platforms.

## Testing Conventions

- **Unit tests** in `app/src/test/` for ViewModels and UseCases
- **Test UseCases** by providing a fake repository implementation
- **Test ViewModels** by providing a fake UseCase or mock repository
- Use `kotlinx-coroutines-test` for coroutine testing (`runTest`, `TestDispatcher`)

```kotlin
class FakeAuthRepository : AuthRepository {
    var shouldFail = false
    override suspend fun signIn(email: String, password: String): Result<Unit> {
        return if (shouldFail) Result.failure(Exception("Auth failed"))
        else Result.success(Unit)
    }
    // ...
}

class SignInUseCaseTest {
    private val fakeRepo = FakeAuthRepository()
    private val useCase = SignInUseCase(fakeRepo)

    @Test
    fun `signIn returns success`() = runTest {
        val result = useCase("test@email.com", "password")
        assertTrue(result.isSuccess)
    }
}
```

## Key Conventions

- **No business logic in Composables** - All logic goes in ViewModels
- **State flows down, events flow up** - Unidirectional data flow
- **Dark theme** with custom palette: `Background` (#121212), `Surface` (#1E1E1E), `Primary500` (#BB86FC purple), `Secondary500` (#32D74B green), `ErrorRed` (#CF6679)
- **Supabase config** loaded from `local.properties` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- **Spanish as default language** for UI strings (matches web app)
- **Shared text field styling** - Use `OutlinedTextFieldDefaults.colors()` with the theme palette
- **Loading states** - All async buttons show `CircularProgressIndicator` and disable during loading
