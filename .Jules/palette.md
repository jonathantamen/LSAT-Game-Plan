## 2024-04-13 - Keyboard Accessibility for Hover Actions
**Learning:** Actions hidden via `opacity-0` on hover become inaccessible to keyboard users because they cannot be focused via tab navigation.
**Action:** Always pair `group-hover:opacity-100` with `focus-within:opacity-100` (or `focus:opacity-100` on the element itself) to ensure keyboard users can tab to and interact with the actions. Add clear `focus-visible` styles so the user knows where their focus is.
## 2024-04-13 - [StudentDashboard] Icon-only Task Toggle Buttons
**Learning:** Icon-only buttons used for toggling task states (complete/incomplete) lacked semantic meaning for screen readers and tooltips for sighted users. They also lacked visible focus states, hindering keyboard navigation.
**Action:** Always pair icon-only interactive elements with dynamic `aria-label` and `title` attributes that reflect the current state. Include `focus-visible` ring utilities (e.g., `focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-blue-500`) to ensure robust keyboard accessibility.
