export interface EventType {
  id: number
  start: string
  duration: number
  end: string
  startDateTime: Date
  endDateTime: Date
  percentWidth?: number
  percentPositionX?: number
  overlapsEvents?: EventType[]
  overlapsMax?: number
}

export interface InputType {
  id: number
  start: string
  duration: number
}

export type MatrixEventType = {
  [hour: string]: EventType[]
}
