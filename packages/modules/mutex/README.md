<div align="center">

# UtilityJS | Mutex

A Mutex (Mutual Exclusion) class to ensure a task runs exclusively.

</div>

<hr />

## Features

- **Mutual Exclusion**: Ensures only one task accesses a shared resource at a
  time
- **Queue Management**: Automatically queues concurrent tasks
- **Error Handling**: Guarantees lock release even when tasks throw errors
- **Promise-based**: Async/await support for clean code
- **TypeScript Support**: Full type safety with generics

## Installation

```bash
npm install @utilityjs/mutex
```

or

```bash
pnpm add @utilityjs/mutex
```

## Usage

### Basic Usage

```typescript
import { Mutex } from "@utilityjs/mutex";

const mutex = new Mutex();

// Run tasks atomically
await mutex.runAtomic(async () => {
  // Critical section - only one task executes at a time
  await updateSharedResource();
});
```

### Preventing Race Conditions

```typescript
import { Mutex } from "@utilityjs/mutex";

const mutex = new Mutex();
let counter = 0;

// Without mutex, these would race
const task1 = mutex.runAtomic(async () => {
  const current = counter;
  await delay(10);
  counter = current + 1;
});

const task2 = mutex.runAtomic(async () => {
  const current = counter;
  await delay(10);
  counter = current + 1;
});

await Promise.all([task1, task2]);
console.log(counter); // 2 (correct, no race condition)
```

### With Return Values

```typescript
import { Mutex } from "@utilityjs/mutex";

const mutex = new Mutex();

const result = await mutex.runAtomic(async () => {
  const data = await fetchData();
  return processData(data);
});

console.log(result); // Processed data
```

### Error Handling

```typescript
import { Mutex } from "@utilityjs/mutex";

const mutex = new Mutex();

try {
  await mutex.runAtomic(async () => {
    throw new Error("Task failed");
  });
} catch (error) {
  console.error(error);
}

// Mutex is automatically released, next task can proceed
await mutex.runAtomic(async () => {
  console.log("This runs successfully");
});
```

### Checking Lock State

```typescript
import { Mutex } from "@utilityjs/mutex";

const mutex = new Mutex();

console.log(mutex.isLocked); // false

const promise = mutex.runAtomic(async () => {
  console.log(mutex.isLocked); // true
  await delay(100);
});

console.log(mutex.isLocked); // true (task is running)

await promise;

console.log(mutex.isLocked); // false (task completed)
```

### Force Release

```typescript
import { Mutex } from "@utilityjs/mutex";

const mutex = new Mutex();

// Queue multiple tasks
const task1 = mutex.runAtomic(async () => await delay(1000));
const task2 = mutex.runAtomic(async () => await delay(1000));
const task3 = mutex.runAtomic(async () => await delay(1000));

// Force release all queued tasks
mutex.release();

console.log(mutex.isLocked); // false
```

## API

### `new Mutex()`

Creates a new Mutex instance.

### `mutex.runAtomic<T>(task: () => Promise<T> | T): Promise<T>`

Executes a task with the lock acquired and ensures the lock is released
afterward.

**Parameters:**

- `task` - The synchronous or asynchronous function to execute

**Returns:**

- `Promise<T>` - A promise that resolves with the task's return value

**Behavior:**

1. Acquires the lock (waits if already locked)
2. Executes the task
3. Releases the lock (even if task throws)
4. Returns the task's result or throws its error

### `mutex.isLocked: boolean`

Read-only property indicating whether the mutex is currently locked.

### `mutex.release(): void`

Force releases the mutex and clears all queued tasks. Use with caution as this
resolves all waiting tasks immediately.

## How It Works

The Mutex uses a queue-based locking mechanism:

1. When `runAtomic()` is called, it attempts to acquire the lock
2. If the lock is available, it's acquired immediately
3. If the lock is held, the task is queued
4. When a task completes, the lock is passed to the next queued task
5. The lock is always released, even if the task throws an error

This ensures:

- Only one task executes at a time
- Tasks execute in the order they were queued (FIFO)
- No deadlocks from forgotten releases

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
