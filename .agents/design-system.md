# Gym Tracker Design System

This document is the visual source of truth for the Gym Tracker project. Every component and feature must adhere to these tokens and patterns to maintain a premium, state-of-the-art aesthetic.

## 1. Color Palette

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `bg` | `#0A0A0A` | Deepest background for the entire app. |
| `surface` | `#141414` | Secondary layers, input backgrounds. |
| `surface-hover`| `#1E1E1E` | Hover states for surface elements. |
| `card` | `#1C1C1C` | Grouping elements, list items. |
| `accent` | `#FF6B35` | Vibrant orange for highlights and active icons. |
| `gold` | `#C4A35A` | PRs, achievements, premium features. |
| `foreground` | `#E8E8E8` | Primary text. |
| `subtle` | `#888888` | Secondary text, descriptions. |
| `muted` | `#555555` | Disabled states, hint text. |
| `border` | `#2A2A2A` | Standard divider and border color. |
| `assisted` | `#4ECDC4` | Assisted exercise indicator (Teal). |

## 2. Typography

We use a "High-Contrast & Aggressive" typographic style for headers and actions.

- **Display Font**: `Oswald` (via `font-display`)
- **Mono Font**: `IBM Plex Mono` (via `font-mono`)
- **Body Font**: `Inter` (via `font-body`)

### The "Premium" Header Pattern (`.gym-label`, `.text-premium`)
Applied to: Primary buttons, section headers, numeric highlights.
- **Rules**: `font-black`, `italic`, `uppercase`, `tracking-widest`.
- **Sizes**: `text-xs`, `text-micro` (11px), or `text-nano` (10px).

## 3. UI Primitives

All primitives are located in `src/components/ui/`.

- **Buttons**: Rounded-xl, py-2.5, support for `variant="dashed"` (standard for adding/secondary actions).
- **Cards**: Bordered with `#2A2A2A`, subtle shadow.
- **Glass Panel**: Use `.glass-panel` for sticky headers or floating modals.

## 4. Visual Philosophy
1. **Depth**: Use surfacing instead of borders where possible (bg -> surface -> card).
2. **Motion**: Use `.active-scale` (`active:scale-95`) to make the app feel alive.
3. **Hierarchy**: Contrast should be high. Use pure white (`foreground`) only for primary values.
