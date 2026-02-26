/**
 * Hand-maintained TypeScript types derived from asyncapi.yaml.
 *
 * AsyncAPI 3.x codegen tooling is not yet mature enough for automated generation.
 * These types MUST be kept in sync with asyncapi.yaml manually.
 * See: packages/contracts/asyncapi.yaml
 */

export interface HealthPayload {
  status: 'ok' | 'degraded' | 'error'
  uptimeSeconds: number
  chartserver: {
    reachable: boolean
  }
  signalk: {
    reachable: boolean
    lastMessageAgeSeconds?: number
  }
  warnings: string[]
}

export interface WsMessage<T extends string, P> {
  type: T
  ts: string
  seq: number
  payload: P
}

export type HealthMessage = WsMessage<'health.system', HealthPayload>

/** Union of all incoming WebSocket message types */
export type AnyWsMessage = HealthMessage
