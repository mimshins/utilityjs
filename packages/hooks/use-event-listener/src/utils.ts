/**
 * Checks if the browser supports the options parameter for addEventListener.
 *
 * This function tests whether the browser supports passing an options object
 * (with properties like passive, capture, once) to addEventListener, rather than
 * just a boolean for the capture parameter.
 *
 * @returns True if options parameter is supported, false otherwise
 */
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
