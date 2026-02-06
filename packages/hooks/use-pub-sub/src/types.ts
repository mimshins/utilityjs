export type Callback = () => void;
export type Registry = Record<string, Callback[]>;

export type Unsubscribe = (channel: string, callback: Callback) => void;
export type Subscribe = (channel: string, callback: Callback) => void;
export type Publish = (channel: string) => void;
