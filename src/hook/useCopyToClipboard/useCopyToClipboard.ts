import * as React from "react";

const copyText = (text: string): Promise<void> => {
  // Uses the Async Clipboard API when available
  if (navigator.clipboard) return navigator.clipboard.writeText(text);

  // Fallback to old depricated API
  return (() => {
    const dummy = document.createElement("span");
    dummy.textContent = text;
    dummy.style.whiteSpace = "pre";

    document.body.appendChild(dummy);

    const selection = window.getSelection();

    if (!selection) return Promise.reject();

    const range = window.document.createRange();

    selection.removeAllRanges();
    range.selectNode(dummy);
    selection.addRange(range);

    try {
      window.document.execCommand("copy");
    } catch (err) {
      return Promise.reject();
    }

    selection.removeAllRanges();
    document.body.removeChild(dummy);

    return Promise.resolve();
  })();
};

const useCopyToClipboard = (): ((text: string) => Promise<boolean>) => {
  return React.useCallback(async (text: string) => {
    try {
      await copyText(text);
      return true;
    } catch {
      if (navigator.clipboard) {
        // eslint-disable-next-line no-console
        console.error(
          "[@utilityjs/use-copy-to-clipboard]: The caller does not have permission to write to the clipboard!"
        );
      }
      return false;
    }
  }, []);
};

export default useCopyToClipboard;
