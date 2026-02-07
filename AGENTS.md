# AI Agent Documentation for UtilityJS

This document provides AI assistants with comprehensive context about the
UtilityJS project architecture, conventions, and workflows.

## Project Overview

**UtilityJS** is a TypeScript monorepo containing reusable utility packages
organized into three categories:

- **React Hooks** (`packages/hooks/*`) - 23 custom React hooks for common UI
  patterns
- **Data Structures** (`packages/data-structures/*`) - 10 classic data
  structures (Heap, Graph, LinkedList, etc.)
- **Utility Modules** (`packages/modules/*`) - 4 standalone utility functions

Each package is independently published to npm under the `@utilityjs/*` scope.

## Repository Structure

```
utilityjs/
├── packages/
│   ├── hooks/              # React hooks (23 packages)
│   │   ├── use-event-listener/
│   │   ├── use-dark-mode/
│   │   ├── use-persisted-state/
│   │   └── ...
│   ├── data-structures/    # Data structures (10 packages)
│   │   ├── heap/
│   │   ├── graph/
│   │   ├── linked-list/
│   │   └── ...
│   └── modules/            # Utility functions (4 packages)
│       ├── copy-to-clipboard/
│       ├── with-recent-cache/
│       └── ...
├── scripts/                # Build and maintenance scripts
├── .kiro/                  # Kiro CLI configuration
└── [config files]          # TypeScript, ESLint, Prettier, etc.
```

### Package Structure

Each package follows this structure:

```
package-name/
├── src/
│   ├── index.ts           # Public exports (excluded from coverage)
│   ├── types.ts           # Type definitions (excluded from coverage)
│   ├── [main].ts          # Implementation
│   ├── [main].test.ts     # Tests
│   └── utils.ts           # Helper utilities (if needed)
├── package.json
└── README.md
```

## Technology Stack

- **Language**: TypeScript 5.9+ with strict mode
- **Runtime**: Node.js 24+
- **Package Manager**: pnpm 10.22.0 (required, npm/yarn not supported)
- **Build Tool**: tsdown
- **Test Framework**: Vitest with 100% coverage requirement
- **Linting**: ESLint 9 (flat config) + Prettier
- **Monorepo**: pnpm workspaces
- **Versioning**: Changesets

## TypeScript Configuration

### Key Compiler Options

```json
{
  "strict": true,
  "erasableSyntaxOnly": true, // No parameter properties
  "noPropertyAccessFromIndexSignature": true, // Use bracket notation for index access
  "noUncheckedIndexedAccess": true,
  "verbatimModuleSyntax": true,
  "rewriteRelativeImportExtensions": true // .ts → .js in imports
}
```

### Critical Rules

1. **No Parameter Properties**: `erasableSyntaxOnly` is enabled

   ```typescript
   // ❌ Wrong
   constructor(private value: number) {}

   // ✅ Correct
   private value: number;
   constructor(value: number) {
     this.value = value;
   }
   ```

2. **Index Signature Access**: Must use bracket notation

   ```typescript
   const obj: Record<string, number> = {};
   obj.key; // ❌ Error
   obj["key"]; // ✅ Correct
   ```

3. **Import Extensions**: Always use `.ts` (rewritten to `.js` at build)

   ```typescript
   import { foo } from "./utils.ts"; // ✅ Correct
   ```

## Testing Standards

### Coverage Requirements

- **100% coverage** enforced via Vitest thresholds
- Coverage excludes: `index.ts`, `types.ts`
- Configuration: `vitest.node.config.ts` (Node), `vitest.browser.config.ts`
  (Browser/React)

### Test File Conventions

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";

describe("useMyHook", () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should do something", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBe(expected);
  });
});
```

### Coverage Pragmas

Use `v8 ignore` comments for untestable code:

```typescript
// SSR checks (untestable in test environment)
/* v8 ignore start */
const isServer = typeof window === "undefined";
/* v8 ignore stop */

// Defensive guards (unreachable in normal flow)
/* v8 ignore start */
if (!node) return;
/* v8 ignore stop */

// Legacy browser fallbacks
/* v8 ignore start */
element.addEventListener(type, handler, { passive: true });
/* v8 ignore stop */
```

**Important**: Use `/* v8 ignore start/stop */` for ternaries, NOT
`/* v8 ignore next */`.

### Common Testing Patterns

#### Mocking Hooks

```typescript
// useGetLatest mock
vi.mock("@utilityjs/use-get-latest", () => ({
  useGetLatest: (value: unknown) => ({ current: value }),
}));

// useRegisterNodeRef mock
vi.mock("@utilityjs/use-register-node-ref", () => ({
  useRegisterNodeRef: (subscriber: Function, _deps: unknown[]) => {
    let cleanup: (() => void) | undefined;
    return (node: HTMLElement | null) => {
      if (cleanup) cleanup();
      if (node) cleanup = subscriber(node);
    };
  },
}));
```

#### Mocking Browser APIs

```typescript
// ResizeObserver
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  },
);

// IntersectionObserver
vi.stubGlobal(
  "IntersectionObserver",
  class {
    constructor(callback: Function) {
      this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  },
);
```

#### Module State Reset

For modules with module-level state:

```typescript
beforeEach(async () => {
  vi.resetModules();
  const module = await import("./my-module.ts");
  // Use fresh module instance
});
```

## Code Quality Standards

### Linting Commands

```bash
pnpm check:lint        # Run all checks (TS, ESLint, Prettier, cycles)
pnpm check:lint:ts     # TypeScript type checking
pnpm check:lint:ecma   # ESLint
pnpm check:format      # Prettier check
pnpm check:cycles      # Circular dependency detection

pnpm format            # Auto-fix formatting issues
```

### ESLint Configuration

- **Config**: `eslint.config.js` (flat config format)
- **Plugins**: TypeScript ESLint, React, React Hooks, Vitest, Import, Prettier
- **Key Rules**:
  - `@typescript-eslint/no-unsafe-*` - Strict type safety
  - `@vitest/expect-expect` - All tests must have assertions
  - `@vitest/no-conditional-expect` - No `expect()` inside conditionals
  - `react-hooks/rules-of-hooks` - Hook usage rules
  - `react-hooks/exhaustive-deps` - Dependency array validation

### Common ESLint Fixes

```typescript
// ❌ Test with no assertions
it("should work", () => {
  renderHook(() => useMyHook());
});

// ✅ Add assertion
it("should work", () => {
  const { result } = renderHook(() => useMyHook());
  expect(result.current).toBeDefined();
});

// ❌ Conditional expect
if (value) {
  expect(value.prop).toBe(true);
}

// ✅ Assert existence first
expect(value).toBeDefined();
expect(value!.prop).toBe(true);

// ❌ Unsafe any assignment
const handler = expect.any(Function);

// ✅ Suppress with comment
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = expect.any(Function);
```

## Development Workflow

### Setup

```bash
git clone https://github.com/mimshins/utilityjs.git
cd utilityjs
pnpm install
```

### Common Commands

```bash
# Testing
pnpm test              # Run all tests
pnpm test:watch        # Watch mode

# Building
pnpm build             # Build all packages

# Quality Checks
pnpm check:lint        # All checks (required before commit)
pnpm format            # Auto-fix formatting

# Changesets (versioning)
pnpm changesets:create # Create changeset
pnpm changesets:apply  # Apply changesets (bump versions)
pnpm release           # Build and publish
```

### Git Workflow

1. Create feature branch from `main`
2. Make changes
3. Run `pnpm check:lint` (must pass)
4. Run `pnpm test` (must pass with 100% coverage)
5. Commit with conventional commit message
6. Create pull request

### Commit Message Convention

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting)
- refactor: Code refactoring
- perf: Performance improvements
- test: Test changes
- build: Build system changes
- ci: CI configuration changes
- chore: Other changes
```

## Package-Specific Patterns

### React Hooks

All hooks follow these patterns:

1. **SSR Safety**: Use `useIsomorphicLayoutEffect` or check `typeof window`
2. **Ref Handling**: Support both `RefObject<T>` and direct element references
3. **Cleanup**: Always return cleanup functions from effects
4. **Latest Values**: Use `useGetLatest` for callback refs to avoid stale
   closures
5. **Type Safety**: Export all types and options interfaces

Example hook structure:

```typescript
import { useEffect, useRef } from "react";
import { useGetLatest } from "@utilityjs/use-get-latest";

export type Options = {
  enabled?: boolean;
};

export const useMyHook = (callback: () => void, options?: Options) => {
  const callbackRef = useGetLatest(callback);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    const handler = () => callbackRef.current();

    // Setup
    window.addEventListener("event", handler);

    // Cleanup
    return () => {
      window.removeEventListener("event", handler);
    };
  }, [enabled, callbackRef]);
};
```

### Data Structures

1. **Immutability**: Methods return new instances or void (mutate in place)
2. **Generics**: All structures are generic over element type `<T>`
3. **Comparators**: Use `@utilityjs/comparator` for custom comparison
4. **Documentation**: JSDoc for all public methods

### Utility Modules

1. **Pure Functions**: No side effects unless explicitly documented
2. **Error Handling**: Throw descriptive errors or return Result types
3. **Browser Compatibility**: Provide fallbacks for modern APIs
4. **Tree-Shakeable**: Export individual functions, not default objects

## Cross-Package Dependencies

### Internal Dependencies

Packages can depend on other `@utilityjs/*` packages:

```json
{
  "dependencies": {
    "@utilityjs/use-get-latest": "workspace:*",
    "@utilityjs/comparator": "workspace:*"
  }
}
```

### Path Aliases

TypeScript paths are configured for imports:

```typescript
import { useGetLatest } from "@utilityjs/use-get-latest";
// Resolves to: packages/hooks/use-get-latest/src/index.ts
```

### Circular Dependencies

The `check:cycles` script detects circular dependencies using Madge. All cycles
must be resolved before merging.

## Common Pitfalls

### 1. Mock Type Mismatches

```typescript
// ❌ Wrong - vi.fn() returns Mock<[], unknown>
const handler = vi.fn();

// ✅ Correct - Explicitly type the mock
const handler = vi.fn<() => void>();
const handler = vi.fn<(event: MouseEvent) => void>();
```

### 2. RefObject Casting

```typescript
// ❌ Wrong - Direct cast fails
const ref = { current: element } as React.RefObject<HTMLElement>;

// ✅ Correct - Use intermediate unknown cast
const ref = { current: element } as unknown as React.RefObject<HTMLElement>;
```

### 3. Event Types

```typescript
// ❌ Wrong - MouseEvent for pointer events
element.addEventListener("pointerdown", (e: MouseEvent) => {});

// ✅ Correct - Use PointerEvent
element.addEventListener("pointerdown", (e: PointerEvent) => {});
```

### 4. Generic Type Inference

```typescript
// ❌ Wrong - TypeScript can't infer generic
emitInstances("key", setState, value);

// ✅ Correct - Explicitly provide type parameter
emitInstances<string>("key", setState, value);
```

### 5. Coverage for Ternaries

```typescript
// ❌ Wrong - Won't cover both branches
/* v8 ignore next */
const value = condition ? a : b;

// ✅ Correct - Use start/stop
/* v8 ignore start */
const value = condition ? a : b;
/* v8 ignore stop */
```

## Key Packages Reference

### Core Hooks

- **use-event-listener**: Declarative event listener management
- **use-dark-mode**: Dark mode state with system preference sync
- **use-persisted-state**: Multi-tab synchronized localStorage state
- **use-long-press**: Long press gesture detection
- **use-resize-sensor**: Element resize observation
- **use-is-in-viewport**: Intersection observer wrapper
- **use-media-query**: CSS media query matching
- **use-on-outside-click**: Click outside element detection

### Utility Hooks

- **use-get-latest**: Ref to latest value (avoid stale closures)
- **use-register-node-ref**: Callback ref pattern
- **use-isomorphic-layout-effect**: SSR-safe layout effect
- **use-is-server-handoff-complete**: SSR hydration detection
- **use-controlled-prop**: Controlled/uncontrolled prop pattern
- **use-forked-refs**: Merge multiple refs

### Data Structures

- **Heap**: Abstract heap with MinHeap/MaxHeap implementations
- **Graph**: Directed/undirected graph with DFS/BFS
- **LinkedList**: Singly linked list
- **Queue**: FIFO queue
- **Stack**: LIFO stack
- **PriorityQueue**: Priority-based queue
- **DisjointSet**: Union-find data structure
- **Vector**: 2D/3D vector operations

### Utility Modules

- **copy-to-clipboard**: Clipboard API with fallback
- **with-recent-cache**: Single-result memoization
- **create-store-context**: React context store pattern
- **resolve-throwable**: Safe promise resolution

## AI Assistant Guidelines

### When Making Changes

1. **Read existing code first**: Understand patterns before modifying
2. **Run tests frequently**: `pnpm test` after each change
3. **Check types**: `pnpm check:lint:ts` catches type errors early
4. **Minimal changes**: Only modify what's necessary
5. **Follow conventions**: Match existing code style and patterns

### When Writing Tests

1. **Achieve 100% coverage**: Required for all packages
2. **Use v8 ignore sparingly**: Only for truly untestable code
3. **Mock dependencies**: Isolate unit under test
4. **Test edge cases**: Null, undefined, empty arrays, etc.
5. **Meaningful assertions**: Every test must have `expect()` calls

### When Debugging

1. **Check TypeScript errors first**: `pnpm check:lint:ts`
2. **Then ESLint**: `pnpm check:lint:ecma`
3. **Then Prettier**: `pnpm check:format`
4. **Finally tests**: `pnpm test`
5. **Read error messages carefully**: They usually point to the exact issue

### When Adding Features

1. **Check for existing patterns**: Don't reinvent the wheel
2. **Consider SSR**: Hooks must work server-side
3. **Add JSDoc**: Document all public APIs
4. **Export types**: Make TypeScript users happy
5. **Update README**: Document new functionality

## Resources

- **Repository**: <https://github.com/mimshins/utilityjs>
- **Contributing Guide**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- **License**: MIT

## Quick Reference

```bash
# Setup
pnpm install

# Development
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm check:lint        # All quality checks (required)
pnpm format            # Auto-fix formatting

# Before Commit Checklist
✓ pnpm check:lint      # Must pass
✓ pnpm test            # Must pass with 100% coverage
✓ Conventional commit message
✓ No console.log or debugger statements
```

---

**Last Updated**: February 2026  
**Maintained By**: UtilityJS Contributors
