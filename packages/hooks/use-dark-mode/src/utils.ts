/**
 * Adds a CSS class to an HTML element if it doesn't already exist.
 *
 * @param element The HTML element to add the class to
 * @param className The CSS class name to add
 */
export const addClassName = (element: HTMLElement, className: string) => {
  if (element.classList.contains(className)) return;

  element.classList.add(className);
};

/**
 * Removes a CSS class from an HTML element.
 *
 * @param element The HTML element to remove the class from
 * @param className The CSS class name to remove
 */
export const removeClassName = (element: HTMLElement, className: string) => {
  element.classList.remove(className);
};
