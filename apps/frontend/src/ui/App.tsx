import { MapProvider } from '../context/MapContext.js'
import { AppLayout } from './layout/AppLayout.js'
import { TopBar } from './layout/TopBar.js'
import { InstrumentPanel } from './layout/InstrumentPanel.js'
import { MapView } from './map/MapView.js'
import { MapInteractionLayer } from './map/MapInteractionLayer.js'

export function App() {
  return (
    <MapProvider>
      <AppLayout
        topBar={<TopBar />}
        map={<MapView />}
        instrumentPanel={<InstrumentPanel />}
        overlays={<MapInteractionLayer />}
      />
    </MapProvider>
  )
}
