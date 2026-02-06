export const isOptionParamSupported = (): boolean => {
  let optionSupported = false;

  const fn = () => {};

  try {
    const opt = Object.defineProperty({}, "passive", {
      get: () => {
        optionSupported = true;

        return null;
      },
    });

    window.addEventListener("test", fn, opt);
    window.removeEventListener("test", fn, opt);
  } catch {
    return false;
  }

  return optionSupported;
};
