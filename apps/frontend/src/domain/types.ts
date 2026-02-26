/**
 * Domain type aliases – derived from @arcturus/contracts (SSOT).
 * The rest of the app imports from here, not directly from contracts.
 */
import type { components } from '@arcturus/contracts'

export type Waypoint = components['schemas']['Waypoint']
export type Route = components['schemas']['Route']
export type SystemStatus = components['schemas']['SystemStatus']
export type SyncManifest = components['schemas']['SyncManifest']
export type SyncPushRequest = components['schemas']['SyncPushRequest']
export type SyncPushResponse = components['schemas']['SyncPushResponse']
export type SyncPullResponse = components['schemas']['SyncPullResponse']
