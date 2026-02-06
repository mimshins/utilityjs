import type { Dispatch, SetStateAction } from "react";

export type InstanceRef<T> = {
  callbacks: Array<Dispatch<SetStateAction<T>>>;
  value: T;
};
