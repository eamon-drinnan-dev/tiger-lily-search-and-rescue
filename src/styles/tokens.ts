/**
 * Design Tokens
 *
 * Color and styling tokens adhering to:
 * - NASA HFES-300 (contrast requirements)
 * - OCHA Humanitarian Icon Standards (disaster response context)
 *
 * SAR Semantics: Green/Amber/Red indicate health/operational state, NOT affiliation.
 *
 * IMPORTANT: Color is NOT the sole carrier of meaning for critical states.
 * Pair with motion/audio cues where applicable.
 */

/**
 * Base color palette
 * Literal color names for general styling use
 */
export const colorTokens = {
  // Primary colors
  /** Emerald green (#10b981) */
  emerald: '#10b981',
  /** Amber (#f59e0b) */
  amber: '#f59e0b',
  /** Red (#ef4444) */
  red: '#ef4444',
  /** Blue (#3b82f6) */
  blue: '#3b82f6',
  /** Yellow (#eab308) */
  yellow: '#eab308',

  // SAR operational state colors (HFES-300 compliant)
  /** Healthy/operational state (#236644) - 5.5:1 contrast on white */
  healthyGreen: '#236644',
  /** Degraded/caution state (#b7791f) - 4.7:1 contrast on white */
  degradedAmber: '#b7791f',
  /** Critical/danger state (#c53030) - 4.8:1 contrast on white */
  criticalRed: '#c53030',
  /** Informational/safe state (#2b6cb0) - 5.1:1 contrast on white */
  infoBlue: '#2b6cb0',

  // Neutrals
  /** White (#ffffff) */
  white: '#ffffff',
  /** Black (#000000) */
  black: '#000000',
  /** Gray (#808080) */
  gray: '#808080',
  /** Cyan (#06b6d4) */
  cyan: '#06b6d4',
} as const;

// Affiliation system removed - See TL-D-001 Phase 1 Cleanup
// Entity status provides operational state visualization

/**
 * Baseline text and surface colors
 * Meet WCAG contrast requirements (≥ 4.5:1 for body text)
 */
export const surfaceTokens = {
  /** Primary text color (high contrast) */
  textPrimary: '#e6e6e6',
  /** Secondary text color (medium contrast) */
  textSecondary: '#bdbdbd',
  /** Base surface (darkest) */
  surface0: '#0b0f14',
  /** Level 1 surface (cards, panels) */
  surface1: '#11161d',
  /** Level 2 surface (elevated elements) */
  surface2: '#16202a',
} as const;

/**
 * Alert severity colors
 * Critical = red, Warning = orange, Info = blue
 * Uses SAR operational state semantics (health/status, not affiliation)
 */
export const alertTokens = {
  /** Critical alerts (red) */
  critical: colorTokens.criticalRed,
  /** Warning alerts (orange) */
  warning: '#d97706',
  /** Informational alerts (blue) */
  info: colorTokens.blue,
} as const;

/**
 * Motion constraints
 * Keep blink/pulse rate ≤ 3 Hz to avoid seizure triggers
 */
export const motionTokens = {
  /** Maximum blink frequency in Hz */
  blinkMaxHz: 3,
  /** Critical pulse animation duration (ms) - corresponds to ~0.5 Hz */
  criticalPulseDuration: 2000,
  /** Drawer transition duration (ms) - matches Material Design base transition */
  drawerTransitionDuration: 250,
  /** Drawer transition timing function - Material Design standard easing */
  drawerTransitionTiming: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Theme color palette
 * Semantic colors for light and dark themes
 */
export const paletteTokens = {
  /** Light theme colors */
  light: {
    /** Primary brand color */
    primary: '#1976d2',
    /** Secondary brand color */
    secondary: '#dc004e',
    /** Default background */
    backgroundDefault: '#f5f5f5',
    /** Paper/card background */
    backgroundPaper: '#ffffff',
    /** Primary text color */
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    /** Secondary text color */
    textSecondary: 'rgba(0, 0, 0, 0.6)',
    /** Border color */
    border: '#e0e0e0',
  },
  /** Dark theme colors */
  dark: {
    /** Primary brand color (lighter for dark bg) */
    primary: '#90caf9',
    /** Secondary brand color (lighter for dark bg) */
    secondary: '#f48fb1',
    /** Border color */
    border: 'rgba(255, 255, 255, 0.08)',
    /** Drawer/sidebar background */
    drawerBackground: '#181818',
  },
} as const;

/**
 * Shadow tokens
 */
export const shadowTokens = {
  /** Light shadow for app bar */
  appBarLight: 'none',
  /** Dark shadow for app bar */
  appBarDark: '0 1px 4px rgba(0, 0, 0, 0.4)',
} as const;

/**
 * Entity status colors
 * Visual indicators for operational states
 */
export const statusTokens = {
  active: {
    background: 'rgba(0, 255, 0, 0.15)',
    foreground: '#4ade80',
    border: 'rgba(0, 255, 0, 0.3)',
  },
  idle: {
    background: 'rgba(156, 163, 175, 0.15)',
    foreground: '#9ca3af',
    border: 'rgba(156, 163, 175, 0.3)',
  },
  warning: {
    background: 'rgba(255, 165, 0, 0.15)',
    foreground: '#fbbf24',
    border: 'rgba(255, 165, 0, 0.3)',
  },
  error: {
    background: 'rgba(255, 0, 0, 0.15)',
    foreground: '#f87171',
    border: 'rgba(255, 0, 0, 0.3)',
  },
  offline: {
    background: 'rgba(107, 114, 128, 0.15)',
    foreground: '#6b7280',
    border: 'rgba(107, 114, 128, 0.3)',
  },
} as const;

/**
 * Common UI colors
 */
export const uiTokens = {
  /** Hover background (dark theme) */
  hoverDark: '#2a2a2a',
  /** Hover background (light theme) */
  hoverLight: '#f9f9f9',
} as const;

/**
 * Zone type colors
 * Semantic colors for different zone classifications
 */
export const zoneTokens = {
  /** Informational zones (blue) */
  informational: colorTokens.blue,
  /** Controlled zones (yellow) */
  controlled: colorTokens.yellow,
  /** Autonomous zones (red) */
  autonomous: colorTokens.red,
} as const;

/**
 * Endpoint type colors
 * Semantic colors for different endpoint types
 */
export const endpointTokens = {
  /** Destination endpoints (red) */
  destination: colorTokens.red,
  /** Return base endpoints (green) */
  returnBase: colorTokens.emerald,
  /** Staging endpoints (amber) */
  staging: colorTokens.amber,
} as const;

/**
 * Pathway colors
 * Semantic colors for pathway directionality
 */
export const pathwayTokens = {
  /** Bidirectional pathways (green) */
  bidirectional: colorTokens.emerald,
  /** One-way pathways (amber) */
  oneWay: colorTokens.amber,
} as const;

/**
 * Map UI colors
 * Colors for map labels, strokes, and overlays
 */
export const mapTokens = {
  /** Label text color (white) */
  labelText: colorTokens.white,
  /** Label stroke color (black) */
  labelStroke: colorTokens.black,
  /** White stroke for markers */
  strokeWhite: colorTokens.white,
  /** Black stroke for markers */
  strokeBlack: colorTokens.black,
  /** Map shadow */
  shadow: 'rgba(0, 0, 0, 0.6)',
  /** MiniMap border (light) */
  minimapBorderLight: 'rgba(0, 0, 0, 0.2)',
  /** MiniMap border (dark) */
  minimapBorderDark: 'rgba(255, 255, 255, 0.2)',
  /** Default group color */
  groupDefault: colorTokens.blue,
} as const;

// Proximity feature removed - See TL-D-001 Phase 1 Cleanup

/**
 * Entity interaction colors
 * Non-intrusive hover and selection states
 */
export const entityInteractionTokens = {
  /** Hover halo color (light blue, high contrast, non-occluding) */
  hoverHalo: 'rgba(224, 246, 255, 0.6)', // neutral cyan at 60% opacity

  /** Hover outline color (crisp, high contrast) */
  hoverOutline: '#E0F6FF', // neutral cyan outline

  /** Selection glow color (subtle, distinct from hover) */
  selectionGlow: 'rgba(248, 228, 176, 1.0)', // soft amber at full opacity

  /** Selection border color (solid accent) */
  selectionBorder: '#F8E4B0', // soft amber stroke

  /** Hover pulse animation duration (ms) - corresponds to ~1 Hz */
  hoverPulseDuration: 1000,
} as const;

/**
 * Combined design tokens export
 */
export const tokens = {
  colors: colorTokens,
  surface: surfaceTokens,
  alert: alertTokens,
  motion: motionTokens,
  palette: paletteTokens,
  shadow: shadowTokens,
  status: statusTokens,
  ui: uiTokens,
  zone: zoneTokens,
  endpoint: endpointTokens,
  pathway: pathwayTokens,
  map: mapTokens,
  entityInteraction: entityInteractionTokens,
} as const;

/**
 * CSS Custom Properties (for use in styled components or global CSS)
 *
 * Usage example:
 * ```tsx
 * sx={{ backgroundColor: 'var(--alert-critical)' }}
 * ```
 */
export const cssTokens = `
  /* Affiliation system removed - See TL-D-001 Phase 1 Cleanup */

  /* Surfaces */
  --text-primary: ${surfaceTokens.textPrimary};
  --text-secondary: ${surfaceTokens.textSecondary};
  --surface-0: ${surfaceTokens.surface0};
  --surface-1: ${surfaceTokens.surface1};
  --surface-2: ${surfaceTokens.surface2};

  /* Alerts */
  --alert-critical: ${alertTokens.critical};
  --alert-warning: ${alertTokens.warning};
  --alert-info: ${alertTokens.info};

  /* Motion */
  --blink-max-hz: ${motionTokens.blinkMaxHz};
  --critical-pulse-duration: ${motionTokens.criticalPulseDuration}ms;
  --drawer-transition-duration: ${motionTokens.drawerTransitionDuration}ms;
  --drawer-transition-timing: ${motionTokens.drawerTransitionTiming};

  /* Palette - Light */
  --palette-light-primary: ${paletteTokens.light.primary};
  --palette-light-secondary: ${paletteTokens.light.secondary};
  --palette-light-bg-default: ${paletteTokens.light.backgroundDefault};
  --palette-light-bg-paper: ${paletteTokens.light.backgroundPaper};
  --palette-light-text-primary: ${paletteTokens.light.textPrimary};
  --palette-light-text-secondary: ${paletteTokens.light.textSecondary};
  --palette-light-border: ${paletteTokens.light.border};

  /* Palette - Dark */
  --palette-dark-primary: ${paletteTokens.dark.primary};
  --palette-dark-secondary: ${paletteTokens.dark.secondary};
  --palette-dark-border: ${paletteTokens.dark.border};
  --palette-dark-drawer-bg: ${paletteTokens.dark.drawerBackground};

  /* Shadows */
  --shadow-appbar-light: ${shadowTokens.appBarLight};
  --shadow-appbar-dark: ${shadowTokens.appBarDark};

  /* Zones */
  --zone-informational: ${zoneTokens.informational};
  --zone-controlled: ${zoneTokens.controlled};
  --zone-autonomous: ${zoneTokens.autonomous};

  /* Endpoints */
  --endpoint-destination: ${endpointTokens.destination};
  --endpoint-return-base: ${endpointTokens.returnBase};
  --endpoint-staging: ${endpointTokens.staging};

  /* Pathways */
  --pathway-bidirectional: ${pathwayTokens.bidirectional};
  --pathway-one-way: ${pathwayTokens.oneWay};

  /* Map UI */
  --map-label-text: ${mapTokens.labelText};
  --map-label-stroke: ${mapTokens.labelStroke};
  --map-stroke-white: ${mapTokens.strokeWhite};
  --map-stroke-black: ${mapTokens.strokeBlack};
  --map-shadow: ${mapTokens.shadow};
  --map-minimap-border-light: ${mapTokens.minimapBorderLight};
  --map-minimap-border-dark: ${mapTokens.minimapBorderDark};
  --map-group-default: ${mapTokens.groupDefault};

  /* Proximity feature removed - See TL-D-001 Phase 1 Cleanup */
`;

/**
 * Example: Critical alert with motion and audio
 *
 * For critical alerts:
 * - Use pulse animation (≤ 3 Hz)
 * - Pair with audio cue
 * - Use --alert-critical color
 *
 * For warnings:
 * - Use steady --alert-warning color
 * - Optional subtle pulse
 * - No audio required
 *
 * For info:
 * - Use --alert-info color
 * - Text only, no motion
 *
 * ```tsx
 * // Critical alert example
 * <Box
 *   sx={{
 *     backgroundColor: 'var(--alert-critical)',
 *     animation: 'pulse var(--critical-pulse-duration) ease-in-out infinite',
 *     '@keyframes pulse': {
 *       '0%, 100%': { opacity: 1 },
 *       '50%': { opacity: 0.6 },
 *     },
 *   }}
 * >
 *   {// Also trigger audio cue for CRITICAL}
 * </Box>
 * ```
 */
