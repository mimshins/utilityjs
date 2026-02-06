<div align="center">

# UtilityJS | useMementoState

A React hook that keeps the track of the history of the state changes.

</div>

<hr />

## Features

- **Undo/Redo Functionality**: Navigate through state history with undo and redo
  operations
- **History Tracking**: Maintains arrays of past and future states
- **Functional Updates**: Supports both direct values and updater functions
- **Reset Capability**: Reset to initial state at any time
- **State Validation**: Check availability of undo/redo operations
- **TypeScript Support**: Full type safety with generic support
- **Memory Efficient**: Optimized state management with useReducer

## Installation

```bash
npm install @utilityjs/use-memento-state
```

or

```bash
pnpm add @utilityjs/use-memento-state
```

## Usage

### Basic Text Editor

```tsx
import { useMementoState } from "@utilityjs/use-memento-state";

function TextEditor() {
  const {
    state: text,
    setState: setText,
    undo,
    redo,
    reset,
    hasPastState,
    hasFutureState,
  } = useMementoState("");

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Start typing..."
      />
      <div>
        <button
          onClick={undo}
          disabled={!hasPastState()}
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!hasFutureState()}
        >
          Redo
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
```

### Counter with History

```tsx
import { useMementoState } from "@utilityjs/use-memento-state";

function CounterWithHistory() {
  const {
    state: count,
    setState: setCount,
    undo,
    redo,
    reset,
    pastStates,
    futureStates,
    hasPastState,
    hasFutureState,
  } = useMementoState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);

  return (
    <div>
      <h2>Count: {count}</h2>

      <div>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
      </div>

      <div>
        <button
          onClick={undo}
          disabled={!hasPastState()}
        >
          Undo ({pastStates.length})
        </button>
        <button
          onClick={redo}
          disabled={!hasFutureState()}
        >
          Redo ({futureStates.length})
        </button>
        <button onClick={reset}>Reset</button>
      </div>

      <div>
        <h3>History:</h3>
        <p>Past: [{pastStates.join(", ")}]</p>
        <p>Current: {count}</p>
        <p>Future: [{futureStates.join(", ")}]</p>
      </div>
    </div>
  );
}
```

### Drawing Application

```tsx
import { useMementoState } from "@utilityjs/use-memento-state";

type Point = { x: number; y: number };
type DrawingState = { points: Point[]; color: string };

function DrawingApp() {
  const {
    state: drawing,
    setState: setDrawing,
    undo,
    redo,
    reset,
    hasPastState,
    hasFutureState,
  } = useMementoState<DrawingState>({
    points: [],
    color: "#000000",
  });

  const addPoint = (x: number, y: number) => {
    setDrawing(prev => ({
      ...prev,
      points: [...prev.points, { x, y }],
    }));
  };

  const changeColor = (color: string) => {
    setDrawing(prev => ({ ...prev, color }));
  };

  const clearCanvas = () => {
    setDrawing(prev => ({ ...prev, points: [] }));
  };

  return (
    <div>
      <div>
        <input
          type="color"
          value={drawing.color}
          onChange={e => changeColor(e.target.value)}
        />
        <button onClick={clearCanvas}>Clear</button>
      </div>

      <svg
        width="400"
        height="300"
        style={{ border: "1px solid #ccc" }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          addPoint(e.clientX - rect.left, e.clientY - rect.top);
        }}
      >
        {drawing.points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={drawing.color}
          />
        ))}
      </svg>

      <div>
        <button
          onClick={undo}
          disabled={!hasPastState()}
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!hasFutureState()}
        >
          Redo
        </button>
        <button onClick={reset}>Reset All</button>
      </div>
    </div>
  );
}
```

### Form with History

```tsx
import { useMementoState } from "@utilityjs/use-memento-state";

type FormData = {
  name: string;
  email: string;
  message: string;
};

function FormWithHistory() {
  const {
    state: formData,
    setState: setFormData,
    undo,
    redo,
    reset,
    hasPastState,
    hasFutureState,
  } = useMementoState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => updateField("name", e.target.value)}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => updateField("email", e.target.value)}
        />
      </div>

      <div>
        <label>Message:</label>
        <textarea
          value={formData.message}
          onChange={e => updateField("message", e.target.value)}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={undo}
          disabled={!hasPastState()}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!hasFutureState()}
        >
          Redo
        </button>
        <button
          type="button"
          onClick={reset}
        >
          Reset Form
        </button>
      </div>
    </form>
  );
}
```

## API

### `useMementoState<T>(initialPresent)`

A React hook that provides state management with undo/redo functionality.

#### Parameters

- `initialPresent: T` - The initial state value

#### Returns

```typescript
{
  /** Current state value */
  state: T;
  /** Array of past state values */
  pastStates: T[];
  /** Array of future state values (for redo functionality) */
  futureStates: T[];
  /** Function to update the current state */
  setState: Dispatch<SetStateAction<T>>;
  /** Function to undo to the previous state */
  undo: () => void;
  /** Function to redo to the next state */
  redo: () => void;
  /** Function to reset to the initial state */
  reset: () => void;
  /** Function to check if there are past states available for undo */
  hasPastState: () => boolean;
  /** Function to check if there are future states available for redo */
  hasFutureState: () => boolean;
}
```

### State Management

#### `setState(value | updaterFunction)`

Updates the current state. Accepts either a direct value or an updater function.

```tsx
// Direct value
setState("new value");

// Updater function
setState(prev => prev + 1);
```

#### `undo()`

Moves to the previous state if available. The current state is moved to the
future states array.

#### `redo()`

Moves to the next state if available. The current state is moved to the past
states array.

#### `reset()`

Resets the state to the initial value and clears all history.

### History Checking

#### `hasPastState()`

Returns `true` if there are previous states available for undo.

#### `hasFutureState()`

Returns `true` if there are future states available for redo.

### Behavior Details

- **State Changes**: Each `setState` call adds the current state to history
- **Undo Operation**: Moves current state to future, restores from past
- **Redo Operation**: Moves current state to past, restores from future
- **New Changes**: Clear future states when new changes are made after undo
- **Duplicate Prevention**: Identical consecutive states are not added to
  history

## Use Cases

- **Text Editors**: Implement undo/redo for text editing
- **Drawing Applications**: Track drawing operations and allow undoing
- **Form Management**: Allow users to undo form changes
- **Game Development**: Implement move history in games
- **Configuration Panels**: Let users experiment and revert changes
- **Data Entry**: Provide safety net for complex data input

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
