export type State<T> = {
  past: T[];
  present: T;
  future: T[];
};
