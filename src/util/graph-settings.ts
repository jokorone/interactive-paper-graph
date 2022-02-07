import React from "react"

import { DefaultGraphSettings } from "../lib"


export const useGraphSettings = () => {
  const [
    graphSettings,
    _setGraphSettings
  ] = React.useState<typeof DefaultGraphSettings>(DefaultGraphSettings);

  const updateGraphSetting = (
    key: keyof typeof DefaultGraphSettings,
    value: number
  ) => _setGraphSettings(settings => ({
    ...settings,
    [key]: value
  }));

  return { graphSettings, updateGraphSetting };
}
