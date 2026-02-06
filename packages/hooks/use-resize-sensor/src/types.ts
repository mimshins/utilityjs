export type RefreshOptions = {
  mode?: "debounce" | "throttle";
  rate?: number;
  leading?: boolean;
  trailing?: boolean;
};

export type Debounced<T extends (...args: never[]) => unknown> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
};
