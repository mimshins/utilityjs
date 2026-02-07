<div align="center">

# UtilityJS | useMediaQuery

A React hook that helps detect whether media queries individually match.

</div>

<hr />

## Features

- **Multiple Queries**: Support for single or multiple media queries
- **Reactive Updates**: Automatically updates when viewport changes
- **SSR Safe**: Works correctly with server-side rendering
- **Performance Optimized**: Efficient event listener management
- **TypeScript Support**: Full type safety with TypeScript definitions
- **Browser Compatibility**: Graceful fallback when matchMedia is not supported

## Installation

```bash
npm install @utilityjs/use-media-query
```

or

```bash
pnpm add @utilityjs/use-media-query
```

## Usage

### Single Media Query

```tsx
import { useMediaQuery } from "@utilityjs/use-media-query";

function ResponsiveComponent() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return <div>{isMobile ? <MobileNavigation /> : <DesktopNavigation />}</div>;
}
```

### Multiple Media Queries

```tsx
import { useMediaQuery } from "@utilityjs/use-media-query";

function MultiBreakpointComponent() {
  const [isMobile, isTablet, isDesktop] = useMediaQuery([
    "(max-width: 768px)",
    "(min-width: 769px) and (max-width: 1024px)",
    "(min-width: 1025px)",
  ]);

  if (isMobile) return <MobileLayout />;
  if (isTablet) return <TabletLayout />;
  if (isDesktop) return <DesktopLayout />;

  return <DefaultLayout />;
}
```

### Common Breakpoints

```tsx
import { useMediaQuery } from "@utilityjs/use-media-query";

function BreakpointExample() {
  const [isXs, isSm, isMd, isLg, isXl] = useMediaQuery([
    "(max-width: 575px)", // Extra small devices
    "(min-width: 576px) and (max-width: 767px)", // Small devices
    "(min-width: 768px) and (max-width: 991px)", // Medium devices
    "(min-width: 992px) and (max-width: 1199px)", // Large devices
    "(min-width: 1200px)", // Extra large devices
  ]);

  return (
    <div>
      <p>Current breakpoint:</p>
      {isXs && <span>Extra Small (XS)</span>}
      {isSm && <span>Small (SM)</span>}
      {isMd && <span>Medium (MD)</span>}
      {isLg && <span>Large (LG)</span>}
      {isXl && <span>Extra Large (XL)</span>}
    </div>
  );
}
```

### Dark Mode Detection

```tsx
import { useMediaQuery } from "@utilityjs/use-media-query";

function ThemeComponent() {
  const [isDarkMode] = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <div className={isDarkMode ? "dark-theme" : "light-theme"}>
      <h1>Current theme: {isDarkMode ? "Dark" : "Light"}</h1>
    </div>
  );
}
```

### Orientation Detection

```tsx
import { useMediaQuery } from "@utilityjs/use-media-query";

function OrientationComponent() {
  const [isPortrait, isLandscape] = useMediaQuery([
    "(orientation: portrait)",
    "(orientation: landscape)",
  ]);

  return (
    <div>
      {isPortrait && <p>Device is in portrait mode</p>}
      {isLandscape && <p>Device is in landscape mode</p>}
    </div>
  );
}
```

### Reduced Motion Detection

```tsx
import { useMediaQuery } from "@utilityjs/use-media-query";

function AccessibilityComponent() {
  const [prefersReducedMotion] = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  return (
    <div className={prefersReducedMotion ? "no-animations" : "with-animations"}>
      <h1>Respecting user preferences</h1>
    </div>
  );
}
```

## API

### `useMediaQuery(query)`

A React hook that tracks the state of CSS media queries.

#### Parameters

- `query: string | string[]` - A single media query string or an array of media
  query strings

#### Returns

- `boolean[]` - An array of boolean values indicating whether each query matches

#### Behavior

- **Initial State**: All queries start as `false` during SSR and initial render
- **Client Hydration**: Queries are evaluated and updated after component mounts
- **Reactive Updates**: Automatically updates when media query matches change
- **Error Handling**: Logs an error and returns `false` if `matchMedia` is not
  supported

### Common Media Query Patterns

#### Viewport Width

```css
(max-width: 768px)           /* Mobile */
(min-width: 769px)           /* Tablet and up */
(min-width: 1024px)          /* Desktop and up */
```

#### Device Characteristics

```css
(orientation: portrait)       /* Portrait orientation */
(orientation: landscape)      /* Landscape orientation */
(hover: hover)               /* Device supports hover */
(pointer: coarse)            /* Touch device */
```

#### User Preferences

```css
(prefers-color-scheme: dark)     /* Dark mode preference */
(prefers-reduced-motion: reduce) /* Reduced motion preference */
(prefers-contrast: high)         /* High contrast preference */
```

#### Display Properties

```css
(resolution: 2dppx)          /* High DPI displays */
(aspect-ratio: 16/9)         /* Specific aspect ratio */
```

## Browser Support

This hook relies on the `window.matchMedia` API, which is supported in:

- Chrome 9+
- Firefox 6+
- Safari 5.1+
- Edge 12+
- Internet Explorer 10+

For unsupported browsers, the hook will log an error and return `false` for all
queries.

## Performance Considerations

- **Event Listener Optimization**: Uses a single event listener per media query
- **Efficient Updates**: Only updates state when query matches actually change
- **Memory Management**: Properly cleans up event listeners on unmount
- **Event Listener Optimization**: Uses a single event listener per media query
- **Efficient Updates**: Only updates state when query matches actually change
- **Memory Management**: Properly cleans up event listeners on unmount
- **Memoization**: Query strings are memoized to prevent unnecessary
  re-subscriptions

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
