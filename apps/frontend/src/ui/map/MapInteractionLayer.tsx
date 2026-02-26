import { useMap } from '../../context/MapContext.js'
import { MapInteractionManager } from './MapInteractionManager.js'
import { SelectedFeatureOverlay } from '../panels/SelectedFeatureOverlay.js'
import { MapContextMenu } from '../context-menu/MapContextMenu.js'

/**
 * Mounts interaction logic and overlays once the map is ready.
 * Placed inside the overlayLayer so overlays have correct z-stacking.
 */
export function MapInteractionLayer() {
  const map = useMap()

  return (
    <>
      {map && <MapInteractionManager map={map} />}
      <SelectedFeatureOverlay />
      <MapContextMenu />
    </>
  )
}
