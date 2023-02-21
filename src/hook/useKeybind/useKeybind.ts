import useEventListener from "@utilityjs/use-event-listener";
import * as React from "react";

export const MODIFIERS = {
  Alt: "Alt",
  Control: "Control",
  Meta: "Meta",
  Shift: "Shift"
} as const;

export const EVENT_MODIFIERS = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
} as const;

export const KEYS_KEYCODE = {
  Space: "Space",
  ";": "Semicolon",
  "=": "Equal",
  ",": "Comma",
  "-": "Minus",
  ".": "Period",
  "/": "Slash",
  "`": "Backquote",
  "[": "BracketLeft",
  "\\": "Backslash",
  "]": "BracketRight",
  "'": "Quote",
  "1": "Digit1",
  "2": "Digit2",
  "3": "Digit3",
  "4": "Digit4",
  "5": "Digit5",
  "6": "Digit6",
  "7": "Digit7",
  "8": "Digit8",
  "9": "Digit9",
  "0": "Digit0",
  a: "KeyA",
  b: "KeyB",
  c: "KeyC",
  d: "KeyD",
  e: "KeyE",
  f: "KeyF",
  g: "KeyG",
  h: "KeyH",
  i: "KeyI",
  j: "KeyJ",
  k: "KeyK",
  l: "KeyL",
  m: "KeyM",
  n: "KeyN",
  o: "KeyO",
  p: "KeyP",
  q: "KeyQ",
  r: "KeyR",
  s: "KeyS",
  t: "KeyT",
  u: "KeyU",
  v: "KeyV",
  w: "KeyW",
  x: "KeyX",
  y: "KeyY",
  z: "KeyZ"
} as const;

export const KEYS_KEYNAME = {
  Backspace: "Backspace",
  Tab: "Tab",
  Enter: "Enter",
  Shift: "Shift",
  Control: "Control",
  Alt: "Alt",
  CapsLock: "CapsLock",
  Escape: "Escape",
  End: "End",
  Home: "Home",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  ArrowDown: "ArrowDown",
  Insert: "Insert",
  Delete: "Delete",
  Meta: "Meta",
  NumLock: "NumLock",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12"
} as const;

type KeyNames = keyof typeof KEYS_KEYNAME;
type KeyCodes = keyof typeof KEYS_KEYCODE;

export type Keys = KeyNames | KeyCodes;
export type KeyCallback = (event: KeyboardEvent) => void;
export type Keybinding = { keys: Keys[]; callback: KeyCallback };

type UseKeybind = {
  <T extends Window = Window>(target: T | null, bindings: Keybinding[]): void;
  <T extends Document = Document>(
    target: T | null,
    bindings: Keybinding[]
  ): void;
  <T extends HTMLElement = HTMLElement>(
    target: React.RefObject<T> | T | null,
    bindings: Keybinding[]
  ): void;
};

const keybindHandler = (
  event: KeyboardEvent,
  keys: Keys[],
  callback: KeyCallback
) => {
  if (event.defaultPrevented) return;

  const hasModifier =
    keys.some(key => !!MODIFIERS[key as keyof typeof MODIFIERS]) || false;

  const eventModifiers = Object.keys(EVENT_MODIFIERS)
    .map(key => {
      const eventMod = EVENT_MODIFIERS[key as keyof typeof EVENT_MODIFIERS];

      if (event[eventMod]) {
        if (!hasModifier) return null;
        return eventMod;
      }

      return null;
    })
    .filter(Boolean) as string[];

  let bail = false;

  keys.forEach(key => {
    if (bail) return;

    const isModifier = !!MODIFIERS[key as keyof typeof MODIFIERS];
    const eventModKey = EVENT_MODIFIERS[key as keyof typeof EVENT_MODIFIERS];

    if (isModifier) {
      const modKeyIndex = eventModifiers.indexOf(eventModKey);

      if (modKeyIndex > -1) {
        eventModifiers.splice(modKeyIndex, 1);
        return;
      }

      bail = true;
      return;
    }

    if (
      (KEYS_KEYNAME[key as KeyNames] &&
        event.key !== KEYS_KEYNAME[key as KeyNames]) ||
      (KEYS_KEYCODE[key as KeyCodes] &&
        event.code !== KEYS_KEYCODE[key as KeyCodes])
    ) {
      bail = true;
    }
  });

  if (bail) return;
  if (eventModifiers.length > 0) return;

  callback(event);
};

const useKeybind: UseKeybind = (target: unknown, bindings: Keybinding[]) => {
  useEventListener({
    target: target as HTMLElement,
    eventType: "keydown",
    handler: event => {
      bindings.forEach(binding => {
        keybindHandler(event, binding.keys, binding.callback);
      });
    }
  });
};

export default useKeybind;
