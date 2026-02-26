import Dexie, { type EntityTable } from 'dexie'
import type { Waypoint, Route } from '../../domain/types.js'

export interface OutboxEntry {
  id?: number
  entityType: 'waypoint' | 'route'
  entityId: string
  operation: 'upsert' | 'delete'
  payload: Waypoint | Route
  createdAt: string
  attempts: number
}

export interface SyncStateEntry {
  key: string
  value: string
}

export interface SettingsEntry {
  key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

type ArcturusDB = Dexie & {
  waypoints: EntityTable<Waypoint, 'id'>
  routes: EntityTable<Route, 'id'>
  outbox: EntityTable<OutboxEntry, 'id'>
  syncState: EntityTable<SyncStateEntry, 'key'>
  settings: EntityTable<SettingsEntry, 'key'>
}

const db = new Dexie('arcturus') as ArcturusDB

db.version(1).stores({
  waypoints: 'id, name, revision, updatedAt, deletedAt',
  routes: 'id, name, revision, updatedAt, deletedAt',
  outbox: '++id, entityType, entityId, createdAt',
  syncState: 'key',
  settings: 'key',
})

export { db }
