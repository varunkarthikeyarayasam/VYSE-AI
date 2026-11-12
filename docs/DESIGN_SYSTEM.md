# VYSE "Obsidian Chrome" Design System
**Version**: 2.0.0  
**Status**: Production Standard  
**Architecture**: Tailwind CSS v4 + React + TypeScript  

---

## 1. Design Philosophy & Aesthetic Tenets

The **Obsidian Chrome** design system replaces standard AI web application tropes (such as generic soft drop shadows, pastel icon squares, and floating purple gradient orbs) with an editorial, high-precision dark aesthetic rooted in brutalist-refined product design.

### Core Visual Tenets
1. **Condensed Typography Hierarchy**: Dramatic scale contrast between heavy, ultra-condensed display headlines (`Anton`, tight line-height `0.9`) and clean technical body typography (`Inter`) paired with tracked monospace metadata labels (`JetBrains Mono`, `letter-spacing: 0.14em`).
2. **Sharp Hairline Geometry**: Razor-sharp panels bounded by 1px hairline borders (`rgba(255, 255, 255, 0.08)` to `0.16`). Cards and panels never use blurry glassmorphic drop shadows for definition; their edges are crisp and architectural.
3. **Strict Radius Scale with Deliberate Pill Contrast**:
   - `4px` (`rounded`): Inputs, list items, inner badges, icon frames.
   - `6px–8px` (`rounded-md` / `rounded-lg`): Action cards, content panels, modal windows.
   - `rounded-full` (`.cta-pill-solid`): **Strictly and exclusively reserved** for primary CTA buttons and tag filter chips to provide high-impact, human-scale focal contrast against the rigid grid.
4. **Desaturated Functional Accents**: Saturated neon indicators are eliminated. Status signifiers use desaturated earth-grade tones: Sage (`#7A8C7A`), Brick (`#B5675C`), and Brass (`#C29B38`).
5. **Restrained Brushed Chrome Highlights**: Gradient fills are limited strictly to the brushed monochrome `--chrome-gradient`, applied selectively in at most 1–2 focal areas per screen.

---

## 2. Palette Token Dictionary

The system natively supports two dark palettes switchable at runtime via the `data-theme` attribute on the root HTML element.

### Variant A: Graphite Chrome (Default)
| Token Name | CSS Variable | Hex / RGBA Value | Role / Usage |
| :--- | :--- | :--- | :--- |
| **Base Background** | `--bg-base` | `#0B0C0E` | Main page viewport background |
| **Surface Background** | `--bg-surface` | `#16181B` | Card backgrounds, panel fills, modals |
| **Elevated Surface** | `--bg-elevated` | `#1F2226` | Hover states, active tabs, nested blocks |
| **Text Bright** | `--text-bright` | `#F5F5F7` | Primary headlines, active numbers, high contrast |
| **Text Primary** | `--text-primary` | `#E6E7E8` | General body copy, readable prose |
| **Text Secondary** | `--text-secondary` | `#A0A4A8` | Subheadings, descriptions, secondary stats |
| **Text Muted** | `--text-muted` | `#6E7377` | Timestamps, metadata keys, inactive labels |
| **Hairline Border** | `--border-hairline` | `rgba(255, 255, 255, 0.08)` | Default panel and card boundaries |
| **Hairline Strong** | `--border-hairline-strong` | `rgba(255, 255, 255, 0.16)` | Active borders, focused inputs, hovered cards |
| **Chrome Gradient** | `--chrome-gradient` | `linear-gradient(135deg, #FFFFFF 0%, #A0A4A8 50%, #4E5256 100%)` | Accent headlines & editorial banner panels |

### Variant B: Navy Chrome (Alternate)
| Token Name | CSS Variable | Hex / RGBA Value | Role / Usage |
| :--- | :--- | :--- | :--- |
| **Base Background** | `--bg-base` | `#090B10` | Deep midnight navy page viewport background |
| **Surface Background** | `--bg-surface` | `#12151C` | Card backgrounds, slate-navy panels |
| **Elevated Surface** | `--bg-elevated` | `#1A1E28` | Hover states, interactive highlights |
| **Text Bright** | `--text-bright` | `#F2F4F8` | Primary headlines and high-contrast numbers |
| **Text Primary** | `--text-primary` | `#E2E5EB` | General body copy |
| **Text Secondary** | `--text-secondary` | `#9BA3B0` | Subheadings and descriptions |
| **Text Muted** | `--text-muted` | `#667080` | Timestamps and metadata |
| **Hairline Border** | `--border-hairline` | `rgba(255, 255, 255, 0.08)` | Default boundaries |
| **Hairline Strong** | `--border-hairline-strong` | `rgba(255, 255, 255, 0.16)` | Active and hover boundaries |
| **Chrome Gradient** | `--chrome-gradient` | `linear-gradient(135deg, #FFFFFF 0%, #9BA3B0 50%, #4B5565 100%)` | Accent headlines & banner panels |

### Functional Status Tokens
| Functional State | Color Name | Hex Token | Subdued Fill | Hairline Ring |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Qualified** | Sage | `#7A8C7A` | `rgba(122, 140, 122, 0.10)` | `rgba(122, 140, 122, 0.30)` |
| **Warning / Notice** | Brass | `#C29B38` | `rgba(194, 155, 56, 0.10)` | `rgba(194, 155, 56, 0.30)` |
| **Error / Deficit** | Brick | `#B5675C` | `rgba(181, 103, 92, 0.10)` | `rgba(181, 103, 92, 0.30)` |

---

## 3. Typography Hierarchy

| Level | Font Family | Size / Line Height | Tracking | Transform | Utility Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | `Anton, sans-serif` | `3rem - 4.5rem` / `0.9` | `-0.02em` | Uppercase | `.font-display` |
| **Section Header** | `Anton, sans-serif` | `1.75rem - 2.25rem` / `0.95` | `-0.01em` | Uppercase | `.font-display` |
| **Eyebrow Label** | `JetBrains Mono, monospace` | `0.6875rem - 0.75rem` | `0.14em - 0.18em` | Uppercase | `.eyebrow-label` |
| **Body Primary** | `Inter, sans-serif` | `0.875rem - 0.9375rem` / `1.6` | Normal | None | `text-[var(--text-primary)]` |
| **Body Secondary** | `Inter, sans-serif` | `0.75rem - 0.8125rem` / `1.5` | Normal | None | `text-[var(--text-secondary)]` |
| **Code / Metrics** | `JetBrains Mono, monospace` | `0.75rem - 1.25rem` | `-0.01em` | Normal | `font-mono` |

---

## 4. Radius Hierarchy & The Full-Pill Exception Rule

```
┌─────────────────────────────────────────────────────────────┐
│ 8px (rounded-lg) / 6px (rounded-md)                         │
│ Obsidian Panel / Modal Frame                                │
│                                                             │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ 4px (rounded)                                         │ │
│   │ Inner List Row / Input Box / Metric Slot              │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ (           rounded-full / .cta-pill-solid          ) │ │
│   │ Primary Action Trigger Button (Deliberate Contrast)   │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- **Rule 1**: No content card, feature panel, or modal may use `rounded-2xl` or `rounded-3xl`.
- **Rule 2**: `rounded-full` is strictly permitted on:
  1. Primary call-to-action buttons (`.cta-pill-solid` or `.pill-cta`).
  2. Filter category chips and search topic pills.
  3. Circular live status indicator dots (2px–3.5px).

---

## 5. Reusable Component Primitives

### Button Primitive (`src/components/ui/index.tsx`)
```tsx
// Primary Pill CTA
<Button variant="glow" size="md">Launch Query</Button>
// Renders: rounded-full bg-[var(--text-bright)] text-[var(--bg-base)] font-bold

// Hairline Outline Secondary
<Button variant="outline" size="sm">Inspect Logs</Button>
// Renders: rounded border-hairline bg-[var(--bg-surface)] text-[var(--text-bright)]
```

### Card Primitive (`src/components/ui/index.tsx`)
```tsx
<Card variant="sharp" hoverable>
  <SectionLabel number="01" text="Autonomous Routing" />
  <h4 className="text-sm font-bold text-[var(--text-bright)]">Engine Status</h4>
  <p className="text-xs text-[var(--text-secondary)]">Zero round-trip latency overhead.</p>
</Card>
```

### Badge Primitive (`src/components/ui/index.tsx`)
```tsx
// Monochrome Minimal
<Badge variant="glow">OPERATIONAL</Badge>

// Desaturated Status Accents
<Badge variant="success">ELIGIBLE</Badge>
<Badge variant="warning">NOTICE</Badge>
<Badge variant="danger">DEFICIT</Badge>
```

---

## 6. The 8 Editorial Layout Patterns

### Pattern 1: Asymmetric Editorial Hero
- **Left**: Large condensed display title (`Anton`, `text-4xl sm:text-6xl`, tracking `-0.02em`).
- **Right**: Live telemetry window with hairline borders displaying micro status readouts.
- **Under**: Wide-tracked mono eyebrow with a live pulsing status indicator.

### Pattern 2: Live Telemetry Window
- **Structure**: Compact hairline card displaying real-time engine telemetry (e.g., Latency `12ms`, RPC throughput `99.9%`, Sync state `Active`).
- **Typography**: Mono numerical readouts in `var(--text-bright)`.

### Pattern 3: Stat Strip
- **Structure**: 4-column hairline grid.
- **Content**: Large condensed metric values (e.g., `88.5%`, `02`, `14`, `100%`) paired with 11px uppercase tracked mono labels.

### Pattern 4: 6-Card Action Grid
- **Structure**: 2-column or 3-column sharp hairline cards (`rounded-md border-hairline bg-[var(--bg-surface)]`).
- **Header**: Numerical index badge (`01`, `02`, `03`...) in monospace.
- **Interaction**: Subtle border illumination to `var(--border-hairline-strong)` and icon slide on hover.

### Pattern 5: Two-Column Capability List
- **Left Column**: Section label + Anton headline explaining the architectural layer.
- **Right Column**: Hairline-divided list with feature titles, descriptions, and monospace technical tags.

### Pattern 6: Process Timeline
- **Structure**: Sequential vertical or horizontal nodes (`01 INGEST`, `02 VERIFY`, `03 EXECUTE`).
- **Connector**: Hairline rule (`border-hairline`).
- **Indicators**: Desaturated state pills showing deterministic status.

### Pattern 7: Tag Grid
- **Structure**: Flex-wrap container with `rounded-full` pill chips (`border-hairline bg-[var(--bg-surface)]`).
- **Hover**: Sharp border illumination and text bright fill.

### Pattern 8: Brushed Chrome Gradient CTA
- **Structure**: Full-width hairline panel with `--chrome-gradient` border and subtle radial backdrop.
- **Content**: Condensed headline + solid off-white pill CTA (`.cta-pill-solid`).

---

## 7. Runtime Palette Management

The system exports runtime theme utilities in [`src/lib/theme.ts`](file:///c:/Users/Laukik/Shadown_Coders/src/lib/theme.ts):

```typescript
import { getCurrentTheme, setTheme, toggleTheme } from "@/lib/theme";

// Get active theme ('graphite' | 'navy')
const activeTheme = getCurrentTheme();

// Switch theme
setTheme("navy");

// Toggle between Graphite Chrome and Navy Chrome
const newTheme = toggleTheme();
```

---

## 8. Anti-Patterns & QA Verification Checklist

Before shipping any new view or component, verify the following:

- [x] **Zero Rounded-2xl / Rounded-3xl**: All cards and panels use `rounded-md` (6px) or `rounded-lg` (8px).
- [x] **Zero AI Slop Orbs**: No floating pink/purple/cyan blurred glow orbs behind content.
- [x] **Zero Rainbow Gradients**: Gradient text is restricted strictly to `--chrome-gradient`.
- [x] **Zero Pastel Square Tiles**: No rounded colored squares wrapping icons.
- [x] **Pill Rule Enforced**: `rounded-full` is used exclusively for primary action triggers and filter chips.
- [x] **Hairline Precision**: All borders use `border-hairline` (`rgba(255, 255, 255, 0.08)`) or `border-hairline-strong` (`rgba(255, 255, 255, 0.16)`).
- [x] **Desaturated Status**: Red/amber/green indicators use Brick (`#B5675C`), Brass (`#C29B38`), and Sage (`#7A8C7A`).
- [x] **Brand Mark Fidelity**: Standardized on precision Apple squircle `<VyseLogo />` with monoline V-core and optical center point across headers, avatars, drawers, and modal shells.

---

## 9. Brand Mark Specification (`VyseLogo`)

The official VYSE brand mark is an Apple-continuous squircle mark defined in [`src/components/ui/VyseLogo.tsx`](file:///c:/Users/Laukik/Shadown_Coders/src/components/ui/VyseLogo.tsx) and static vector [`public/vyse-logo.svg`](file:///c:/Users/Laukik/Shadown_Coders/public/vyse-logo.svg):

```tsx
import { VyseLogo } from "@/components/ui/VyseLogo";

// Header / Navigation brand display
<VyseLogo size={36} showText={true} />

// Icon / Monogram replacement in modals, avatars, and buttons
<VyseLogo size={28} showText={false} />
```

- **Squircle Container**: `viewBox="0 0 48 48"`, continuous curvature `rx="14"`, solid onyx base `#060608`.
- **Inner Stroke**: Inset 0.75px, stroke `rgba(255, 255, 255, 0.08)` to `0.10`, width 1.5px.
- **Monoline V-Core**: Geometric vertex `M15.5 17.5L24 31L32.5 17.5`, stroke `#FFFFFF`, width 2.25px, round cap & join.
- **Optical Center Point**: Precise focus circle `cx="24" cy="21.5" r="1.5"` with 85% opacity.
