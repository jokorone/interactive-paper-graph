import { SettingsContainer } from './components';
import { NetworkGraph, useSettings } from './lib';
import mockData from './data/mock.json';
import testData from './data/test.json';

function App() {
  const interactionHandlers = {
    onDrag: {
      start: () => {console.log('start')},
      observe: () => {console.log('observe')},
      stop: () => {console.log('end')},
    },
  }
  const settings = useSettings({ interactionHandlers });

  return (
    <div className="p-0 m-0 bg-gray-300 dark:bg-gray-800">
      <SettingsContainer {...settings} />
      <NetworkGraph data={mockData} options={settings}/>
    </div>
  );
}

export default App;
