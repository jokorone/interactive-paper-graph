export function cancelEvent(e: Event) {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();
}

type Position = { x: number, y: number };

export function distanceBetween(p0: Position, p1: Position): number {
  const dx = p1.x - p0.x,
        dy = p1.y - p0.y;

  return Math.sqrt(dx * dx + dy * dy);
}
