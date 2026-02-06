const fallbackCopy = async (value: string): Promise<void> => {
  const tempTextArea = document.createElement("textarea");

  tempTextArea.value = value;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  await Promise.resolve();
};

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
