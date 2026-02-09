---
"@utilityjs/comparator": major
"@utilityjs/disjoint-set": major
"@utilityjs/graph": major
"@utilityjs/heap": major
"@utilityjs/linked-list": major
"@utilityjs/max-heap": major
"@utilityjs/min-heap": major
"@utilityjs/priority-queue": major
"@utilityjs/queue": major
"@utilityjs/stack": major
"@utilityjs/vector": major
"@utilityjs/use-controlled-prop": major
"@utilityjs/use-dark-mode": major
"@utilityjs/use-deterministic-id": major
"@utilityjs/use-event-listener": major
"@utilityjs/use-forked-refs": major
"@utilityjs/use-get-latest": major
"@utilityjs/use-hover": major
"@utilityjs/use-immutable-array": major
"@utilityjs/use-init-once": major
"@utilityjs/use-is-in-viewport": major
"@utilityjs/use-is-mounted": major
"@utilityjs/use-is-server-handoff-complete": major
"@utilityjs/use-isomorphic-layout-effect": major
"@utilityjs/use-long-press": major
"@utilityjs/use-media-query": major
"@utilityjs/use-memento-state": major
"@utilityjs/use-on-change": major
"@utilityjs/use-on-outside-click": major
"@utilityjs/use-persisted-state": major
"@utilityjs/use-previous-value": major
"@utilityjs/use-pub-sub": major
"@utilityjs/use-register-node-ref": major
"@utilityjs/use-resize-sensor": major
"@utilityjs/copy-to-clipboard": major
"@utilityjs/create-store-context": major
"@utilityjs/resolve-throwable": major
"@utilityjs/retry-with-backoff": major
"@utilityjs/with-recent-cache": major
---

Major refactor to modernize the entire UtilityJS ecosystem:

- **Breaking**: Migrated to ESM-only modules (no CommonJS support)
- **Breaking**: Upgraded to modern build tooling with tsdown for optimized bundle sizes
- **Breaking**: Improved TypeScript strict mode compliance with `erasableSyntaxOnly` and `noUncheckedIndexedAccess`
- **Breaking**: Standardized API interfaces across all packages for consistency
- **New**: Added comprehensive JSDoc documentation for all public APIs
- **New**: Implemented 100% test coverage requirement across all packages
- **Improved**: Enhanced error messages and type safety throughout
- **Improved**: Optimized tree-shaking support for better bundle efficiency
  