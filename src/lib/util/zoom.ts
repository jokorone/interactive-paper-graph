import Paper from 'paper';

export class PanAndZoom {

  changeZoom(oldZoom: number, delta: number) {
    let factor = 1.05
    if (delta < 0)
      return oldZoom * factor
    if (delta > 0)
      return oldZoom / factor

    return oldZoom
  }

  changeCenter(oldCenter: paper.Point, deltaX: number, deltaY: number, factor: number) {

    let offset = new Paper.Point(deltaX, -deltaY).multiply(factor);
    return oldCenter.add(offset);

  }

  // # Compute the new zoom factor such that a given fixedPoint $p$ is unchanged.
  // # `oldZoom` is the current zoom factor, `delta` gives how much the mousewheel was turned
  // # $c$ is the old view center. We use the paper.js methods for computing with points (vectors).
  // changeZoom: (oldZoom, delta, c, p) ->
  //   newZoom = super oldZoom, delta
  //   beta = oldZoom / newZoom
  //   pc = p.subtract c
  //   a = p.subtract(pc.multiply(beta)).subtract c
  //   [newZoom, a]

  _changeZoom(oldZoom: number, delta: number, c: number, p: number) {
    let newZoom = oldZoom ** delta
  }

}
