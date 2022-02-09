import React from "react"

import { SimulationSettings, useGraphSettings } from "../lib"

const initialSimulationSettings = {
  chargeForceStrength: -120,
  chargeDistanceMin: 1,
  chargeDistanceMax: 420,
  collideRadius: 5,
  collideStrength: 0,
  linkDistance: 35,
  forceX: Math.floor(window.innerWidth * .65),
  forceY: Math.floor(window.innerHeight * .5),
}

export const useSimulationSettings = () => {
  // const [
  //   simulationSettings,
  //   _setSimulationSettings
  // ] = React.useState<SimulationSettings>(initialSimulationSettings);

  // const updateGraphSetting = (
  //   key: keyof SimulationSettings,
  //   value: number
  // ) => _setSimulationSettings(settings => ({
  //   ...settings,
  //   [key]: value
  // }));



  return useGraphSettings();
}
