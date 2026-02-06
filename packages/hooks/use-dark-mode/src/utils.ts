export const addClassName = (element: HTMLElement, className: string) => {
  if (element.classList.contains(className)) return;

  element.classList.add(className);
};

export const removeClassName = (element: HTMLElement, className: string) => {
  element.classList.remove(className);
};
