import type { Map } from 'maplibre-gl'

/**
 * OpenFreeMap vector tile style – free, no API key, full planet OSM data.
 * Used as base map during development (Mode E: online, no backend chartserver).
 *
 * https://openfreemap.org
 */
export const ONLINE_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/**
 * Adds OpenSeaMap seamark overlay on top of the loaded vector base map.
 * Must be called after the map 'load' event fires.
 */
export function addOpenSeaMapOverlay(map: Map): void {
  map.addSource('openseamap', {
    type: 'raster',
    tiles: ['https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution: '© <a href="https://www.openseamap.org" target="_blank">OpenSeaMap</a>',
    maxzoom: 18,
  })
  map.addLayer({
    id: 'openseamap',
    type: 'raster',
    source: 'openseamap',
    paint: { 'raster-opacity': 1 },
  })
}
