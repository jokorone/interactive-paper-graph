import React from 'react';

import mockData from './data/mock.json';
import { NetworkGraph, Node } from './lib';
import { SettingsContainer } from './components';

import { useTheme } from './util/theme';
import { useGraphSettings } from './util/graph-settings';
import { InteractionOutlet } from './components/overlays/interaction-outlet';
import { MarkdownContent } from './components/content/markdown-content';
import { useColors } from './util/colors';

function App() {
  const
    handleTheme = useTheme(),
    colors = useColors(handleTheme.theme),
    handleGraphSettings = useGraphSettings(),
    handleSettings = { ...handleTheme, ...handleGraphSettings };

  const
    [ highlight, setHighlight ] = React.useState<Node | null>(null),
    [ selected, setSelected ] = React.useState<Node | null>(null);

  const handlers = {

    onDrag: {
      dragstart: (node: Node) => {console.log('dragstart')},
      dragging: (node: Node) => {console.log('dragging')},
      dragstop: () => {console.log('dragstop')},
    },
    onPan: {
      panstart: () => {console.log('panstart')},
      panning: () => {console.log('panning')},
      panstop: () => {console.log('panstop')},
    },
    onZoom: {
      zoomstart: () => {console.log('zoomstart')},
      zooming: () => {console.log('zooming')},
      zoomstop: () => {console.log('zoomstop')},
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
      setSelected(target || null)
    },
  }

  const settings = {
    graph: handleSettings.graphSettings,
    paper: {
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
  }

  return (
    <div className="bg-gray-300 dark:bg-gray-800">
      {
        selected && <MarkdownContent selected={selected}/>
      }
      <InteractionOutlet highlight={highlight}/>
      <SettingsContainer {...handleSettings}/>

      <NetworkGraph
        data={mockData}
        config={{
          // canvas: {
          //   width:
          // },
          colors,
          graph: {
            updateSettings: handleSettings.updateGraphSetting,
            settings: settings.graph
          },
          paper: settings.paper
        }}
        handlers={{
          hover: { handle: handlers.onHover },
          pan: { use: 'paper', handle: handlers.onPan },
          click: { handle: handlers.onClick }
        }}
      />
    </div>
  );
}

export default App;
