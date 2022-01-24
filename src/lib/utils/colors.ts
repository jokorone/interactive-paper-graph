import React from "react";

import { PaperColors, ThemedColors } from "../defaults/colors";
import { SettingsContext } from "./settings";

export const useThemedColors = () => {
  const { settings: { theme } } = React.useContext(SettingsContext);

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
