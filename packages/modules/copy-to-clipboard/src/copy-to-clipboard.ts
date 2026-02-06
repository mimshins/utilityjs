/**
 * Fallback method to copy text to clipboard using the deprecated `execCommand` API.
 * Creates a temporary textarea element, selects its content, and executes the copy command.
 *
 * @param value The text to copy to clipboard
 */
const fallbackCopy = async (value: string): Promise<void> => {
  const tempTextArea = document.createElement("textarea");

  tempTextArea.value = value;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  await Promise.resolve();
};

/**
 * Copies text to the clipboard using the modern Clipboard API with fallback support.
 * Attempts to use `navigator.clipboard.writeText()` first, and falls back to
 * the legacy `execCommand` method if the Clipboard API is unavailable.
 *
 * @param value The text to copy to clipboard
 * @returns A promise that resolves when the text is successfully copied
 *
 * @example
 * ```typescript
 * // Copy text to clipboard
 * await copyToClipboard('Hello, World!');
 *
 * // With error handling
 * try {
 *   await copyToClipboard('Some text');
 *   console.log('Copied successfully!');
 * } catch (error) {
 *   console.error('Failed to copy:', error);
 * }
 * ```
 */
export const copyToClipboard = async (value: string): Promise<void> => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      throw new Error(
        "[@utilityjs/copy-to-clipboard]: `writeText` is not supported.",
      );
    }
  } catch {
    await fallbackCopy(value);
  }
};
