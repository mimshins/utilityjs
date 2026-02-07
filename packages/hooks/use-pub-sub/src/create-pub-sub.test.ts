import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPubSub } from "./create-pub-sub.ts";

describe("createPubSub", () => {
  let pubSub: ReturnType<typeof createPubSub>;

  beforeEach(() => {
    pubSub = createPubSub();
  });

  it("should create pub-sub system with required methods", () => {
    expect(pubSub).toHaveProperty("useSubscribe");
    expect(pubSub).toHaveProperty("publish");
    expect(pubSub).toHaveProperty("unsubscribe");
    expect(typeof pubSub.useSubscribe).toBe("function");
    expect(typeof pubSub.publish).toBe("function");
    expect(typeof pubSub.unsubscribe).toBe("function");
  });

  it("should subscribe to a channel and receive published events", () => {
    const callback = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback);
    });

    pubSub.publish("test-channel");

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple subscribers to the same channel", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback1);
    });

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback2);
    });

    pubSub.publish("test-channel");

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple channels independently", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("channel-1", callback1);
    });

    renderHook(() => {
      pubSub.useSubscribe("channel-2", callback2);
    });

    pubSub.publish("channel-1");

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    pubSub.publish("channel-2");

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should unsubscribe callback when component unmounts", () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => {
      pubSub.useSubscribe("test-channel", callback);
    });

    pubSub.publish("test-channel");
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    pubSub.publish("test-channel");
    expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it("should handle manual unsubscribe", () => {
    const callback = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback);
    });

    pubSub.publish("test-channel");
    expect(callback).toHaveBeenCalledTimes(1);

    pubSub.unsubscribe("test-channel", callback);

    pubSub.publish("test-channel");
    expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it("should handle unsubscribe from non-existent channel", () => {
    const callback = vi.fn();

    expect(() => {
      pubSub.unsubscribe("non-existent", callback);
    }).not.toThrow();
  });

  it("should handle publish to non-existent channel", () => {
    expect(() => {
      pubSub.publish("non-existent");
    }).not.toThrow();
  });

  it("should prevent duplicate subscriptions", () => {
    const callback = vi.fn();

    // Subscribe twice with the same callback
    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback);
    });

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback);
    });

    pubSub.publish("test-channel");

    // Should only be called once despite double subscription
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle callback changes in useSubscribe", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender } = renderHook(
      ({ cb }) => {
        pubSub.useSubscribe("test-channel", cb);
      },
      { initialProps: { cb: callback1 } },
    );

    pubSub.publish("test-channel");
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    rerender({ cb: callback2 });

    pubSub.publish("test-channel");
    expect(callback1).toHaveBeenCalledTimes(1); // Should not be called again
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should handle channel changes in useSubscribe", () => {
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ channel }) => {
        pubSub.useSubscribe(channel, callback);
      },
      { initialProps: { channel: "channel-1" } },
    );

    pubSub.publish("channel-1");
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ channel: "channel-2" });

    pubSub.publish("channel-1");
    expect(callback).toHaveBeenCalledTimes(1); // Should not be called

    pubSub.publish("channel-2");
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should work with scoped registry", () => {
    const scopedRegistry = {};
    const scopedPubSub = createPubSub(scopedRegistry);
    const globalCallback = vi.fn();
    const scopedCallback = vi.fn();

    // Subscribe to global
    renderHook(() => {
      pubSub.useSubscribe("test-channel", globalCallback);
    });

    // Subscribe to scoped
    renderHook(() => {
      scopedPubSub.useSubscribe("test-channel", scopedCallback);
    });

    // Publish to global
    pubSub.publish("test-channel");
    expect(globalCallback).toHaveBeenCalledTimes(1);
    expect(scopedCallback).not.toHaveBeenCalled();

    // Publish to scoped
    scopedPubSub.publish("test-channel");
    expect(globalCallback).toHaveBeenCalledTimes(1);
    expect(scopedCallback).toHaveBeenCalledTimes(1);
  });

  it("should clean up properly when unsubscribing specific callback", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback1);
    });

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback2);
    });

    pubSub.unsubscribe("test-channel", callback1);

    pubSub.publish("test-channel");

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple unsubscribe calls gracefully", () => {
    const callback = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("test-channel", callback);
    });

    pubSub.unsubscribe("test-channel", callback);
    pubSub.unsubscribe("test-channel", callback); // Second call should not error

    pubSub.publish("test-channel");
    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle empty channel name", () => {
    const callback = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("", callback);
    });

    pubSub.publish("");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should maintain separate callback arrays for different channels", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    renderHook(() => {
      pubSub.useSubscribe("channel-1", callback1);
    });

    renderHook(() => {
      pubSub.useSubscribe("channel-2", callback2);
    });

    // Unsubscribe from channel-1 should not affect channel-2
    pubSub.unsubscribe("channel-1", callback1);

    pubSub.publish("channel-2");
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
