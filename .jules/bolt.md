
## 2024-04-15 - React Render Loop O(N*M) Bottleneck Avoidance
**Learning:** Performing array filtering (`tasks.filter(...).length`) inside a render loop (like mapping over categories) results in an O(N*M) time complexity calculation on *every single render*. This causes unnecessary CPU usage, especially since the render triggers whenever any state (like task completion) changes, even if the actual array of tasks and categories remained the same.
**Action:** When deriving counts or statistics from an array to be displayed in a list/loop, pre-compute these values using a hash map wrapped in `useMemo` so that the time complexity for updates becomes O(N) and rendering becomes O(1) per item.
