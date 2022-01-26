import React from 'react';

import mockData from './data/mock.json';
import testData from './data/test.json';

import { NetworkGraph, Node, NetworkGraphSettingsConfig } from './lib';

import { SettingsContainer } from './components';

import { Theme, useTheme } from './util/theme';
import { useGraphSettings } from './util/graph-settings';


const AppColors = {
  ['dark' as Theme]: {
    canvas: '#2c2b2c',
    items: '#d6d3d1'
  },
  ['light' as Theme]: {
    canvas: '#d6d3d1',
    items: '#2c2b2c'
  }
}

function App() {
  const handleTheme = useTheme(),
        handleGraphSettings = useGraphSettings(),
        handleSettings = { ...handleTheme, ...handleGraphSettings };

  const handlers = {
    onDrag: {
      start: (node: Node) => {console.log(node)},
      observe: (node: Node) => {console.log('observe', node.id)},
      stop: () => {console.log('end')},
    },
    onHover: {
      call: (node: Node) => console.log(node.id)
    },
    onZoom: {},
    onPan: {},
  }

  const settings = {
    colors: AppColors[handleTheme.theme],
    handlers,
    simulation: handleGraphSettings.graphSettings,
    items: {
      node: {
        radius: 4,
        opacity: .7,
        highlight: {
          radius: 5,
          opacity: 1
        }
      },
      links: {
        stroke: 1,
        opacity: .5,
        highlight: {
          stroke: 1.5,
          opacity: .9
        }
      },
      label: {
        show: false
      }
    }
  } as NetworkGraphSettingsConfig;


  return (
    <div className="p-0 m-0 bg-gray-300 dark:bg-gray-800">
      <SettingsContainer {...handleSettings}/>
      <NetworkGraph data={mockData} config={settings} />
    </div>
  );
}

export default App;
