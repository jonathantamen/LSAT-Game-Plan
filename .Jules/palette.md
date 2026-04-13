## 2024-04-13 - Keyboard Accessibility for Hover Actions
**Learning:** Actions hidden via `opacity-0` on hover become inaccessible to keyboard users because they cannot be focused via tab navigation.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` (or `focus:opacity-100` on the element itself) to ensure keyboard users can tab to and interact with the actions. Add clear `focus-visible` styles so the user knows where their focus is.
