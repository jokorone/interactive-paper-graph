import React from "react";

import { ThemeContext } from "./theme";
import { PaperColors, ThemedColors } from "../defaults/colors";

export const useThemedColors = () => {
  const theme = React.useContext(ThemeContext);

  const hexColors = ThemedColors[theme];
  const paperColors = PaperColors[theme];

  paperColors.accent.alpha = .9;
  paperColors.highlight.saturation = 1;
  paperColors.primary.alpha = .9;

  return {
    hexColors,
    paperColors,
  };
}
