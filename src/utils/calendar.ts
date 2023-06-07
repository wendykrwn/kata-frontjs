import { EventType, InputType, MatrixEventType } from "../types/calendar"

export const FIRSTCALENDARHOURS = 9
export const LASTCALENDARHOURS = 21

export const parseDateHours = (date: Date) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

export const parseEvent = (inputs: InputType[]) => {
  const events: EventType[] = []

  inputs.map((input) => {
    const end = getEnd(input.start, input.duration)

    events.push({
      ...input,
      end,
      overlapsEvents: [],
    })
    events.push()
    return input
  })

  return events
}

export const sortByStartAndEndTime = (inputs: InputType[]) => {
  const inputParsed = parseEvent(inputs)
  inputParsed.sort((inputA, inputB) => {
    const { start: startDateTimeA, end: endDateTimeA } = inputA
    const { start: startDateTimeB, end: endDateTimeB } = inputB

    if (startDateTimeA < startDateTimeB) return -1
    else if (startDateTimeA > startDateTimeB) return 1
    else if (endDateTimeA > endDateTimeB) return -1
    else if (endDateTimeA < endDateTimeB) return 1
    else return 0
  })

  return inputParsed
}

export const parseHourToDate = (hour: string) => {
  const [hours, mins] = hour.split(":").map(Number)
  return new Date(0, 0, 0, hours, mins)
}
export const getEnd = (start: string, duration: number) => {
  const date = parseHourToDate(start)
  date.setMinutes(date.getMinutes() + duration)
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

export const getPositionEventPercent = (start: string) => {
  const startDateTime = parseHourToDate(start)
  const startHours = startDateTime.getHours() + startDateTime.getMinutes() / 60

  return (
    ((startHours - FIRSTCALENDARHOURS) /
      (LASTCALENDARHOURS - FIRSTCALENDARHOURS)) *
    100
  )
}

export const getHeightEventPercent = (duration: number) => {
  return ((duration / 60) * 100) / (LASTCALENDARHOURS - FIRSTCALENDARHOURS)
}

const setRowsMatrix = (events: EventType[]) => {
  const matrixOneColumn: MatrixEventType = {}

  events.forEach((event) => {
    const { start, end } = event
    matrixOneColumn[start] = []
    matrixOneColumn[end] = []
  })

  return matrixOneColumn
}

const putEventInRowsMatrix = (matrix: MatrixEventType, events: EventType[]) => {
  const hours = Object.keys(matrix)
  hours.sort()

  for (const hour of hours) {
    events.forEach((event) => {
      if (hour < event.end && hour >= event.start) {
        matrix[hour].push(event)
      }
    })
  }
}

const countOverlapsMax = (
  matrix: MatrixEventType,
  event: EventType,
  renderingEvent: EventType[]
) => {
  const hours = Object.keys(matrix).sort()
  event.overlapsMax = 0
  for (const hour of hours) {
    if (matrix[hour].includes(event)) {
      let overlapsLength = matrix[hour].length

      if (event.overlapsMax < overlapsLength) {
        event.overlapsMax = matrix[hour].length
      }

      if (!event.overlapsEvents || event.overlapsEvents?.length === 0)
        event.overlapsEvents = matrix[hour]
      else
        event.overlapsEvents = [
          ...new Set([...event.overlapsEvents, ...matrix[hour]]),
        ]
    }
  }

  setWidthAdPositionOfOneEvent(event, renderingEvent)
}

const setWidthAdPositionOfOneEvent = (
  event: EventType,
  renderingEvents: EventType[]
) => {
  let widthMax = 100
  let posX = 0
  const overlapsEvents = event.overlapsEvents
  const indexOfEvent = overlapsEvents?.findIndex(
    (overlasped) => overlasped.id === event.id
  )

  if (event.overlapsMax)
    overlapsEvents?.forEach((overlapsed, index) => {
      if (renderingEvents.includes(overlapsed) && index !== indexOfEvent) {
        widthMax -= overlapsed.percentWidth || 0
        if (event.overlapsMax) event.overlapsMax--
      }
    })

  let eventWidth = widthMax / (event.overlapsMax ?? 1)

  if (overlapsEvents) {
    ;[...overlapsEvents]
      .filter((overlapsed) => renderingEvents.includes(overlapsed))
      .sort((overlapsedA, overlapsedB) => {
        if (
          overlapsedA.percentPositionX === undefined ||
          overlapsedB.percentPositionX === undefined
        ) {
          return 0
        } else {
          return overlapsedA.percentPositionX - overlapsedB.percentPositionX
        }
      })
      .find((overlapsed) => {
        if (
          overlapsed.percentPositionX &&
          overlapsed.percentPositionX !== posX
        ) {
          if (
            overlapsed.percentPositionX &&
            posX + eventWidth > overlapsed.percentPositionX
          ) {
            eventWidth = 100 - overlapsed.percentPositionX - posX
          }
          return true
        } else {
          posX += overlapsed.percentWidth || 0
          return false
        }
      })
  }

  if (event.overlapsMax) {
    event.percentWidth = eventWidth

    event.percentPositionX = posX

    renderingEvents.push(event)
  }
}

const setWidthAndPositionEvents = (
  matrix: MatrixEventType,
  events: EventType[],
  renderingEvents: EventType[]
) => {
  const hours = Object.keys(matrix)
  hours.sort()

  events.forEach((event) => {
    countOverlapsMax(matrix, event, renderingEvents)
  })
}

export const buildMatrix = (inputs: InputType[]): EventType[] => {
  const events: EventType[] = sortByStartAndEndTime(inputs)
  const renderingEvents: EventType[] = []

  const matrix = setRowsMatrix(events)

  putEventInRowsMatrix(matrix, events)

  setWidthAndPositionEvents(matrix, events, renderingEvents)

  return renderingEvents
}