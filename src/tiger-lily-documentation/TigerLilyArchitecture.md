

# Tiger Lily – Frontend Architecture Layout

This document describes the intended layering and responsibilities for the Tiger Lily SAR frontend.
All naming uses the `tiger-lily-{name}` convention for clarity and future package extraction.

## Architecture Layers (from bottom to top)

0. **`tiger-lily-contracts`** – API contracts/DTOs (shared between frontend & backend)
0. **`tiger-lily-types`** – TypeScript type definitions (frontend-only type utilities)
1. **`tiger-lily-mock-backend`** – In-memory data & CRUD (DB simulator)
2. **`tiger-lily-api-bridge`** – API client that talks to backend (mock now, FastAPI later)
3. **`tiger-lily-domain`** – State, selectors, controllers (no React)
4. **`tiger-lily-features-layer`** – React containers/wrappers (smart components)
5. **`tiger-lily-component-library`** – Pure, dumb UI components

**Dependency Flow:**
```
Layer 5 (components) → Layer 4 (features) → Layer 3 (domain) → Layer 2 (api-bridge) → Layer 1 (mock-backend) → Layer 0 (contracts/types)
```

**Critical Rule:** Lower layers NEVER import from higher layers. All layers can import from Layer 0 (contracts/types).

The app shell (e.g. `TigerLily.tsx`) consumes `tiger-lily-features` and never talks directly to backend or domain internals.

---

## 0. `tiger-lily-contracts` & `tiger-lily-types`

**Goal:** Provide shared contracts and type definitions that all layers can safely import.

**Responsibilities:**

- **`tiger-lily-contracts`**: API contracts, DTOs, and data structures shared between frontend and backend
  - Entity interfaces (`Zone`, `Drone`, `K9Unit`, etc.)
  - API request/response shapes
  - Enums and constants
- **`tiger-lily-types`**: Frontend-specific TypeScript utilities
  - Utility types (`Nullable<T>`, `DeepPartial<T>`, etc.)
  - Type guards and validators
  - Generic helpers

**Example:**

```tsx
// tiger-lily-contracts/zones.ts
export type ZoneType = 'search_area' | 'scent_zone' | 'hazard' | 'staging';

export interface LatLon {
  lat: number;
  lon: number;
}

export interface Polygon {
  vertices: LatLon[];
}

export interface Zone {
  id: string; // uuid
  kind: 'zone';
  label: string;
  zoneType: ZoneType;
  geometry: Polygon;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}
```

**Why separate layers?**
- **Contracts**: Can be shared with backend (Python FastAPI can generate matching Pydantic models)
- **Types**: Frontend-only utilities that don't need backend awareness

---

## 1. `tiger-lily-mock-backend`

**Goal:** Simulate a backend/DB with in-memory data while keeping the interface similar to a future real backend.

**Responsibilities:**

- Holds in-memory "tables" (objects/arrays) for:
  - `drones`
  - `k9_units`
  - `responders`
  - `incidents`
  - `zones`
- Exposes async CRUD-like functions for each entity
- Returns data in JSON-serializable format (objects/arrays, not Maps/Sets)
- No React, no Zustand, no UI concepts

**Dependencies:** `tiger-lily-contracts` only

**Example:**

```tsx
// tiger-lily-mock-backend/zonesTable.ts
import { v4 as uuid } from 'uuid';
import { Zone } from '@/tiger-lily-contracts/zones';

// ✅ Use objects (mirrors real JSON responses from backend)
const zonesTable: Record<string, Zone> = {};

// Seed data
const initialZone: Zone = {
  id: uuid(),
  kind: 'zone',
  label: 'Initial Search Area',
  zoneType: 'search_area',
  geometry: {
    vertices: [
      { lat: 43.45, lon: -80.49 },
      { lat: 43.46, lon: -80.49 },
      { lat: 43.46, lon: -80.48 },
      { lat: 43.45, lon: -80.48 },
    ],
  },
  active: true,
  createdAt: new Date().toISOString(),
};
zonesTable[initialZone.id] = initialZone;

export async function listZones(): Promise<Zone[]> {
  await delay(30);
  return Object.values(zonesTable);
}

export async function getZone(id: string): Promise<Zone | undefined> {
  await delay(20);
  return zonesTable[id];
}

export async function updateZone(
  id: string,
  patch: Partial<Zone>
): Promise<Zone | undefined> {
  await delay(50);
  const existing = zonesTable[id];
  if (!existing) return undefined;

  const updated: Zone = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  zonesTable[id] = updated;
  return updated;
}

export async function createZone(zone: Omit<Zone, 'id' | 'createdAt'>): Promise<Zone> {
  await delay(50);
  const newZone: Zone = {
    ...zone,
    id: uuid(),
    createdAt: new Date().toISOString(),
  };
  zonesTable[newZone.id] = newZone;
  return newZone;
}

export async function deleteZone(id: string): Promise<boolean> {
  await delay(50);
  if (!zonesTable[id]) return false;
  delete zonesTable[id];
  return true;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

**Note:** Using objects instead of Maps ensures:
- Easy debugging (`console.log(zonesTable)` works)
- JSON serialization compatibility
- Mirrors real backend JSON responses

---

## 2. `tiger-lily-api-bridge`

**Goal:** Provide a clean, typed API client that the frontend uses to talk to "the backend" (mock now, real HTTP later).

**Responsibilities:**

- Abstracts *where* data comes from (mock backend vs. real FastAPI)
- Exposes a small, stable surface (CRUD + subscriptions)
- Handles transport layer (HTTP, WebSocket, SSE)
- No Zustand, no React, no selectors

**Dependencies:** `tiger-lily-contracts`, `tiger-lily-mock-backend` (for now)

**Example:**

```tsx
// tiger-lily-api-bridge/api.ts
import * as zonesBackend from '@/tiger-lily-mock-backend/zonesTable';
import { Zone } from '@/tiger-lily-contracts/zones';

export const api = {
  zones: {
    list(): Promise<Zone[]> {
      return zonesBackend.listZones();
    },
    get(id: string): Promise<Zone | undefined> {
      return zonesBackend.getZone(id);
    },
    create(zone: Omit<Zone, 'id' | 'createdAt'>): Promise<Zone> {
      return zonesBackend.createZone(zone);
    },
    update(id: string, patch: Partial<Zone>): Promise<Zone | undefined> {
      return zonesBackend.updateZone(id, patch);
    },
    delete(id: string): Promise<boolean> {
      return zonesBackend.deleteZone(id);
    },

    // Real-time subscription (placeholder for future WebSocket/SSE)
    subscribe(callback: (event: ZoneEvent) => void): () => void {
      // TODO: When backend supports WebSocket/SSE, replace with real subscription
      // For now, return no-op unsubscribe function
      return () => {};
    },
  },
  // drones, k9, responders, incidents...
};

// Event types for real-time updates
export type ZoneEvent =
  | { type: 'zone.created'; data: Zone }
  | { type: 'zone.updated'; data: Zone }
  | { type: 'zone.deleted'; data: { id: string } };
```

**Migration Path:**

When switching to a real FastAPI backend, replace the implementation:

```tsx
// tiger-lily-api-bridge/api.ts (with real backend)
import { Zone } from '@/tiger-lily-contracts/zones';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  zones: {
    async list(): Promise<Zone[]> {
      const response = await fetch(`${API_BASE_URL}/api/zones`);
      if (!response.ok) throw new Error('Failed to fetch zones');
      return response.json();
    },
    async update(id: string, patch: Partial<Zone>): Promise<Zone | undefined> {
      const response = await fetch(`${API_BASE_URL}/api/zones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!response.ok) return undefined;
      return response.json();
    },

    subscribe(callback: (event: ZoneEvent) => void): () => void {
      const ws = new WebSocket(`${API_BASE_URL}/ws/zones`);
      ws.onmessage = (msg) => callback(JSON.parse(msg.data));
      return () => ws.close();
    },
  },
};
```

**Key Point:** The rest of the app never knows whether it's talking to the mock backend or a real API.

---

## 3. `tiger-lily-domain`

**Goal:** Own all domain state, normalization, selectors, and controllers. No React, no UI, no JSX.

**Responsibilities:**

- Provide:
  - Zustand stores with normalized state
  - Pure selectors
  - Controllers (CRUD + workflow logic), which:
    - Call `tiger-lily-api-bridge`
    - Handle optimistic updates with rollback
    - Manage loading/error states
  - Business rules and validation
- Domain logic lives here, not in components

**Dependencies:** `tiger-lily-contracts`, `tiger-lily-api-bridge`

**Example Store + Selectors:**

```tsx
// tiger-lily-domain/zones/store.ts
import { create } from 'zustand'; // ✅ Zustand v4+ syntax
import { immer } from 'zustand/middleware/immer';
import { Zone } from '@/tiger-lily-contracts/zones';

export interface ZoneState {
  // ✅ Use objects for normalized data (better Zustand compatibility)
  zonesById: Record<string, Zone>;
  allIds: string[]; // Ordered list of zone IDs

  // Loading & error state
  loading: boolean;
  error: string | null;

  // Actions (defined in store for direct access without hooks)
  setZones: (zones: Zone[]) => void;
  setZone: (zone: Zone) => void;
  removeZone: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useZoneStore = create<ZoneState>()(
  immer((set) => ({
    zonesById: {},
    allIds: [],
    loading: false,
    error: null,

    setZones: (zones) =>
      set((state) => {
        state.zonesById = Object.fromEntries(zones.map((z) => [z.id, z]));
        state.allIds = zones.map((z) => z.id);
        state.loading = false;
        state.error = null;
      }),

    setZone: (zone) =>
      set((state) => {
        state.zonesById[zone.id] = zone;
        if (!state.allIds.includes(zone.id)) {
          state.allIds.push(zone.id);
        }
      }),

    removeZone: (id) =>
      set((state) => {
        delete state.zonesById[id];
        state.allIds = state.allIds.filter((zoneId) => zoneId !== id);
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
        state.loading = false;
      }),
  }))
);
```

**Example Selectors:**

```tsx
// tiger-lily-domain/zones/selectors.ts
import { ZoneState } from './store';
import { Zone } from '@/tiger-lily-contracts/zones';

export const selectZoneById =
  (zoneId: string) =>
  (state: ZoneState): Zone | null =>
    state.zonesById[zoneId] ?? null;

export const selectAllZones = (state: ZoneState): Zone[] =>
  state.allIds.map((id) => state.zonesById[id]).filter(Boolean);

export const selectZonesByType =
  (zoneType: string) =>
  (state: ZoneState): Zone[] =>
    selectAllZones(state).filter((z) => z.zoneType === zoneType);

export const selectActiveZones = (state: ZoneState): Zone[] =>
  selectAllZones(state).filter((z) => z.active);
```

**Example Controller (with error handling and rollback):**

```tsx
// tiger-lily-domain/zones/controller.ts
import { api } from '@/tiger-lily-api-bridge/api';
import { useZoneStore } from './store';
import { Zone } from '@/tiger-lily-contracts/zones';

export const zonesController = {
  /**
   * Bootstrap zones from backend
   */
  async bootstrapZones() {
    const { setLoading, setError, setZones } = useZoneStore.getState();

    setLoading(true);
    setError(null);

    try {
      const zones = await api.zones.list();
      setZones(zones);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load zones';
      setError(message);
      console.error('[zonesController] bootstrapZones failed:', error);
    }
  },

  /**
   * Update zone with optimistic update and rollback on failure
   */
  async updateZone(zoneId: string, patch: Partial<Zone>) {
    const { zonesById, setZone, setError } = useZoneStore.getState();
    const originalZone = zonesById[zoneId];

    if (!originalZone) {
      setError(`Zone ${zoneId} not found`);
      return;
    }

    // Optimistic update
    const optimisticZone: Zone = { ...originalZone, ...patch };
    setZone(optimisticZone);

    try {
      // Persist to backend
      const updated = await api.zones.update(zoneId, patch);

      if (!updated) {
        throw new Error('Backend returned empty response');
      }

      // Reconcile with backend response (may have server-side changes)
      setZone(updated);
      setError(null);
    } catch (error) {
      // Rollback to original state on failure
      setZone(originalZone);

      const message = error instanceof Error ? error.message : 'Failed to update zone';
      setError(message);
      console.error('[zonesController] updateZone failed:', error);

      // Re-throw so caller can handle (e.g., show toast notification)
      throw error;
    }
  },

  /**
   * Create new zone
   */
  async createZone(zone: Omit<Zone, 'id' | 'createdAt'>) {
    const { setZone, setError } = useZoneStore.getState();

    try {
      const newZone = await api.zones.create(zone);
      setZone(newZone);
      setError(null);
      return newZone;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create zone';
      setError(message);
      console.error('[zonesController] createZone failed:', error);
      throw error;
    }
  },

  /**
   * Delete zone
   */
  async deleteZone(zoneId: string) {
    const { zonesById, removeZone, setZone, setError } = useZoneStore.getState();
    const originalZone = zonesById[zoneId];

    if (!originalZone) {
      setError(`Zone ${zoneId} not found`);
      return;
    }

    // Optimistic delete
    removeZone(zoneId);

    try {
      const success = await api.zones.delete(zoneId);

      if (!success) {
        throw new Error('Backend delete failed');
      }

      setError(null);
    } catch (error) {
      // Rollback - restore deleted zone
      setZone(originalZone);

      const message = error instanceof Error ? error.message : 'Failed to delete zone';
      setError(message);
      console.error('[zonesController] deleteZone failed:', error);
      throw error;
    }
  },
};
```

**Key Points:**

- ✅ **Store actions defined in store**: Can be called via `useZoneStore.getState().setZones()` without React hooks
- ✅ **Objects instead of Maps**: Better Zustand reactivity and debugging
- ✅ **Error handling**: All CRUD operations catch errors and update `error` state
- ✅ **Optimistic updates with rollback**: Update UI immediately, rollback on failure
- ✅ **Updated Zustand syntax**: `import { create } from 'zustand'` (v4+)
- ✅ **Normalized state**: `zonesById` object + `allIds` array for ordered access

---

## 4. `tiger-lily-features-layer`

**Goal:** React "smart" components that wire domain state + controllers into UI components.
This is the container/wrapper layer.

**Responsibilities:**

- Use domain selectors and controllers
- Map route/selection state to entity IDs
- Render the appropriate component from `tiger-lily-component-library`
- Handle error boundaries and loading states

**Dependencies:** `tiger-lily-domain`, `tiger-lily-component-library`, `tiger-lily-contracts`

**Example: Zone Editor Wrapper**

```tsx
// tiger-lily-features/zones/ZoneEditorWrapper.tsx
import React, { useCallback } from 'react';
import { useZoneStore } from '@/tiger-lily-domain/zones/store';
import { selectZoneById } from '@/tiger-lily-domain/zones/selectors';
import { zonesController } from '@/tiger-lily-domain/zones/controller';
import { ZoneEditor } from '@/tiger-lily-component-library/zones/ZoneEditor';
import { Zone } from '@/tiger-lily-contracts/zones';

interface ZoneEditorWrapperProps {
  zoneId: string;
}

export function ZoneEditorWrapper({ zoneId }: ZoneEditorWrapperProps) {
  const zone = useZoneStore(selectZoneById(zoneId));
  const error = useZoneStore((state) => state.error);

  const handleChange = useCallback(
    async (patch: Partial<Zone>) => {
      try {
        await zonesController.updateZone(zoneId, patch);
        // Optionally show success notification
      } catch (error) {
        // Error already logged and stored in state by controller
        // Optionally show error toast here
      }
    },
    [zoneId]
  );

  if (!zone) {
    return <div>Zone not found.</div>;
  }

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <ZoneEditor zone={zone} onChange={handleChange} />
    </>
  );
}
```

**Key Points:**
- Wrapper handles async controller calls and error handling
- Wrapper subscribes to both entity data AND error state
- Component library receives clean props (zone + onChange callback)

This component is what the app shell uses in the right drawer when a zone is selected.

---

## 5. `tiger-lily-component-library`

**Goal:** Pure, data-agnostic UI components. No domain imports, no store, no bridge.

**Responsibilities:**

- Only care about:
  - Props (data passed in)
  - Layout and styling
  - Local UI state (input focus, hover, temporary values)
  - Input validation (format, required fields, character limits)
- Can be reused in multiple contexts (Storybook, tests, different features)

**Dependencies:** `tiger-lily-contracts` (for type definitions only), `tiger-lily-types` (optional utility types)

**Design Philosophy:**

Components should define their own prop interfaces but **can leverage** types from `tiger-lily-contracts` to avoid duplication. This keeps components data-agnostic while maintaining type consistency.

**Example: Zone Editor UI**

```tsx
// tiger-lily-component-library/zones/ZoneEditor.tsx
import React, { useState } from 'react';
import { Zone } from '@/tiger-lily-contracts/zones'; // ✅ OK to import contracts for type definitions

interface ZoneEditorProps {
  zone: Zone; // ✅ Using contract type directly
  onChange: (patch: Partial<Zone>) => void;
  className?: string;
}

export function ZoneEditor({ zone, onChange, className }: ZoneEditorProps) {
  const [labelError, setLabelError] = useState<string | null>(null);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;

    // ✅ Input validation happens in component library
    if (newLabel.length > 100) {
      setLabelError('Label must be 100 characters or less');
      return;
    }

    setLabelError(null);
    onChange({ label: newLabel });
  };

  const handleZoneTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ zoneType: e.target.value as Zone['zoneType'] });
  };

  return (
    <div className={`tl-zone-editor ${className || ''}`}>
      <div className="tl-zone-editor__field">
        <label htmlFor="zone-label">Label</label>
        <input
          id="zone-label"
          type="text"
          value={zone.label}
          onChange={handleLabelChange}
          maxLength={100}
          aria-invalid={!!labelError}
        />
        {labelError && <span className="tl-zone-editor__error">{labelError}</span>}
      </div>

      <div className="tl-zone-editor__field">
        <label htmlFor="zone-type">Zone Type</label>
        <select id="zone-type" value={zone.zoneType} onChange={handleZoneTypeChange}>
          <option value="search_area">Search Area</option>
          <option value="scent_zone">Scent Zone</option>
          <option value="hazard">Hazard</option>
          <option value="staging">Staging</option>
        </select>
      </div>

      <div className="tl-zone-editor__field">
        <label>
          <input
            type="checkbox"
            checked={zone.active}
            onChange={(e) => onChange({ active: e.target.checked })}
          />
          Active
        </label>
      </div>
    </div>
  );
}
```

**What This Component Does NOT Know:**

- ❌ Where `zone` came from (Zustand store? API? Local state?)
- ❌ How it's persisted (backend, localStorage, IndexedDB?)
- ❌ What happens after `onChange` is called
- ❌ Whether the app is in editing mode or view mode (determined by parent)
- ❌ Global app state or routing

**What This Component DOES Know:**

- ✅ How to render zone properties in a form
- ✅ Input validation (label length, required fields)
- ✅ Local UI state (error messages, temporary input buffers)
- ✅ Accessibility (labels, ARIA attributes)

**Alternative: Fully Agnostic Prop Interface**

If you want **zero dependency** on contracts (e.g., for npm publishing), define props inline:

```tsx
// tiger-lily-component-library/zones/ZoneEditor.tsx
import React from 'react';

interface ZoneEditorProps {
  zone: {
    id: string;
    label: string;
    zoneType: 'search_area' | 'scent_zone' | 'hazard' | 'staging';
    active: boolean;
  };
  onChange: (patch: Partial<ZoneEditorProps['zone']>) => void;
}

export function ZoneEditor({ zone, onChange }: ZoneEditorProps) {
  // ... same implementation
}
```

**Recommendation:** Use `tiger-lily-contracts` types directly unless publishing as standalone npm package.

---

## 6. App shell usage

At the very top level:

- `TigerLily.tsx` renders:
  - Top bar
  - Left drawer (lists of entities, hooked up via `tiger-lily-features-layer`)
  - Map
  - Right drawer, which might render `ZoneEditorWrapper` when a zone is selected.
This completes the flow:

mock-backend → api-bridge → domain (store/selectors/controllers) → features (wrappers) → component-library (UI).

## Right Drawer Architecture (Tiger Lily SAR)

### Overview
The Right Drawer is a persistent **React component** in the Tiger Lily app layout.  
The app shell **always renders `<RightDrawer />` in the React tree**, but the drawer itself decides whether to output any DOM nodes based on the currently selected entity.

Concretely:

- `<RightDrawer />` is always part of the JSX structure (for predictable layout and lifecycle).
- When no entity is selected, `RightDrawer` returns `null` → **no drawer DOM is rendered**.
- When an entity is selected, `RightDrawer` renders the appropriate inspector/editor.

This keeps the **layout and component structure stable**, while still avoiding unnecessary DOM when the drawer is “empty.”

---

## Layer Responsibilities

### 1. App Shell (`TigerLily.tsx`)

- Declares permanent layout regions: TopBar, LeftDrawer, MapView, RightDrawer.
- Does **not** inspect `selectedEntity` or decide which inspector to render.
- Always includes `<RightDrawer />` in the JSX tree.

**Example:**
```tsx
export function TigerLilyApp() {
  return (
    <AppLayout>
      <TopBar />
      <LeftDrawer />
      <MapView />
      {/* RightDrawer is always part of the React tree */}
      <RightDrawer />
    </AppLayout>
  );
}
```

---

## Error Handling & Validation

Tiger Lily distinguishes between two types of errors:

### 1. API Errors (Network/Backend)

**Where they occur:** Layers 2-3 (`tiger-lily-api-bridge`, `tiger-lily-domain`)

**What they are:**
- Network failures (timeout, connection refused, DNS failure)
- HTTP error responses (404, 500, 503)
- Backend unavailable or unreachable
- Malformed responses from backend

**How to handle:**

```tsx
// Layer 3: tiger-lily-domain/zones/controller.ts
export const zonesController = {
  async bootstrapZones() {
    const { setLoading, setError, setZones } = useZoneStore.getState();

    setLoading(true);
    setError(null);

    try {
      const zones = await api.zones.list(); // ⚠️ May throw network error
      setZones(zones);
    } catch (error) {
      // ✅ Catch API errors and store in state
      const message = error instanceof Error ? error.message : 'Failed to load zones';
      setError(message);
      console.error('[zonesController] API error:', error);

      // Optional: Retry logic
      // Optional: Offline fallback
    }
  },
};
```

**Where to display:**
- Global error banner (for critical failures like bootstrap)
- Toast notifications (for transient failures like single update)
- Inline error messages (for specific entity failures)

### 2. Validation Errors (Business Rules/Input)

**Where they occur:** Layers 3-5 (`tiger-lily-domain`, `tiger-lily-features`, `tiger-lily-component-library`)

**What they are:**
- Input format validation (email, phone, coordinates)
- Business rule violations (duplicate names, overlapping zones)
- Schema constraints (required fields, field length, value ranges)
- Referential integrity (FK violations, orphaned entities)

**How to handle:**

```tsx
// Layer 5: tiger-lily-component-library (input validation)
export function ZoneEditor({ zone, onChange }: ZoneEditorProps) {
  const [labelError, setLabelError] = useState<string | null>(null);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;

    // ✅ Component library validates input format
    if (newLabel.length > 100) {
      setLabelError('Label must be 100 characters or less');
      return; // Don't call onChange if invalid
    }

    setLabelError(null);
    onChange({ label: newLabel });
  };

  return (
    <>
      <input value={zone.label} onChange={handleLabelChange} aria-invalid={!!labelError} />
      {labelError && <span className="error">{labelError}</span>}
    </>
  );
}

// Layer 3: tiger-lily-domain (business rule validation)
export const zonesController = {
  async createZone(zone: Omit<Zone, 'id' | 'createdAt'>) {
    const { zonesById, setZone, setError } = useZoneStore.getState();

    // ✅ Domain layer validates business rules
    const duplicateLabel = Object.values(zonesById).find(
      (z) => z.label.toLowerCase() === zone.label.toLowerCase()
    );

    if (duplicateLabel) {
      const message = `Zone with label "${zone.label}" already exists`;
      setError(message);
      throw new Error(message);
    }

    // Proceed with creation
    const newZone = await api.zones.create(zone);
    setZone(newZone);
    return newZone;
  },
};
```

**Where to display:**
- Inline (next to the invalid field) for input validation
- Form-level error summary for business rule violations
- Blocking modal for critical violations (e.g., "Cannot delete zone with active assets")

### Error Handling Summary

| Error Type | Layer | Example | Handling |
|------------|-------|---------|----------|
| **API/Network** | 2-3 | `fetch()` timeout | Store in domain state, display in toast/banner |
| **Input Validation** | 5 | Label > 100 chars | Local component state, inline error message |
| **Business Rules** | 3 | Duplicate zone name | Throw from controller, catch in feature layer |
| **Schema Violations** | 3-5 | Missing required field | Prevent in UI, validate in domain before API call |

---

## Testing Strategy

Each architectural layer requires different testing approaches:

### Layer 0: `tiger-lily-contracts` & `tiger-lily-types`

**Test type:** Unit tests (minimal)

**What to test:**
- Type guard functions (if any)
- Validator utilities (if any)

**Tools:** Vitest

**Example:**
```tsx
// tiger-lily-contracts/zones.test.ts
import { isZone, isValidZoneType } from './zones';

describe('Zone type guards', () => {
  it('should identify valid zone', () => {
    const zone = { id: '1', kind: 'zone', label: 'Test', /* ... */ };
    expect(isZone(zone)).toBe(true);
  });

  it('should reject invalid zone type', () => {
    expect(isValidZoneType('invalid')).toBe(false);
  });
});
```

### Layer 1: `tiger-lily-mock-backend`

**Test type:** Unit tests

**What to test:**
- CRUD operations return correct data
- Async delays behave correctly
- Edge cases (not found, duplicates)

**Tools:** Vitest

**Example:**
```tsx
// tiger-lily-mock-backend/zonesTable.test.ts
import { listZones, getZone, createZone, updateZone } from './zonesTable';

describe('zonesTable', () => {
  it('should list all zones', async () => {
    const zones = await listZones();
    expect(zones).toBeInstanceOf(Array);
  });

  it('should return undefined for non-existent zone', async () => {
    const zone = await getZone('non-existent-id');
    expect(zone).toBeUndefined();
  });

  it('should create new zone with generated ID', async () => {
    const newZone = await createZone({ label: 'Test Zone', /* ... */ });
    expect(newZone.id).toBeDefined();
    expect(newZone.createdAt).toBeDefined();
  });
});
```

### Layer 2: `tiger-lily-api-bridge`

**Test type:** Integration tests (with mocked backend)

**What to test:**
- API methods call correct backend functions
- API methods return correctly typed data
- Future: HTTP request/response handling

**Tools:** Vitest + module mocking

**Example:**
```tsx
// tiger-lily-api-bridge/api.test.ts
import { vi } from 'vitest';
import { api } from './api';
import * as zonesBackend from '@/tiger-lily-mock-backend/zonesTable';

vi.mock('@/tiger-lily-mock-backend/zonesTable');

describe('api.zones', () => {
  it('should call backend.listZones', async () => {
    const mockZones = [{ id: '1', label: 'Test' }];
    vi.mocked(zonesBackend.listZones).mockResolvedValue(mockZones);

    const zones = await api.zones.list();

    expect(zonesBackend.listZones).toHaveBeenCalled();
    expect(zones).toEqual(mockZones);
  });
});
```

### Layer 3: `tiger-lily-domain`

**Test type:** Unit tests (with mocked API)

**What to test:**
- Selectors return correct derived data
- Controllers update state correctly
- Optimistic updates and rollback work
- Error handling and loading states

**Tools:** Vitest + Zustand testing utilities

**Example:**
```tsx
// tiger-lily-domain/zones/controller.test.ts
import { vi } from 'vitest';
import { useZoneStore } from './store';
import { zonesController } from './controller';
import * as apiModule from '@/tiger-lily-api-bridge/api';

vi.mock('@/tiger-lily-api-bridge/api');

describe('zonesController', () => {
  beforeEach(() => {
    useZoneStore.setState({ zonesById: {}, allIds: [], loading: false, error: null });
  });

  it('should bootstrap zones from API', async () => {
    const mockZones = [{ id: '1', label: 'Zone 1' }];
    vi.mocked(apiModule.api.zones.list).mockResolvedValue(mockZones);

    await zonesController.bootstrapZones();

    const state = useZoneStore.getState();
    expect(state.zonesById['1']).toEqual(mockZones[0]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should rollback optimistic update on API failure', async () => {
    const originalZone = { id: '1', label: 'Original' };
    useZoneStore.setState({ zonesById: { '1': originalZone }, allIds: ['1'] });

    vi.mocked(apiModule.api.zones.update).mockRejectedValue(new Error('API error'));

    await expect(zonesController.updateZone('1', { label: 'Updated' })).rejects.toThrow();

    const state = useZoneStore.getState();
    expect(state.zonesById['1'].label).toBe('Original'); // ✅ Rolled back
  });
});
```

### Layer 4: `tiger-lily-features-layer`

**Test type:** Integration tests (with React Testing Library)

**What to test:**
- Wrapper connects domain state to component props correctly
- User interactions trigger controller calls
- Loading/error states render correctly

**Tools:** Vitest + React Testing Library

**Example:**
```tsx
// tiger-lily-features/zones/ZoneEditorWrapper.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZoneEditorWrapper } from './ZoneEditorWrapper';
import { useZoneStore } from '@/tiger-lily-domain/zones/store';
import { zonesController } from '@/tiger-lily-domain/zones/controller';

vi.mock('@/tiger-lily-domain/zones/controller');

describe('ZoneEditorWrapper', () => {
  it('should render zone editor with zone data', () => {
    useZoneStore.setState({
      zonesById: { '1': { id: '1', label: 'Test Zone', /* ... */ } },
      allIds: ['1'],
    });

    render(<ZoneEditorWrapper zoneId="1" />);

    expect(screen.getByDisplayValue('Test Zone')).toBeInTheDocument();
  });

  it('should call controller.updateZone when user changes label', async () => {
    useZoneStore.setState({
      zonesById: { '1': { id: '1', label: 'Old Label', /* ... */ } },
      allIds: ['1'],
    });

    render(<ZoneEditorWrapper zoneId="1" />);

    const input = screen.getByLabelText('Label');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Label');

    await waitFor(() => {
      expect(zonesController.updateZone).toHaveBeenCalledWith('1', { label: 'New Label' });
    });
  });
});
```

### Layer 5: `tiger-lily-component-library`

**Test type:** Unit tests + Storybook

**What to test:**
- Component renders correctly with different props
- Input validation works
- Local UI state (focus, hover, errors) works
- Accessibility (ARIA labels, keyboard nav)

**Tools:** Vitest + React Testing Library + Storybook

**Example:**
```tsx
// tiger-lily-component-library/zones/ZoneEditor.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZoneEditor } from './ZoneEditor';

describe('ZoneEditor', () => {
  const mockZone = { id: '1', label: 'Test', zoneType: 'search_area', active: true };
  const mockOnChange = vi.fn();

  it('should render zone properties', () => {
    render(<ZoneEditor zone={mockZone} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('search_area')).toBeInTheDocument();
  });

  it('should validate label length', async () => {
    render(<ZoneEditor zone={mockZone} onChange={mockOnChange} />);

    const input = screen.getByLabelText('Label');
    await userEvent.type(input, 'a'.repeat(101)); // Exceeds max length

    expect(screen.getByText(/must be 100 characters or less/i)).toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled(); // ✅ Doesn't propagate invalid input
  });

  it('should call onChange when valid input provided', async () => {
    render(<ZoneEditor zone={mockZone} onChange={mockOnChange} />);

    const input = screen.getByLabelText('Label');
    await userEvent.clear(input);
    await userEvent.type(input, 'Valid Label');

    expect(mockOnChange).toHaveBeenCalledWith({ label: 'Valid Label' });
  });
});
```

**Storybook:**
```tsx
// tiger-lily-component-library/zones/ZoneEditor.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ZoneEditor } from './ZoneEditor';

const meta: Meta<typeof ZoneEditor> = {
  component: ZoneEditor,
  title: 'Zones/ZoneEditor',
};
export default meta;

type Story = StoryObj<typeof ZoneEditor>;

export const Default: Story = {
  args: {
    zone: { id: '1', label: 'Search Area Alpha', zoneType: 'search_area', active: true },
    onChange: (patch) => console.log('onChange:', patch),
  },
};

export const Inactive: Story = {
  args: {
    zone: { id: '2', label: 'Hazard Zone', zoneType: 'hazard', active: false },
    onChange: (patch) => console.log('onChange:', patch),
  },
};
```

### Testing Summary

| Layer | Test Type | Tools | Focus |
|-------|-----------|-------|-------|
| **0. Contracts/Types** | Unit | Vitest | Type guards, validators |
| **1. Mock Backend** | Unit | Vitest | CRUD operations, edge cases |
| **2. API Bridge** | Integration | Vitest + mocks | API method behavior |
| **3. Domain** | Unit | Vitest + Zustand | Selectors, controllers, rollback |
| **4. Features** | Integration | Vitest + RTL | State-to-props, user interactions |
| **5. Components** | Unit + Visual | Vitest + RTL + Storybook | Validation, accessibility, UI states |

---

## Dependency Injection Guidelines

### The Problem

Controllers directly importing `api` makes testing difficult:

```tsx
// ❌ Hard to test - api is hardcoded
import { api } from '@/tiger-lily-api-bridge/api';

export const zonesController = {
  async bootstrapZones() {
    const zones = await api.zones.list(); // How to mock this in tests?
  },
};
```

### Solution Options

Tiger Lily uses **module mocking** for now (simplest), with optional migration to factory pattern if needed.

#### Option A: Module Mocking (Current Approach)

**Keep direct imports, mock at module level in tests.**

**Production code:**
```tsx
// tiger-lily-domain/zones/controller.ts
import { api } from '@/tiger-lily-api-bridge/api';

export const zonesController = {
  async bootstrapZones() {
    const zones = await api.zones.list();
    // ...
  },
};
```

**Test code:**
```tsx
// tiger-lily-domain/zones/controller.test.ts
import { vi } from 'vitest';
import { zonesController } from './controller';
import * as apiModule from '@/tiger-lily-api-bridge/api';

// ✅ Mock the entire module
vi.mock('@/tiger-lily-api-bridge/api', () => ({
  api: {
    zones: {
      list: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('zonesController', () => {
  it('should bootstrap zones', async () => {
    const mockZones = [{ id: '1', label: 'Test' }];
    vi.mocked(apiModule.api.zones.list).mockResolvedValue(mockZones);

    await zonesController.bootstrapZones();

    expect(apiModule.api.zones.list).toHaveBeenCalled();
  });
});
```

**Pros:**
- ✅ Simple production code (no DI boilerplate)
- ✅ Works well for small-to-medium apps
- ✅ Vitest/Jest make module mocking easy

**Cons:**
- ❌ Tests coupled to import structure
- ❌ Can't easily swap implementations at runtime

#### Option B: Factory Pattern (Future Migration)

**Export factory function that accepts optional API override.**

**Production code:**
```tsx
// tiger-lily-domain/zones/controller.ts
import { api as defaultApi } from '@/tiger-lily-api-bridge/api';
import type { Api } from '@/tiger-lily-api-bridge/api';

export function createZonesController(api: Api = defaultApi) {
  return {
    async bootstrapZones() {
      const zones = await api.zones.list();
      // ...
    },
  };
}

// Default export uses real API
export const zonesController = createZonesController();
```

**Test code:**
```tsx
// tiger-lily-domain/zones/controller.test.ts
import { createZonesController } from './controller';

describe('zonesController', () => {
  it('should bootstrap zones', async () => {
    const mockApi = {
      zones: {
        list: vi.fn().mockResolvedValue([{ id: '1', label: 'Test' }]),
      },
    };

    const controller = createZonesController(mockApi);

    await controller.bootstrapZones();

    expect(mockApi.zones.list).toHaveBeenCalled();
  });
});
```

**Pros:**
- ✅ Cleaner test code (no module mocking magic)
- ✅ Easy to swap implementations (mock API, test API, real API)
- ✅ Better for large apps with many controllers

**Cons:**
- ❌ More boilerplate in production code
- ❌ Requires updating all callsites if migrating from direct import

#### Option C: DI Container (Not Recommended)

**Use a full dependency injection framework (e.g., InversifyJS, TSyringe).**

**Not recommended for Tiger Lily because:**
- Overkill for frontend architecture
- Adds complexity and learning curve
- Module mocking or factory pattern is sufficient

### Recommendation

**Tiger Lily uses Option B (factory pattern) for long-term sustainability.**

This approach was chosen because:
- ✅ Tiger Lily is planned as a long-term, complex application
- ✅ Cleaner test code without module mocking magic
- ✅ Runtime API swapping will be needed for dev/staging/prod environments
- ✅ Better foundation for future feature flags and A/B testing
- ✅ Easier to maintain as the codebase grows beyond 10+ controllers

**When to use each option:**
- **Small prototypes/MVPs**: Option A (module mocking)
- **Production apps**: Option B (factory pattern) ← **Tiger Lily uses this**
- **Enterprise/microservices**: Option B or Option C (DI container)

### When Backend is Real (Future)

Dependency injection becomes more important when:

1. **Multiple environments**: Dev API, staging API, prod API
2. **Feature flags**: Use mock API for specific features still in development
3. **Offline mode**: Switch to localStorage/IndexedDB when network unavailable

**Example with factory pattern:**
```tsx
// main.tsx
import { createZonesController } from '@/tiger-lily-domain/zones/controller';
import { api } from '@/tiger-lily-api-bridge/api';
import { mockApi } from '@/tiger-lily-api-bridge/mockApi';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const zonesController = createZonesController(USE_MOCK_API ? mockApi : api);
```

**This is future work.** For now, module mocking is sufficient.

---

## Summary: Complete Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  App Shell (TigerLily.tsx)                                      │
│  - TopBar, LeftDrawer, MapView, RightDrawer                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: tiger-lily-features-layer                             │
│  - ZoneEditorWrapper, DroneListWrapper, etc.                    │
│  - Connects domain state/controllers to component library       │
│  - Handles errors, loading states                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌──────────────────────┐    ┌──────────────────────────────────┐
│  Layer 5:            │    │  Layer 3:                        │
│  component-library   │    │  tiger-lily-domain               │
│  - Pure UI           │    │  - Zustand stores                │
│  - Input validation  │    │  - Selectors                     │
│  - Accessibility     │    │  - Controllers                   │
│  - No domain logic   │    │  - Business rules                │
└──────────────────────┘    └────────────┬─────────────────────┘
                                         │
                                         ▼
                            ┌─────────────────────────────────┐
                            │  Layer 2:                       │
                            │  tiger-lily-api-bridge          │
                            │  - API client (CRUD + subs)     │
                            │  - Abstracts backend transport  │
                            └────────────┬────────────────────┘
                                         │
                                         ▼
                            ┌─────────────────────────────────┐
                            │  Layer 1:                       │
                            │  tiger-lily-mock-backend        │
                            │  - In-memory DB simulator       │
                            │  - CRUD operations              │
                            └────────────┬────────────────────┘
                                         │
                                         ▼
                            ┌─────────────────────────────────┐
                            │  Layer 0:                       │
                            │  tiger-lily-contracts & types   │
                            │  - API contracts/DTOs           │
                            │  - TypeScript utilities         │
                            └─────────────────────────────────┘
```

**Key Principles:**

1. **Unidirectional data flow**: App → Features → Domain → API Bridge → Backend
2. **Separation of concerns**: UI (Layer 5), state (Layer 3), transport (Layer 2)
3. **Type safety**: Shared contracts (Layer 0) prevent type drift
4. **Testability**: Each layer independently testable with mocks
5. **Swappable backend**: Mock backend (now) → FastAPI (later) without app changes
6. **Error resilience**: Optimistic updates + rollback, API error handling
7. **Validation at boundaries**: Input validation (UI), business rules (domain), API errors (bridge/domain)

This architecture scales from prototype to production while maintaining clarity, testability, and developer experience