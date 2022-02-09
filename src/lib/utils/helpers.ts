export function cancelEvent(e: Event) {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();
}
