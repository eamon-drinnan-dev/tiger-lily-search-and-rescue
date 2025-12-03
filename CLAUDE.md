# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT**: This is the authoritative guide for automated changes (Claude Code, Codex, etc.). Where this conflicts with CONTRIBUTING.md, follow CLAUDE.md and update both documents to realign. CONTRIBUTING.md provides expanded detail and examples for human contributors.

## Standards Precedence & Authority

When interpreting or applying standards, follow this precedence hierarchy:

1. **Core Engineering Rules** (highest priority)
   - i18n usage, test selectors, className conventions, linting
   - Type safety, constants over magic values
   - Performance measurement before optimization

2. **Domain & Visual Rules**
   - SAR/disaster-response context (not military C2)
   - OCHA/TL icon system, SAR color semantics
   - Civilian operational terminology

3. **Phase Instructions**
   - Phase-specific scope and requirements
   - Current phase constraints and goals

**Conflict Resolution**: Core engineering rules always win. SAR domain rules replace older MIL/C2 semantics. Phase docs never override core standards.

## Tiger Lily — Architectural Philosophy

Tiger Lily follows a **top-down, single-source-of-truth architecture** where all domain data originates from a centralized store or middleware layer that mirrors backend schema as closely as possible. This ensures that every part of the UI reflects a consistent, authoritative state rather than ad-hoc component-level assumptions.

From that single store, **selectors act as the consolidation and derivation layer**, assembling complex, interdependent objects into coherent UI-ready structures. These selectors merge raw backend data, computed values, validations, and related entities into legible shapes that the UI can consume deterministically.

With the domain logic centralized, **components remain data-agnostic**: they render what they're given, carry no internal knowledge of backend shape or relationships, and only manage UI-local transient state (focus, temporary input buffers, toggles). This separation ensures stable referential identity, predictable reactivity, and isolates complexity where it belongs — in the architectural layers, not the rendering layer.

The end result is a codebase that is **legible, debuggable, scalable, and built to operate reliably under real-time data load**.

### Architectural Rules for Claude

When adding new features or modifying existing code, follow these principles:

- **Single Source of Truth**: Domain data should come from a central store / middleware that mirrors backend schemas; no ad-hoc per-component derived stores.

- **Selectors as Consolidation Layer**: Use selectors as the only place where:
  - Raw backend data is combined or transformed
  - Validations and related entities are merged
  - UI-ready shapes are built

- **Data-Agnostic Components**: React components must:
  - Be data-agnostic (no knowledge of backend schema)
  - Only manage UI-local state (focus, open/closed, temporary input)
  - Avoid duplicating domain logic or selectors

- **Design from Domain First**: When adding new features:
  - Design the domain model and selectors first
  - Then wire them into components

- **Stable Data Flows**: Prefer stable, referentially safe data flows that keep reactivity predictable and easy to profile.

### Monorepo Structure & Scope

Tiger Lily is organized as a **monorepo**:

- **Root CLAUDE.md** (this file): Defines global standards (architecture, i18n, duplication minimization, performance philosophy)
- **Package-specific CLAUDE.md**: Each subfolder (`tiger-lily-search-and-rescue/`, `tiger-lily-packages/*/`) may have its own CLAUDE.md with more specific rules

**When editing a file**:
1. Apply the **local CLAUDE.md** first (if present in the package)
2. Fall back to the **root CLAUDE.md** for global rules
3. **Never apply front-end-specific rules** to backend or library packages

## Project Summary

**Purpose**: Tiger Lily – SAR/disaster-response dashboard for tracking drones and K9 teams. Demonstrates real-time telemetry, geospatial visualization (2D/3D), and clean operator UI for civilian emergency operations.

**Audience**: SAR coordinators, emergency responders, and technical stakeholders. Focus on robustness, clarity, operational efficiency, and narrative.

**Domain Context**:
- **Entities**: Drones (UAS), K9 teams, persons/victims, SAR zones, hazards, landing zones
- **NOT in scope**: Manned aircraft, military assets, weapons systems, threat tracking

**Success Criteria**:
- Smooth Cesium 3D globe with OpenLayers 2D overlays
- Live-feel telemetry (mocked) with update interval ≤ 500 ms and stable FPS
- Ergonomic UI (MUI), responsive layout, light/dark themes
- Minimal cognitive load: clear typography, legible overlays, sane defaults
- Documented components + architecture, with auto-docs flow for new code

## Stack and Rationale

- **React 19 + TypeScript** — Type safety, latest React features
- **Vite** — Using `rolldown-vite@7.1.14` (faster Rust-based bundler alternative)
- **Zustand** — Lightweight global state with simple actions/selectors
- **Cesium** — High-performance 3D globe and camera control
- **OpenLayers** — Fast 2D overlays & editor-style tools (draw polygon, etc.)
- **MUI (Material-UI)** — Theming, accessible UI primitives, consistent design language
- **Playwright** — E2E smoke tests for rendering/interaction regressions

**Why Cesium + OpenLayers together**: 3D context for spatial awareness + 2D precision overlays for detailed interaction and annotation.

## Build and Development Commands

```bash
# Start development server with hot module replacement
npm run dev

# Build for production (TypeScript check + Vite build)
npm run build

# Run linter
npm run lint

# Preview production build locally
npm run preview
```

## Architecture & Conventions

### Directory Layout (Monorepo)

```
tiger-lily-search-and-rescue/    # Primary front-end application
  src/
    components/        # Visual components (dumb by default, typed props)
    features/          # Vertical slices (map, telemetry, entities)
    hooks/             # Reusable hooks (e.g., useCesiumScene)
    lib/               # Utilities, adapters, constants
    state/             # Zustand slices & store setup
    styles/            # Theming, global styles
    types/             # Global shared TypeScript types
    test/              # Playwright tests and helpers

tiger-lily-packages/             # Internal libraries
  component-library/   # Shared UI components
  assets/              # Icons, images, design tokens
  i18n/                # Internationalization utilities
  map-core/            # Cesium/OpenLayers integration
  bridge/              # Backend integration SDK (future)
  content-manager/     # Content management SDK (future)
```

### Naming Conventions

- **PascalCase** for components and component files: `FlightTrackPanel.tsx`
- **Verb-Noun** for actions: `addEntity`, `updateTelemetry`
- **Nouns** for state slices: `entitiesSlice`, `uiSlice`

### Component Pattern

- Presentational by default. No side-effects in render.
- Pass data via typed props; memoize heavy subtrees (`React.memo`) when needed.
- Colocate minor helpers; extract shared helpers to `lib/`.

### State Management Rules

- Centralize cross-cutting state in Zustand slices; keep components lean.
- Selectors must be minimal and memoized to prevent re-renders.
- Actions are pure; side-effects live in hooks (e.g., `useTelemetryFeed`).
- Real-time state: predictable updates, selector hygiene, performance budget.

### Error Handling

- Guard against missing data (nullish checks) near boundaries
- Surface user-visible errors via a non-blocking toast/panel
- No silent failures; log errors for debugging

### Testing

- Playwright smoke tests: app boots, map renders, entity toggle works
- Add lightweight unit tests for reducers/selectors when useful
- Focus on critical paths and integration points

### Performance

- Prefer `requestAnimationFrame` loop for Cesium camera ticks
- Batch state updates; avoid cascading re-renders (selector hygiene)
- Use Web Worker for heavy mock generation if needed (stretch goal)
- Target: 60 FPS with 50+ entities on screen

### Accessibility

- Respect `prefers-color-scheme`, proper contrast ratios
- Keyboard navigation for critical interactions
- ARIA labels where appropriate (especially for map controls)

### TypeScript Configuration

- Uses TypeScript project references via `tsconfig.json`
- Application code: `tsconfig.app.json` (strict mode enabled)
- Node/build tooling: `tsconfig.node.json`
- Strict type checking with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`
- **Do not use `any`** unless unavoidable, then explain in a comment

### Vite Configuration

- Custom bundler: Uses `rolldown-vite` instead of standard Vite (specified in overrides)
- Cesium integration: `CESIUM_BASE_URL` is defined as `/cesium` for asset loading
- When working with Cesium assets, ensure they're properly configured to load from this base URL

### Mapping Libraries Integration

Both OpenLayers and Cesium work together:
- **Cesium**: 3D globe as the base layer, handles camera/navigation
- **OpenLayers**: 2D overlay canvas for precise vector features, annotations, editing tools
- Coordinate systems: OpenLayers uses various projections, Cesium uses WGS84 cartographic coordinates
- Synchronize camera positions between the two when both are active

### ESLint Configuration

- Modern flat config format using `eslint.config.js`
- Configured with React Hooks rules and React Refresh for HMR
- TypeScript ESLint with recommended rules
- Ignores `dist` directory

## Core Features (MVP)

1. **Base Map Integration** — Cesium globe + OpenLayers 2D overlay layer
2. **Entity System** — Drones/aircraft with geo-positions, heading, speed
3. **Telemetry Simulation** — Mock WebSocket updating entities at 100–500 ms
4. **UI Layout** — Top bar, left sidebar, map controls, theme toggle
5. **Playwright Tests** — Boot, render markers, toggle layer, camera move

## Claude's Responsibilities

### Do

- Create/modify files with idiomatic TypeScript and React
- Keep components small; extract reusable hooks
- Add JSDoc to public functions/components (see auto-docs section below)
- Maintain docs in `/docs` (component pages and indices)
- Propose performance or API improvements with concise diffs
- Keep commits atomic with descriptive messages
- Keep changes small & reversible; include rationale when non-obvious
- Prefer composition over inheritance; avoid prop drilling
- Leave `// TODO(eamon):` breadcrumbs sparingly with owner and intent

### Don't

- Introduce new major libraries without a brief rationale
- Hard-code secrets or external endpoints
- Degrade type safety (no `any` unless unavoidable, then explain)
- Create files with generic or obvious content (avoid boilerplate documentation)

## Auto-Documentation for New Components

**Goal**: Whenever a new React component is created in `src/components` or `src/features/**/components`, generate documentation automatically.

### Documentation Artifacts

- `docs/components/<ComponentName>.md` — Overview, props table, usage examples
- `docs/component-index.md` — Alphabetical list with brief summaries

### JSDoc Standard

Embed in each component:

```tsx
/**
 * <ComponentName>
 * @description One-line purpose. Include domain context where helpful.
 * @example
 * <ComponentName propA="value" />
 */
export function ComponentName(props: Props) { /* ... */ }
```

### Auto-Docs Workflow

When creating or modifying components in `src/components/**` or `src/features/**/components/**`:

1. Add JSDoc comments following the standard above
2. After creating/updating the component, generate documentation:
   - Create/update `docs/components/<ComponentName>.md` using the template structure
   - Update `docs/component-index.md` with an entry for the component
3. Include updated docs in the same commit as the component changes

### Docs Template Structure

**Component page** (`docs/components/<ComponentName>.md`):

```markdown
# ComponentName

**Location**: `src/components/ComponentName.tsx`

## Purpose
[One-line description from JSDoc]

## Props
| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| propName | `string` | Yes | - | Description |

## Usage
```tsx
<ComponentName prop="value" />
```

## Notes
- Performance considerations: [if applicable]
- Accessibility: [ARIA labels, keyboard nav, etc.]
```

**Component index** (`docs/component-index.md`):

```markdown
# Component Index

- **ComponentName** — Brief summary (`src/components/ComponentName.tsx`)
```

## Commit Message Convention

Format: `<type>: <scope>: <summary>`

**Types**: feat, fix, refactor, docs, perf, test, chore

**Example**: `feat: map: add Cesium camera controls and FPS guard`

## Key Technical Highlights

- Why Cesium + OpenLayers together: 3D context + 2D precision overlays
- Real-time state: predictable updates, selector hygiene, perf budget
- Operator UX: reduce clutter, progressive disclosure, actionable layers
- Extensibility: slices & features make domain growth cheap

## Initial Task Queue

- [ ] Scaffold `src/state/store.ts` with entities/ui slices
- [ ] Set up auto-docs templates under `docs/_templates/`
- [ ] Implement `hooks/useCesiumScene.ts` and `features/map/Map3D.tsx`
- [ ] Implement `features/overlay/Overlay2D.tsx` with OpenLayers mount
- [ ] Create `features/telemetry/useTelemetryFeed.ts` (mock WS → Zustand)
- [ ] Build `components/EntityList.tsx` and `components/EntityMarker.tsx`
- [ ] Add MUI theme toggle + layout shell (TopBar, Sidebar)
- [ ] Add Playwright boot test + layer toggle test
- [ ] Generate initial docs for all components created above

---

## Coding Standards (MANDATORY)

These standards are enforced project-wide. Follow them for all new code and when editing existing code.

### 1. Internationalization (i18n)

**ALL user-visible strings MUST be internationalized using react-intl.**

- **Message Catalog**: `src/i18n/locales/en-US.ts`
- **Provider**: Wrapped in `src/main.tsx` via `I18nProvider`
- **Usage**: Use `<FormattedMessage id="key" />` or `useIntl()` hook

**Example:**
```tsx
import { FormattedMessage } from 'react-intl';

// Good ✅
<h1><FormattedMessage id="app.title" /></h1>

// Bad ❌
<h1>Tiger Lily</h1>
```

**Adding new strings:**
1. Add key to `src/i18n/locales/en-US.ts`
2. Use `<FormattedMessage>` in component
3. Never hardcode UI strings in JSX

**Reference**: See `CONTRIBUTING.md` for detailed i18n workflow.

### 2. className Conventions

**Use kebab-case with `{parent-component}__{sub-context}` pattern.**

- **For styling/theming only** (never use className for tests)
- All public components **must accept** an optional `className` prop
- Inner elements follow `parent__child` naming

**Example:**
```tsx
export interface AlertsRailProps {
  className?: string;
}

export function AlertsRail({ className }: AlertsRailProps) {
  return (
    <div className={className}>
      <div className="alerts-rail__header">
        <h2 className="alerts-rail__title">Alerts</h2>
      </div>
      <div className="alerts-rail__content">
        {/* ... */}
      </div>
    </div>
  );
}
```

**Good:** `entity-card`, `alerts-rail__header`, `topbar__theme-toggle`
**Bad:** `EntityCard`, `header`, `themeToggle`

### 3. Test Selectors (test-py)

**Use `test-py` attribute for ALL testable DOM elements.**

- Playwright is configured with `testIdAttribute: 'test-py'`
- **Never** select by className or hardcoded text in tests
- Use stable, semantic identifiers

**Example:**
```tsx
<button test-py="submit-button" className="form__submit-btn">
  <FormattedMessage id="action.submit" />
</button>

<div test-py="entity-card" className="entity-card">
  <h3 test-py="entity-card-title">{name}</h3>
</div>
```

**In tests:**
```typescript
await page.getByTestId('submit-button').click();
await page.getByTestId('entity-card').first();
```

**Reference**: See `playwright.config.ts` for testIdAttribute configuration.

### 4. Design Tokens and Color Standards

**Use design tokens from `src/styles/tokens.ts` for all colors.**

Adheres to **OCHA Humanitarian Icon Standards** (disaster response context) and **NASA HFES-300** (contrast requirements).

**SAR Semantics**: Green/Amber/Red indicate health/operational state, NOT affiliation.

#### SAR Operational State Colors

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `tokens.colors.healthyGreen` | N/A | Healthy/operational state (5.5:1 contrast) |
| `tokens.colors.degradedAmber` | N/A | Degraded/caution state (4.7:1 contrast) |
| `tokens.colors.criticalRed` | N/A | Critical/danger state (4.8:1 contrast) |
| `tokens.colors.infoBlue` | N/A | Informational/safe state (5.1:1 contrast) |

#### Entity Status Colors

| Token | Usage |
|-------|-------|
| `tokens.status.active` | Active entities (green) |
| `tokens.status.idle` | Idle entities (gray) |
| `tokens.status.warning` | Warning state (amber) |
| `tokens.status.error` | Error state (red) |
| `tokens.status.offline` | Offline entities (dark gray) |

#### Alert Severity

| Token | CSS Variable | Usage |
|-------|--------------|-------|
| `tokens.alert.critical` | `--alert-critical` | Critical alerts (red) |
| `tokens.alert.warning` | `--alert-warning` | Warning alerts (orange) |
| `tokens.alert.info` | `--alert-info` | Info alerts (blue) |

**Example:**
```tsx
import { tokens } from '@/styles/tokens';

// SAR operational state colors
<Box sx={{ color: tokens.colors.healthyGreen }}>Operational</Box>
<Box sx={{ backgroundColor: tokens.status.active.background }}>Active Entity</Box>
<Box sx={{ backgroundColor: 'var(--alert-critical)' }}>Critical Alert</Box>
```

#### Critical Alert Modality

**IMPORTANT: Color is NOT the sole carrier of meaning for critical states.**

For **CRITICAL** alerts:
- ✅ Use pulse animation (≤ 3 Hz)
- ✅ Pair with audio cue
- ✅ Use `--alert-critical` color

For **WARNING** alerts:
- Use `--alert-warning` color
- Optional subtle pulse
- No audio required

For **INFO** alerts:
- Use `--alert-info` color
- Text only, no motion

**Example:**
```tsx
<Box
  sx={{
    backgroundColor: 'var(--alert-critical)',
    animation: 'pulse var(--critical-pulse-duration) ease-in-out infinite',
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.6 },
    },
  }}
>
  {/* Also trigger audio cue */}
</Box>
```

**Motion Constraint**: Keep blink/pulse rate ≤ 3 Hz (defined in `tokens.motion.blinkMaxHz`).

### 5. Constants and Magic Values

**Avoid magic numbers and strings. Use named constants stored in stable locations.**

Magic values scattered throughout the codebase reduce maintainability and increase the risk of typos. Centralize commonly-used values as constants.

#### Storage Locations

- **Application-wide constants**: `src/lib/constants.ts`
- **Domain-specific constants**: Colocate with related types (e.g., `src/types/entity.ts`)
- **Component constants**: Define at module scope if used only within that file

#### Common Patterns

**App Modes:**
```tsx
// src/lib/constants.ts
export const AppModes = {
  MONITORING: 'monitoring',
  EDITOR: 'editor',
} as const;

export type AppMode = typeof AppModes[keyof typeof AppModes];

// Usage
// Good ✅
if (state.appMode === AppModes.MONITORING) {
  return AppModes.EDITOR;
}

// Bad ❌
if (state.appMode === 'monitoring') {
  return 'editor';
}
```

**Theme Modes:**
```tsx
// src/lib/constants.ts
export const ThemeModes = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Good ✅
themeMode === ThemeModes.LIGHT

// Bad ❌
themeMode === 'light'
```

**Editing Tools:**
```tsx
// src/lib/constants.ts
export const EditingTools = {
  ZONE: 'zone',
  PATHWAY: 'pathway',
  ENDPOINT: 'endpoint',
} as const;

// src/types/ui.ts
export type EditingTool = typeof EditingTools[keyof typeof EditingTools];

// Usage
// Good ✅
if (editingTool === EditingTools.ZONE) {
  startDrawing(EditingTools.ZONE);
}

const handleToolClick = (tool: EditingTool) => {
  // Type-safe function parameter
};

// Bad ❌
if (editingTool === 'zone') {  // Magic string!
  startDrawing('zone');
}

const handleToolClick = (tool: 'zone' | 'pathway' | 'endpoint') => {
  // Duplicated union type across components
};
```

**Entity Types and Status:**
```tsx
// src/types/entity.ts
export const EntityTypes = {
  DRONE: 'drone',
  K9: 'k9',
  PERSON: 'person',
  SAR_ZONE: 'sar-zone',
  LANDING_ZONE: 'landing-zone',
} as const;

export const EntityStatuses = {
  ACTIVE: 'active',
  IDLE: 'idle',
  WARNING: 'warning',
  ERROR: 'error',
  OFFLINE: 'offline',
} as const;

export type EntityType = typeof EntityTypes[keyof typeof EntityTypes];
export type EntityStatus = typeof EntityStatuses[keyof typeof EntityStatuses];

// Usage
// Good ✅
if (entity.type === EntityTypes.DRONE) {
  return Messages.Entities.Types.Drone;
}

// Bad ❌
if (entity.type === 'drone') {  // Magic string!
  return Messages.Entities.Types.Drone;
}
```

**Zone Types, Geometry, and Parameters:**
```tsx
// src/types/zones.ts
export const ZoneTypes = {
  INFORMATIONAL: 'INFORMATIONAL',
  CONTROLLED: 'CONTROLLED',
  AUTONOMOUS: 'AUTONOMOUS',
} as const;
export type ZoneType = typeof ZoneTypes[keyof typeof ZoneTypes];

export const ZoneEffects = {
  INFORM: 'INFORM',
  WARN: 'WARN',
  ENFORCE: 'ENFORCE',
} as const;
export type ZoneEffect = typeof ZoneEffects[keyof typeof ZoneEffects];

export const GeometryTypes = {
  POLYGON: 'Polygon',
  VOLUME: 'Volume',
} as const;
export type GeometryType = typeof GeometryTypes[keyof typeof GeometryTypes];

export const EndpointTypes = {
  DESTINATION: 'DESTINATION',
  RETURN_BASE: 'RETURN_BASE',
  STAGING: 'STAGING',
} as const;
export type EndpointType = typeof EndpointTypes[keyof typeof EndpointTypes];

export const EndpointActions = {
  LAND: 'LAND',
  HOLD: 'HOLD',
  DELIVER: 'DELIVER',
  SURVEY: 'SURVEY',
  RETURN_BASE: 'RETURN_BASE',
} as const;
export type EndpointAction = typeof EndpointActions[keyof typeof EndpointActions];

// Usage in zone evaluation
// Good ✅
if (zone.type === ZoneTypes.AUTONOMOUS && zone.parameters?.noGo) {
  exceptions.push(createException('GEOFENCE_BREACH', 'ERROR'));
}

if (zone.geometry.type === GeometryTypes.POLYGON) {
  coordinates = zone.geometry.coordinates;
} else {
  coordinates = zone.geometry.base;
}

// Bad ❌
if (zone.type === 'AUTONOMOUS' && zone.parameters?.noGo) {
  // Magic string makes refactoring error-prone
}

if (zone.geometry.type === 'Polygon') {
  // Typo risk: 'polygon' vs 'Polygon'
}
```

**Numeric Constants:**
```tsx
// Good ✅
const TELEMETRY_UPDATE_INTERVAL_MS = 500;
const MAX_ENTITIES = 100;
const DEFAULT_CAMERA_HEIGHT = 500000;

setInterval(updateTelemetry, TELEMETRY_UPDATE_INTERVAL_MS);

// Bad ❌
setInterval(updateTelemetry, 500);
```

**Color Constants:**
```tsx
// src/styles/tokens.ts
export const colors = {
  border: {
    light: '#e0e0e0',
    dark: 'rgba(255, 255, 255, 0.08)',
  },
  background: {
    paper: '#ffffff',
    surface0: '#0b0f14',
    // ... more colors
  },
} as const;

// Good ✅
import { colors } from '@/styles/tokens';
borderColor: mode === ThemeModes.LIGHT ? colors.border.light : colors.border.dark

// Bad ❌
borderColor: mode === 'light' ? '#e0e0e0' : 'rgba(255,255,255,0.08)'
```

**Important:** All colors should be defined in `src/styles/tokens.ts`. Never hardcode hex values, RGB values, or color strings directly in components or styles.

#### Benefits

- **Type Safety**: `as const` enables literal type inference
- **Autocomplete**: IDE suggestions prevent typos
- **Refactoring**: Change value in one place
- **Discoverability**: Constants document available options
- **Consistency**: Ensures same values used everywhere
- **Theming**: Centralized colors enable easy theme customization
- **DRY (Don't Repeat Yourself)**: Avoids duplicating string literals and union types across multiple components

### 6. Styling Rules

**Never use the React `style={{...}}` prop in application code, except for extremely rare one-off cases.**

If you truly must use inline styles, leave a comment explaining why.

#### Preferred Styling Approaches

For layout and visual styling:

1. **Prefer `className`** + our LESS/token system, OR
2. **MUI's `sx` or `styled()` APIs** for local, stateful, or theme-aware styles

#### Token Usage

**All spacing, radii, and dimensions must come from tokens/theme** where possible:
- Use `theme.spacing()` for spacing
- Use Tiger Lily size tokens (`tokens.size.*`)
- Never use hardcoded numbers sprinkled through JSX

#### Explicit Rule

**Simple one-liners like `style={{ width: 40 }}` or `style={{ marginTop: 8 }}` are NOT allowed.**

Convert them to `sx` or CSS classes and use tokens.

**Examples:**

```tsx
// Bad ❌
<Box style={{ width: 40, height: 40, border: 'none', cursor: 'pointer' }}>
  {/* ... */}
</Box>

<TextField style={{ marginTop: 8 }} />

// Good ✅ - Using sx with tokens
<Box
  sx={{
    width: theme.spacing(5),
    height: theme.spacing(5),
    border: 'none',
    cursor: 'pointer',
  }}
>
  {/* ... */}
</Box>

<TextField sx={{ mt: 1 }} />

// Good ✅ - Using className
<Box className="color-swatch-input">
  {/* ... */}
</Box>

// In CSS/LESS:
// .color-swatch-input {
//   width: var(--spacing-5);
//   height: var(--spacing-5);
//   border: none;
//   cursor: pointer;
// }
```

### 7. Layout Philosophy

Core containers (e.g., left drawer, main content split) define width/height. Child components should **flex to consume available space** rather than using fixed widths.

#### When Fixed Widths/Heights Are Acceptable

Fixed widths/heights are only acceptable for:

1. **Intrinsic-size controls**: Icon buttons, color swatches, small indicators
2. **Very specific design elements** that must be square or constant-sized

#### Using Fixed Sizes Correctly

When using fixed sizes:

1. **Use tokens** (`theme.spacing`, `tokens.size.sm/md/lg`) instead of magic numbers
2. **Keep them local** to the component via `sx` or a dedicated CSS class (e.g., `.tl-color-swatch-input`)
   - Avoid deep, nested selectors
3. **In flex layouts**, use `flex: 1`, `flexShrink: 0`, and `gap` to structure space instead of padding hacks

#### Example: Entity Group Editor Color Input

In the entity group editor, the color input should:

```tsx
// Good ✅
<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
  {/* Color input: fixed size with token, no growth */}
  <Box
    component="input"
    type="color"
    sx={{
      width: theme.spacing(5),
      height: theme.spacing(5),
      flexShrink: 0,
      border: 'none',
      cursor: 'pointer',
      borderRadius: 1,
    }}
  />

  {/* Text field: grows to fill remaining space */}
  <TextField
    label="Group Name"
    sx={{ flex: 1 }}
  />
</Box>

// Bad ❌
<Box style={{ display: 'flex' }}>
  <input
    type="color"
    style={{ width: 40, height: 40, marginRight: 16 }}
  />
  <TextField label="Group Name" style={{ width: 200 }} />
</Box>
```

**Key principles:**
- Core containers define dimensions
- Children flex to fill available space (`flex: 1`, `minWidth: 0`)
- Use `gap` for spacing between flex items, not margins
- Fixed sizes only for intrinsic controls, always with tokens
- Use `flexShrink: 0` to prevent fixed-size items from shrinking

### 8. Component Checklist

When creating or editing components, ensure:

- [ ] **i18n**: All user-visible strings use `<FormattedMessage>` or `useIntl()`
- [ ] **className**: Component accepts optional `className` prop
- [ ] **Class naming**: Use kebab-case with `parent__child` pattern
- [ ] **test-py**: All testable elements have `test-py` attributes
- [ ] **Color tokens**: All colors use tokens from `src/styles/tokens.ts` (no hardcoded hex/rgb values)
- [ ] **Constants**: No magic strings/numbers; use named constants from `src/lib/constants.ts`
- [ ] **Styling**: No `style={{...}}` prop; use `sx` or `className` with tokens
- [ ] **Layout**: Use flex properties (`flex: 1`, `gap`) instead of fixed widths/padding
- [ ] **Critical alerts**: Motion (≤ 3 Hz) + audio for CRITICAL severity
- [ ] **JSDoc**: Public components have JSDoc with `@description` and `@example`
- [ ] **Props interface**: TypeScript interface for all props

**Reference**: See `CONTRIBUTING.md` for comprehensive examples and workflow.

### 9. Default Actions When Editing Code

- **Hardcoded strings?** → Migrate to i18n (`src/i18n/locales/en-US.ts`)
- **Magic strings/numbers?** → Extract to named constants (`src/lib/constants.ts`)
- **Hardcoded colors?** → Use color tokens (`src/styles/tokens.ts`)
- **Inline styles (`style={{...}}`)?** → Convert to `sx` or `className` with tokens
- **Fixed widths in child components?** → Use `flex: 1` to fill available space
- **Tests selecting by className?** → Replace with `getByTestId` + `test-py`
- **Missing `className` support?** → Add optional `className` prop
- **Critical indicator only uses color?** → Add motion (≤ 3 Hz) + audio cue

---

## Duplication Minimization Standards

**Tiger Lily enforces a strict "duplication minimization" rule:**

If something appears in the codebase more than once, and it expresses the same conceptual meaning, style, or behaviour, it must be factored into a shared definition.

### This Applies To

#### 1. i18n Strings

Common UI elements **must use a shared common namespace** instead of duplicating string entries.

**This is MANDATORY, not a suggestion.**

If you see the same English string appearing in 2+ feature namespaces, it MUST be consolidated into `Messages.Common`.

**Common categories to consolidate:**
- **Actions**: Cancel, Save, SaveChanges, Create, Edit, Delete, Publish, Discard, Search, Sort, Filter, Confirm
- **Fields**: Name, Type, Color, Status, Description, Notes
- **States**: Loading, Empty, NoResults, Error
- **Time**: Today, Yesterday, JustNow, MinutesAgo, HoursAgo

**Example:**
```tsx
// Bad ❌ - Duplicated across features
Messages.Zones.Cancel = 'Cancel';
Messages.Pathways.Cancel = 'Cancel';
Messages.Endpoints.Cancel = 'Cancel';
Messages.Zones.Name = 'Zone Name';
Messages.Pathways.Name = 'Pathway Name';

// Good ✅ - Shared common namespace
Messages.Common.Actions.Cancel = 'Cancel';
Messages.Common.Actions.Save = 'Save';
Messages.Common.Fields.Name = 'Name';
Messages.Common.Fields.Type = 'Type';
Messages.Common.Fields.Color = 'Color';

// Usage - feature-specific context when needed
<FormattedMessage id={Messages.Common.Actions.Cancel} />
<TextField label={intl.formatMessage({ id: Messages.Common.Fields.Name })} />
```

**When to keep feature-specific strings:**
- Only when the string has feature-specific context that changes its meaning
- Example: "Create Zone" vs "Create Pathway" - these can stay separate as `Messages.Zones.CreateNew` / `Messages.Pathways.CreateNew`
- But plain "Create", "Save", "Cancel" MUST be shared

#### 2. CSS / Style Definitions

Multi-line or frequently repeated `sx` fragments or LESS rules **must be extracted into reusable classes, mixins, or shared sx objects**.

**Example:**
```tsx
// Bad ❌ - Repeated sx block
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>

// Good ✅ - Shared sx object
const rowLayoutSx = { display: 'flex', alignItems: 'center', gap: 2, p: 2 };
<Box sx={rowLayoutSx}>
<Box sx={rowLayoutSx}>

// Better ✅ - Reusable class
<Box className="tl-row-layout">
```

#### 3. Shared Layout Patterns

Repeated `display: flex` rows, column layouts, paddings, borders, etc. **should use a common class or common component**.

**Example:**
```tsx
// Bad ❌ - Repeated layout pattern
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
  <Typography>Title</Typography>
  <Typography variant="body2">Content</Typography>
</Box>

// Good ✅ - Shared component
<VerticalStack gap={1}>
  <Typography>Title</Typography>
  <Typography variant="body2">Content</Typography>
</VerticalStack>
```

#### 4. Shared React Logic

Repeated transforms (status mapping, accent color selection, selection state logic, battery formatting, etc.) **must be moved to helpers, hooks, or utilities**.

**Example:**
```tsx
// Bad ❌ - Duplicated logic in multiple components
const getStatusColor = (status: string) => {
  if (status === 'active') return 'success.main';
  if (status === 'error') return 'error.main';
  return 'text.secondary';
};

// Good ✅ - Shared utility
// src/lib/statusUtils.ts
export const getStatusColor = (status: EntityStatus) => { /* ... */ }
```

#### 5. Common Components

Repeated UI patterns (cards, rows, labeled metrics, chips) **should be promoted to shared components** instead of reimplemented locally.

### Exceptions

This rule does **not** apply to:

1. **Hyper-local one-liners** (e.g., `gap: 1` in one place)
2. **Unique behavioural logic**
3. **Temporary WIP code** explicitly marked with a TODO

### AI Requirements

**Claude must:**

1. **Search for existing patterns** before introducing anything new
2. **Prefer refactoring duplicates** into shared assets
3. **Never introduce new copies** of strings, styles, or logic if a generic version already exists
4. **Ask when unclear** if something should be generic

**Duplication is treated as technical debt.**

When Claude finds any duplication (strings, style blocks, UI structures, helper logic), it should either:

1. **Consolidate it** into a generic asset, or
2. **Ask whether it should be extracted** before proceeding

**Never introduce:**
- New inline strings without checking i18n common namespace
- New large `sx` blocks without checking for existing shared styles
- New helper logic without checking if an equivalent generic asset already exists

---

## Phase 3.5: Standards Alignment

**Current Phase**: Phase 3.5 – Standards Alignment and Cleanup

**Scope**: Align codebase with Tiger Lily SAR domain, remove military concepts, enforce existing standards. **NO new features.**

### Domain Alignment

**Treat this project as**: Tiger Lily – SAR/disaster-response drone & K9 dashboard

**Entities of interest**:
- Drones (UAS)
- K9 teams
- Persons / victims
- SAR zones / hazards / landing zones

**Out of scope**:
- Manned aircraft
- Military assets
- Weapon systems
- Threat tracking
- Affiliation logic (hostile/friend/neutral/unknown)

### Do NOT Reintroduce Military Concepts

**Never add or resurrect**:
- hostile / friend / neutral / unknown affiliation logic
- weapon systems, threats, "targets"
- MIL-STD-2525D frames or APP-6 shapes

**If you see these in code**: Refactor toward SAR semantics or remove completely.

### Symbology Guidance

**Icon System**:
- Use OCHA/NAPSG-style pictograms for civilian SAR
- Use custom TL icons (drone, LZ, K9) from `src/assets/tl/`
- Halos encode state and emphasis, icons encode what the entity is

### Design Token Migration

**Deprecated Patterns** (remove completely, not just mark deprecated):
- `tokens.affiliation.*` (friend/hostile/neutral/unknown)
- Any MIL-STD-2525D references

**Use Instead**:
- `tokens.colors.healthyGreen` – Healthy/operational state
- `tokens.colors.degradedAmber` – Degraded/caution state
- `tokens.colors.criticalRed` – Critical/danger state
- `tokens.colors.infoBlue` – Informational/safe state
- `tokens.status.*` – Entity status colors

**Single Source of Truth**: `src/styles/tokens.ts` is canonical. LESS tokens must derive from it.

### Documentation Alignment

**CLAUDE.md** (this file):
- Authoritative guide for automated changes
- Where conflicts exist, follow CLAUDE.md and update both docs to realign

**CONTRIBUTING.md**:
- Detailed reference for human contributors
- Must stay in sync with CLAUDE.md

**When changing a rule**: Update both docs in the same PR.

### Phase 3.5 Workflow

**Prefer**:
- Refactors that increase clarity and reduce duplication
- Deleting or removing legacy/MIL code
- Enforcing existing standards (i18n, test-py, className, tokens)

**Avoid**:
- Adding new user-facing workflows
- Introducing new runtime concepts (entities, modes) unless required by standards
- Inventing new patterns without updating docs

**When uncertain**: Add a `// QUESTION(eamon):` comment rather than inventing a new pattern.

### Change Size & Validation

**Keep changes small and atomic**:
- One standards-change per PR (e.g., "De-militarize tokens" or "Standardize test-py in left drawer")
- Break large refactors into mechanical commits (rename/move) and logical commits (behavior changes)

**Always validate before committing**:
- Run `npm run lint` and `npm run build`
- Check i18n, test-py, className, token usage per checklists
- Ensure no MIL references remain

---

## Performance & Optimization

**Golden Rule**: **Measure first, then optimize.** Document what you observed before making structural changes.

### Big-O Notation Priority

When analyzing or implementing algorithms, prioritize efficiency in this order:

1. **O(1)** – Constant time (ideal for lookups, state updates)
2. **O(log n)** – Logarithmic (spatial indexes, binary search)
3. **O(n)** – Linear (acceptable for entity iteration if n < ~100-500)
4. **O(n log n)** – Linearithmic (sorting, acceptable for occasional operations)
5. **O(n²)** – Quadratic (avoid in hot paths; use spatial indexes instead)

**In render paths**: Avoid O(n²) and higher. Use memoization, spatial indexes (e.g., rbush, quadtree), or Web Workers for heavy computation.

### Efficiency Vectors

**Selector Hygiene**:
- Prefer shallow comparison over broad subscriptions
- Use selector functions that return primitive values or stable references
- Avoid creating new objects/arrays in selectors on every call

**Memoization**:
- Use `React.memo` for heavy subtrees that receive stable props
- Use `useMemo` for derived data computed from props/state
- Use `useCallback` for event handlers passed to memoized children

**List Virtualization**:
- For any list that could grow > ~100 rows (entities, exceptions, incidents), use virtualization
- Libraries: `react-window` or `react-virtual`

**Throttled/Debounced Updates**:
- Throttle rapid telemetry updates (e.g., 16ms = 60 FPS)
- Debounce search input (e.g., 300ms)
- Use `requestAnimationFrame` for camera/animation loops

**Avoid**:
- Storing derivable state (e.g., "selected entity card index" if you already have selected entity ID)
- Inline arrow functions and object literals in hot render paths without memoization
- Naive O(n²) proximity checks in render paths

### Cesium-Specific Optimization Patterns

**Official guidance from Cesium documentation and best practices**:

#### Entity Performance

**Problem**: Too many entities (>1000) causing frame drops

**Solutions**:
1. **Clustering**: Use `EntityCluster` to group nearby entities at distance
   ```tsx
   viewer.scene.globe.enableLighting = false; // Reduce lighting calculations
   dataSource.clustering.enabled = true;
   dataSource.clustering.pixelRange = 50;
   ```

2. **Level of Detail (LOD)**: Show simplified representations at distance
   - Use billboards instead of models when far away
   - Reduce polygon complexity based on camera height

3. **Batching**: Use `PrimitiveCollection` for static geometry instead of individual entities

4. **Culling**: Disable entities outside view frustum
   ```tsx
   entity.show = Cesium.Cartesian3.distance(
     cameraPosition,
     entityPosition
   ) < visibilityThreshold;
   ```

#### Terrain and Imagery

**Problem**: High-resolution terrain causing slow loading/rendering

**Solutions**:
1. **Terrain LOD**: Use `maximumScreenSpaceError` to control detail
   ```tsx
   viewer.scene.globe.maximumScreenSpaceError = 2; // Default is 2, higher = lower detail
   ```

2. **Tile Caching**: Enable browser caching for imagery/terrain tiles
   ```tsx
   const terrainProvider = await Cesium.createWorldTerrainAsync({
     requestWaterMask: false, // Disable if not needed
     requestVertexNormals: false, // Disable if lighting disabled
   });
   ```

3. **Imagery Layers**: Limit number of active layers (≤ 3-4 for best performance)

#### Camera and Animation

**Problem**: Janky camera movement or animation frame drops

**Solutions**:
1. **Use `requestAnimationFrame`**: Never use `setInterval` for camera updates
   ```tsx
   function tick() {
     // Update camera or entities
     requestAnimationFrame(tick);
   }
   requestAnimationFrame(tick);
   ```

2. **Limit Camera Changes**: Throttle camera updates to 60 FPS max
   ```tsx
   viewer.camera.percentageChanged = 0.05; // Reduce change events
   ```

3. **Disable Unnecessary Features**:
   ```tsx
   viewer.scene.globe.enableLighting = false; // Save 10-15% GPU
   viewer.scene.skyAtmosphere.show = false; // If not needed
   viewer.scene.fog.enabled = false; // If not needed
   ```

#### Scene Optimization

**Problem**: Overall scene rendering is slow

**Solutions**:
1. **Disable Post-Processing** (unless required for visuals):
   ```tsx
   viewer.scene.postProcessStages.fxaa.enabled = false;
   viewer.scene.globe.showGroundAtmosphere = false;
   ```

2. **Reduce Shadow Quality** (or disable):
   ```tsx
   viewer.shadows = false; // Significant performance gain
   ```

3. **Use `requestRenderMode`**: Only render when scene changes
   ```tsx
   viewer.scene.requestRenderMode = true;
   viewer.scene.maximumRenderTimeChange = Infinity; // Only render on explicit request
   ```

4. **Framerate Limiting**:
   ```tsx
   viewer.targetFrameRate = 60; // Cap at 60 FPS
   ```

#### Memory Management

**Problem**: Memory leaks or high memory usage

**Solutions**:
1. **Destroy Unused Resources**:
   ```tsx
   dataSource.entities.removeAll(); // Remove all entities
   viewer.dataSources.remove(dataSource); // Remove data source
   primitiveCollection.removeAll(); // Remove primitives
   ```

2. **Reuse Entities**: Update existing entities instead of creating new ones
   ```tsx
   // Good ✅
   entity.position = newPosition;

   // Bad ❌ (creates memory pressure)
   viewer.entities.remove(entity);
   viewer.entities.add({ position: newPosition });
   ```

3. **Texture Atlasing**: Combine multiple small textures into one atlas to reduce draw calls

#### Diagnostic Tools

**Use Cesium's built-in performance tools**:

```tsx
// Show FPS and performance metrics
viewer.scene.debugShowFramesPerSecond = true;

// Show render statistics
viewer.scene.debugShowRenderResolution = true;

// Log render performance
console.log(viewer.scene.renderTimeThreshold);
```

**Chrome DevTools**:
- Performance tab: Record and analyze frame drops
- Memory tab: Check for memory leaks (heap snapshots)
- Rendering tab: Enable "FPS meter" and "Frame rendering stats"

### Performance Budget

**Target**: 60 FPS with 50+ entities on screen

**Acceptable**:
- Entity list render: < 16ms (60 FPS)
- Telemetry update: < 100ms (10 Hz)
- Camera movement: Smooth 60 FPS with no jank
- Map render: < 33ms per frame (30 FPS minimum)

**Measure with**:
- React Profiler (component render times)
- Chrome Performance tab (frame timing)
- Cesium `debugShowFramesPerSecond` (real-time FPS)

### Heavy Computation

**For computationally intensive tasks** (zone evaluation, proximity queries, clustering):

**Prefer**:
1. **Web Worker** – Move work off main thread
2. **Spatial Index** – Use rbush/quadtree for O(log n) queries instead of O(n²) loops
3. **Batch Processing** – Process in chunks with `requestIdleCallback`

**Example**: Proximity calculation
```tsx
// Bad ❌ – O(n²) in render path
entities.forEach(e1 => {
  entities.forEach(e2 => {
    if (distance(e1, e2) < threshold) { /* ... */ }
  });
});

// Good ✅ – O(n log n) with spatial index
const tree = new RBush();
tree.load(entities.map(e => ({ minX: e.x, minY: e.y, maxX: e.x, maxY: e.y, entity: e })));
const nearby = tree.search({ minX: x - r, minY: y - r, maxX: x + r, maxY: y + r });
```

---

## Summary

**FOUNDATIONAL STANDARDS (MANDATORY):**

1. **i18n**: All user-visible strings → `react-intl`
2. **className**: kebab-case, `parent__child`, optional prop
3. **test-py**: Stable test selectors, never className in tests
4. **Design tokens**: OCHA Humanitarian / NASA HFES-300 color standards, SAR operational semantics
5. **Constants**: No magic strings/numbers → named constants
6. **Modality**: Critical = color + motion (≤ 3 Hz) + audio

**See `CONTRIBUTING.md` for detailed examples, DO/DON'T lists, and workflows.**
