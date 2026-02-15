/**
 * A Mutex (Mutual Exclusion) class to ensure a task runs exclusively.
 * It prevents race conditions in asynchronous code by ensuring only one task
 * can access a shared resource at a time.
 */
export class Mutex {
  private _isLocked: boolean = false;
  private _taskQueue: Array<() => void> = [];

  /**
   * Indicates whether the mutex is currently locked.
   */
  public get isLocked(): boolean {
    return this._isLocked;
  }

  /**
   * Acquires the lock. This is the core of the locking mechanism.
   * If the mutex is not locked, it immediately sets the lock and resolves.
   * If it's already locked, it creates a new promise and adds its `resolve`
   * function to the queue. The promise will only resolve when `_releaseLock`
   * is called and it's this task's turn to run.
   */
  private _acquireLock(): Promise<void> {
    if (!this._isLocked) {
      this._isLocked = true;

      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      this._taskQueue.push(resolve);
    });
  }

  /**
   * Releases the lock. This function is responsible for handing off the lock
   * to the next waiting task.
   * If there are tasks in the queue, it dequeues the first one and calls its
   * `resolve` function, which allows the waiting task's `await` call to continue.
   * If the queue is empty, it simply unlocks the mutex, making it available
   * for the next incoming task.
   */
  private _releaseLock(): void {
    if (this._taskQueue.length > 0) {
      const resolve = this._taskQueue.shift();

      resolve?.();
    } else {
      this._isLocked = false;
    }
  }

  /**
   * Executes a task with the lock acquired and ensures the lock is released afterward.
   * It ensures that the lock is always released regardless of whether the task
   * succeeds or throws an error. This prevents the mutex from getting stuck in
   * a locked state, which would lead to a deadlock.
   *
   * @param task The asynchronous function to execute.
   * @returns The result of the task.
   */
  public async runAtomic<T>(task: () => Promise<T> | T): Promise<T> {
    try {
      await this._acquireLock();
      const result = await task();

      return result;
    } finally {
      this._releaseLock();
    }
  }

  /**
   * Force release the mutex and clear all queued tasks.
   * Used for cleanup during disposal.
   */
  public release(): void {
    this._taskQueue.forEach(resolve => resolve());
    this._isLocked = false;
    this._taskQueue = [];
  }
}
