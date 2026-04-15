## 2026-04-15 - Pre-calculated category counts for rendering optimization
**Learning:** Filtering arrays directly within render loops on a category mapping basis imposes an O(N*C) overhead. Memoizing the counts via a hash map reduces this to an O(N) calculation run only when dependencies update. Also, never touch `tsconfig.json` unless explicitly requested.
**Action:** Use `useMemo` and hash maps to pre-calculate count mappings instead of filtering arrays directly within React render loops when the output values depend on grouping.
