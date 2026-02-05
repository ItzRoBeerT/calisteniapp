# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
npm run sync-exercises  # Sync exercises from external source (tsx scripts/sync-exercises.ts)
npx tsc --noEmit     # Type check without emitting
```

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router and React 19 RC
- **next-intl** for internationalization (Spanish `es` default, English `en`)
- **Supabase** for authentication and database (with mock data fallback when not configured)
- **Zustand** for client-side state management
- **ReactFlow** for interactive roadmap builder/viewer
- **Tailwind CSS** for styling

### Project Structure

```
app/[locale]/           # Locale-prefixed routes (es|en)
  ├── (auth)/           # Auth routes (login, register)
  ├── exercises/        # Exercise catalog
  ├── workouts/         # Workout management
  ├── roadmaps/         # Learning roadmaps
  │   ├── build/        # Roadmap builder
  │   └── [id]/         # Roadmap viewer
  └── blog/             # Blog posts

components/
  ├── roadmaps/         # Roadmap system (see below)
  ├── exercises/        # Exercise components
  ├── workouts/         # Workout components
  └── ui/               # Shared UI components

types/                  # TypeScript definitions
  ├── RoadmapNodes.ts   # Node types for roadmap builder
  ├── Roadmap.ts        # Roadmap and resource types
  └── Workout.ts        # Workout types

i18n/                   # Internationalization config
messages/               # Translation JSON files (en.json, es.json)
data/                   # Static data (exercises.json, roadmaps/*.json)
stores/                 # Zustand stores
utils/supabase/         # Supabase client (server.ts, client.ts)
```

### Roadmap System Architecture

The roadmap feature has a complex node-based architecture:

```
components/roadmaps/
  ├── nodes/
  │   ├── BaseNode.tsx          # Base wrapper with handles and resizer
  │   ├── builderNodeTypes.ts   # Node registry for builder mode
  │   ├── viewerNodeTypes.ts    # Node registry for viewer mode
  │   ├── content/              # TopicNode, SubTopicNode, ImageNode, VideoNode
  │   ├── text/                 # TitleNode, ParagraphNode, LabelNode
  │   ├── interactive/          # ButtonNode, TodoNode, ChecklistNode, ResourceButtonNode
  │   ├── lists/                # LegendNode, LinksGroupNode
  │   ├── decorative/           # HorizontalLineNode, VerticalLineNode
  │   └── container/            # SectionNode
  ├── config/
  │   ├── NodeConfigRouter.tsx  # Routes to appropriate config panel
  │   ├── BaseConfigPanel.tsx   # Base panel with tabs system
  │   └── *ConfigPanel.tsx      # Type-specific config panels
  ├── sidebar/
  │   ├── templates.ts          # Node templates for drag-and-drop
  │   └── NodeTemplatesSidebar.tsx
  └── RoadmapBuilderClient.tsx  # Main builder component
```

**Adding a new node type requires updating:**
1. `types/RoadmapNodes.ts` - Add type to `RoadmapNodeType` union and create `*NodeData` interface
2. `components/roadmaps/nodes/[category]/` - Create the node component
3. `builderNodeTypes.ts` and `viewerNodeTypes.ts` - Register the node
4. `nodes/index.ts` - Export the component
5. `config/*ConfigPanel.tsx` or create new panel - Add configuration UI
6. `config/NodeConfigRouter.tsx` - Add case for the new type
7. `sidebar/templates.ts` - Add node template
8. `sidebar/NodeTemplatesSidebar.tsx` - Add icon and translation key
9. `sidebar/ComponentsListSidebar.tsx` - Add to label and color mappings
10. `messages/en.json` and `messages/es.json` - Add translations

### Internationalization

- All routes are under `[locale]` segment
- Translations in `messages/{locale}.json`
- Use `useTranslations('namespace')` hook in components
- Middleware handles locale detection and redirects
- Default locale: Spanish (`es`)

### Supabase Integration

- Server client: `utils/supabase/server.ts` (async, uses cookies)
- Browser client: `utils/supabase/client.ts`
- Both return `null` if Supabase is not configured, enabling mock data fallback
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Styling Conventions

- Tailwind CSS with custom theme colors: `primary-*`, `secondary-*`, `surface`, `foreground`, `background`
- Font families: `'Orbitron'` for headings, `'Space Grotesk'` for body
- Dark theme by default
