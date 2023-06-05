export type EventType = {
  id: number
  start: string
  duration: number
  end: string
  startDateTime: Date
  endDateTime: Date
  percentWidth?: number
  percentPositionX?: number
  overlapsEvents?: EventType[]
}

export type InputType = {
  id: number
  start: string
  duration: number
}
