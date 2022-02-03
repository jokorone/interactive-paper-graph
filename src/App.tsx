import React from 'react';

import mockData from './data/mock.json';
import testData from './data/test.json';

import { NetworkGraph, Node, NetworkGraphSettingsConfig } from './lib';

import { SettingsContainer } from './components';

import { Theme, useTheme } from './util/theme';
import { useGraphSettings } from './util/graph-settings';
import { InteractionOutlet } from './components/overlays/interaction-outlet';
import { MarkdownContent } from './components/content/markdown-content';


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
  const
    handleTheme = useTheme(),
    handleGraphSettings = useGraphSettings(),
    handleSettings = { ...handleTheme, ...handleGraphSettings };

  const
    [ highlight, setHighlight ] = React.useState<Node | null>(null),
    [ selected, setSelected ] = React.useState<Node | null>(null);

  const handlers = {
    onDrag: {
      start: (node: Node) => {},
      observe: (node: Node) => {},
      stop: () => {},
    },
    onHover: (target: Node | undefined) => {
      Promise.resolve().then(() => {
        if (target && target.id !== highlight?.id) {
          setHighlight(target)
        }
        if (!target?.id && !highlight) {
          setHighlight(null)
        }
      });
    },
    onClick: (pos: [number, number], target?: Node) => {
      if (target) {
        setSelected(target)
      };
    }
  }

  const settings = {
    colors: AppColors[handleTheme.theme],
    handlers,
    simulation: handleGraphSettings.graphSettings,
    items: {
      node: {
        radius: 4,
        opacity: .8,
        highlight: {
          radius: 5.5,
          opacity: 1
        }
      },
      links: {
        stroke: 1,
        opacity: .6,
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
    <div className=" p-0 m-0 bg-gray-300 dark:bg-gray-800">
      {/* {
        selected && <MarkdownContent selected={selected}/>
      } */}
      <InteractionOutlet highlight={highlight}/>
      <SettingsContainer {...handleSettings}/>
      <NetworkGraph data={mockData} config={settings} />
    </div>
  );
}

export default App;
