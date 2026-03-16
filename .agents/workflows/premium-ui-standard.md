# Premium UI Standards

This guide ensures every dynamic and interactive elements feel premium and "Vibe-Check" approved. Refer to the [Design System](file:///Users/ekuid/Documents/saipul/gym-tracker/.agents/design-system.md) for the full palette and typography rules.

## 1. Visual Alignment
- **Checklist**:
    - [ ] Is it using `italic` + `font-black` (Oswald) for primary headers/actions?
    - [ ] Does it have `active:scale-95` on click?
    - [ ] Is it using `bg-surface` or `bg-card` for layering instead of plain black?

## 2. Interactive States
- **Hover**: Subtle brightness change or background elevation.
- **Active**: `active:scale-95` on all clickable components for tactile feedback.
- **Loading**: Use the `LoadingSpinner` or the `loading` prop in `Button.tsx`.

## 3. Spacing & Radius
- **Border Radius**: Use `rounded-xl` (12px) for cards and big buttons. `rounded-lg` for inputs.
- **Padding**: Generous vertical padding on buttons (`py-2.5`).

## 4. Accessibility
- All inputs must have a `FormLabel`.
- Buttons must have `aria-label` if they only contain an icon.

## Checklist
- [ ] Is it using `italic` + `font-black` for primary headers?
- [ ] Does it have `active:scale-95`?
- [ ] Is the contrast compliant with `text-subtle` vs `text-muted`?
