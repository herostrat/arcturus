import { useMapInteraction } from '../../store/map-interaction.js'
import { FloatingInfoPanel } from './FloatingInfoPanel.js'
import { InspectContent } from './InspectContent.js'
import { InspectGroupContent } from './InspectGroupContent.js'

export function SelectedFeatureOverlay() {
  const { selectedFeature, inspectResult, clearSelection, clearInspect } = useMapInteraction()

  if (inspectResult) {
    return (
      <FloatingInfoPanel title="Inspektion" onClose={clearInspect}>
        <InspectGroupContent result={inspectResult} />
      </FloatingInfoPanel>
    )
  }

  if (selectedFeature) {
    return (
      <FloatingInfoPanel title="Objekt-Info" onClose={clearSelection}>
        <InspectContent feature={selectedFeature} />
      </FloatingInfoPanel>
    )
  }

  return null
}
