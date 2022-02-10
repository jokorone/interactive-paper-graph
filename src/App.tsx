import React from 'react';

import mockData from './data/mock.json';
import { NetworkGraph, Node, useGraphSettings } from './lib';
import { SettingsContainer } from './components';

import { useTheme } from './util/theme';
import { InteractionOutlet } from './components/overlays/interaction-outlet';
import { MarkdownContent } from './components/content/markdown-content';
import { useColors } from './util/colors';


const dataset = (size = 1) => {

  let n: typeof mockData.nodes = [];
  let l: typeof mockData.links = [];

  for (let i = 0; i < size; i++) {
    mockData.nodes.forEach((node) => {
      n.push({ ...node, id: `${node.id}_${i}` });
    });

    mockData.links.forEach((link) => {
      l.push({ ...link, source: `${link.source}_${i}`, target: `${link.target}_${i}` })
    });
  }

  return {
    nodes: [...n],
    links: [...l],
  }
};


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

function App() {
  const
    theme = useTheme(),
    colors = useColors(theme.theme),
    simulationSettings = useGraphSettings(initialSimulationSettings),
    settingsHandler = { ...theme, ...simulationSettings };

  const
    [ highlight, setHighlight ] = React.useState<Node | null>(null),
    [ selected, setSelected ] = React.useState<Node | null>(null);

  const
    onDrag = {
      dragstart: (node: Node) => {console.log('dragstart')},
      dragging: (node: Node) => {console.log('dragging')},
      dragstop: () => {console.log('dragstop')},
    },
    onPan = {
      panstart: () => {console.log('panstart')},
      panning: () => {console.log('panning')},
      panstop: () => {console.log('panstop')},
    },
    onZoom = {
      zoomstart: () => {console.log('zoomstart')},
      zooming: () => {console.log('zooming')},
      zoomstop: () => {console.log('zoomstop')},
    },
    onHover = (target: Node | undefined) => {
      if (target && target.id !== highlight?.id) {
        setHighlight(target);
      }
      if (!target?.id && !highlight) {
        setHighlight(null);
      }
    },
    onClick = (pos: [number, number], target?: Node) => {
      setSelected(target || null);
    };

  const settings = {
    graph: simulationSettings.simulationSettings,
    paper: {
      node: {
        radius: 4,
        opacity: .8,
        // highlight: {
        //   radius: 5.5,
        //   opacity: 1
        // }
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
    <div className="bg-gray-300 dark:bg-gray-800 h-screen w-screen">
    {
        selected && <MarkdownContent selected={selected}/>
      }
      <InteractionOutlet highlight={highlight}/>
      <SettingsContainer {...settingsHandler}/>

      <NetworkGraph
        data={dataset()}
        config={{
          bounds: {
            resize: true
          },
          colors,
          graph: {
            settings: settings.graph
          },
          paper: settings.paper
        }}
        handlers={{
          hover: { handle: onHover },
          pan:   { handle: onPan },
          click: { handle: onClick },
          drag:  { handle: onDrag }
        }}
      />
    </div>
  );
}

export default App;
