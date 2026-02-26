import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { InspectedSourceGroup } from '../../store/map-interaction.js'

const INSPECT_RADIUS = 6 // px

/** Returns a [[x0,y0],[x1,y1]] bounding box around a screen point. */
export function inspectBbox(
  x: number,
  y: number,
): [[number, number], [number, number]] {
  return [
    [x - INSPECT_RADIUS, y - INSPECT_RADIUS],
    [x + INSPECT_RADIUS, y + INSPECT_RADIUS],
  ]
}

/** Derive a human-readable label from a feature's properties. */
function featureLabel(f: MapGeoJSONFeature): string {
  const p = f.properties ?? {}
  // Priority: localized name → name → class → subclass → type → layer id
  const name =
    p['name:de'] ??
    p['name:en'] ??
    p['name'] ??
    p['class'] ??
    p['subclass'] ??
    p['type'] ??
    null
  return name != null ? String(name) : f.layer.id
}

/**
 * Groups MapLibre features by their source id.
 * Deduplicates identical labels within the same source.
 */
export function groupFeaturesBySource(
  features: MapGeoJSONFeature[],
): InspectedSourceGroup[] {
  const map = new Map<string, Map<string, { layerId: string; properties: Record<string, unknown> }>>()

  for (const f of features) {
    const sourceId = f.layer.source as string
    if (!map.has(sourceId)) map.set(sourceId, new Map())
    const byLabel = map.get(sourceId)!
    const label = featureLabel(f)
    // Keep first occurrence per label (top-most feature wins)
    if (!byLabel.has(label)) {
      byLabel.set(label, {
        layerId: f.layer.id,
        properties: (f.properties ?? {}) as Record<string, unknown>,
      })
    }
  }

  return Array.from(map.entries()).map(([sourceId, byLabel]) => ({
    sourceId,
    items: Array.from(byLabel.entries()).map(([label, meta]) => ({
      layerId: meta.layerId,
      label,
      properties: meta.properties,
    })),
  }))
}
