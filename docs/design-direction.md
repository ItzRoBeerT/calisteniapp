# Dirección de diseño — OpenCalisthenics

Decisión (issue #23): **se mantiene la estética actual** — dark, acento púrpura neón y tipografía display Orbitron — pero unificada. El problema no era el estilo sino su aplicación inconsistente (fuentes hardcodeadas inline, Arial como fallback del body, Space Grotesk cargada por `@import` de CSS).

## Tokens

### Tipografía

| Token | Fuente | Uso |
|---|---|---|
| `font-heading` | Orbitron (variable CSS `--font-heading`) | Titulares, cifras destacadas, branding |
| `font-sans` (default) | Space Grotesk (variable CSS `--font-space-grotesk`) | Todo lo demás. Es la fuente por defecto del `body`; no hace falta declararla |

Ambas se cargan con `next/font` en `app/layout.tsx` y se exponen como variables CSS. Los tokens viven en `tailwind.config.ts` → `theme.extend.fontFamily`.

**Patrón aprobado:** clases (`font-heading`) o, si el elemento necesita un objeto `style` por otros motivos, `fontFamily: 'var(--font-heading), sans-serif'`. **Prohibido:** hardcodear nombres de fuente (`'Orbitron', sans-serif`) en estilos inline.

Excepción: canvas (p. ej. `particle-text-effect.tsx`, `HeroSection`) no puede usar `var()` en la propiedad `font`; se resuelve leyendo la variable con `getComputedStyle(...).getPropertyValue('--font-heading')`.

### Color

Definidos en `tailwind.config.ts`:

- `background` `#121212`, `surface` `#1E1E1E` — base dark.
- `primary` (base `#BB86FC`, púrpura) — acento principal: CTAs, foco, progreso activo.
- `secondary` (base `#32D74B`, verde) — éxito/completado.
- `tertiary` (base `#03DAC5`, teal) — acentos puntuales.
- Texto: `foreground` con opacidades (`/60`, `/40`…) para jerarquía.

**Patrón aprobado:** clases de Tailwind con estos tokens. Evitar hex sueltos en JSX salvo en datos (colores elegidos por el usuario en el builder de roadmaps).

## Reglas

1. Un roadmap creado por un entrenador sin criterio de diseño debe verse bien por defecto: los valores por defecto de nodos y edges usan la paleta anterior.
2. Jerarquía por tamaño y peso, no por multiplicar familias tipográficas.
3. Los glows/gradientes decorativos existentes se mantienen (identidad actual), pero no se añaden variantes nuevas: reutilizar las animaciones ya definidas en `tailwind.config.ts`.
4. Textos siempre vía `next-intl`; nunca strings de UI hardcodeados.
