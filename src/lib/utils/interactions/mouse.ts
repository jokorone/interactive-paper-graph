import React from "react";
import Paper from "paper";

const MouseOptions = {
  radius: 5,
  fillColor: new Paper.Color('black'),
  opacity: .2
};

export const useMouse = () => {
  const mouse = React.useRef<paper.Path.Circle>();

  const createMouse = () => {
    mouse.current = new Paper.Path.Circle(MouseOptions);
  }

  const createMouseMoveHandler = (view: paper.View) => {
    return ({ x, y }: MouseEvent) => {
      mouse.current!.position = view.viewToProject(new Paper.Point(x, y));
    }
  }

  return { mouse, createMouse, createMouseMoveHandler }

}
