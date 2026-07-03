# Desarrollo en local con Supabase

Todo el stack corre en local: Postgres, Auth, Storage y Studio vía Supabase CLI (contenedores Docker oficiales) + la app Next.js con `pnpm run dev`.

## Requisitos

- Docker (daemon corriendo)
- pnpm (la CLI de Supabase se instala como devDependency con `pnpm install`)

## Arrancar

```bash
pnpm install
pnpm db:start        # primera vez: descarga las imágenes Docker (~2-3 GB)
```

Al terminar imprime algo como:

```
API URL: http://127.0.0.1:55321
Studio URL: http://127.0.0.1:55323
anon key: eyJ...
```

> Los puertos van desplazados +1000 respecto a los default de Supabase (55321 en vez de 54321) para no chocar con otros stacks locales de Supabase en la misma máquina. Se configuran en `supabase/config.toml`.

Copia esos valores a tu `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key del output>
```

Y arranca la app:

```bash
pnpm run dev         # http://localhost:3000
```

`db:start` aplica automáticamente las migraciones de `supabase/migrations/` y el seed de `supabase/seed.sql`.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm db:start` | Levanta el stack local |
| `pnpm db:stop` | Lo para (los datos persisten) |
| `pnpm db:reset` | Recrea la BD desde migraciones + seed |
| `pnpm db:status` | Muestra URLs y keys del stack corriendo |

## Studio y correo local

- **Studio** (UI de la BD): http://127.0.0.1:55323
- **Inbucket** (captura los emails de auth — confirmaciones, magic links): http://127.0.0.1:55324

## Cambios de schema

1. Crea una migración nueva: `pnpm exec supabase migration new <nombre>` y escribe el SQL en el fichero generado en `supabase/migrations/`.
2. Refleja el cambio también en `supabase/schema.sql` (documento agregado de referencia) y en `supabase/seed.sql` si aplica.
3. `pnpm db:reset` para aplicarlo en local.

## Troubleshooting

- **"Cannot connect to the Docker daemon"** → arranca Docker.
- **Puertos ocupados (55320-55329)** → hay otro proceso usando ese rango; cambia los puertos en `supabase/config.toml`.
- **La app va en modo demo (datos mock)** → faltan las variables en `.env` o el stack no está corriendo (`pnpm db:status`).
- **Seed falla tras cambiar el schema** → revisa que `supabase/seed.sql` sea compatible y ejecuta `pnpm db:reset` para ver el error completo.
