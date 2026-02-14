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
│   └── repository/                # Repository interfaces
│       └── AuthRepository.kt      # Auth contract
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

**2. ViewModel** - Owns state, exposes `StateFlow`, contains all logic:
```kotlin
class LoginViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onEmailChange(email: String) {
        _uiState.update { it.copy(email = email) }
    }

    fun login(onSuccess: () -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            authRepository.signIn(_uiState.value.email, _uiState.value.password)
                .onSuccess { onSuccess() }
                .onFailure { e -> _uiState.update { it.copy(error = e.message) } }
            _uiState.update { it.copy(isLoading = false) }
        }
    }
}
```

**3. Composable Screen** - Pure UI, collects state from ViewModel:
```kotlin
@Composable
fun LoginScreen(
    viewModel: LoginViewModel = viewModel(),
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
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

## Key Conventions

- **No business logic in Composables** - All logic goes in ViewModels
- **State flows down, events flow up** - Unidirectional data flow
- **Dark theme** with custom palette: `Background` (#121212), `Surface` (#1E1E1E), `Primary500` (#BB86FC purple), `Secondary500` (#32D74B green), `ErrorRed` (#CF6679)
- **Supabase config** loaded from `local.properties` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- **Spanish as default language** for UI strings (matches web app)
- **Shared text field styling** - Use `OutlinedTextFieldDefaults.colors()` with the theme palette
- **Loading states** - All async buttons show `CircularProgressIndicator` and disable during loading
