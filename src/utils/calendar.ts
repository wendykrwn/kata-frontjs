import { EventType, InputType, MatrixEventType } from "../types/calendar"

export const FIRSTCALENDARHOURS = 9
export const LASTCALENDARHOURS = 21
export const parseTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":")
  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

export const getEndEvent = (start: string, duration: number) => {
  const startEvent = parseTime(start)

  const endEvent = new Date(startEvent)
  endEvent.setMinutes(endEvent.getMinutes() + duration)

  return endEvent
}

export const parseDateHours = (date: Date) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

export const parseEvent = (inputs: InputType[]) => {
  const events: EventType[] = []

  inputs.map((input) => {
    const startDateTime = parseTime(input.start),
      endDateTime = getEndEvent(input.start, input.duration),
      end = parseDateHours(endDateTime)

    events.push({
      ...input,
      startDateTime,
      endDateTime,
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
    const { startDateTime: startDateTimeA, endDateTime: endDateTimeA } = inputA
    const { startDateTime: startDateTimeB, endDateTime: endDateTimeB } = inputB

    if (startDateTimeA < startDateTimeB) return -1
    else if (startDateTimeA > startDateTimeB) return 1
    else if (endDateTimeA > endDateTimeB) return -1
    else if (endDateTimeA < endDateTimeB) return 1
    else return 0
  })

  return inputParsed
}

const isOverlap = (inputA: EventType, inputB: EventType) => {
  const { startDateTime: startDateTimeA, endDateTime: endDateTimeA } = inputA
  const { startDateTime: startDateTimeB, endDateTime: endDateTimeB } = inputB
  if (
    (startDateTimeA < endDateTimeB && endDateTimeA > startDateTimeB) ||
    (startDateTimeB < endDateTimeA && endDateTimeB > startDateTimeA)
  ) {
    return true
  } else return false
}

export const getEnd = (start: string, duration: number) => {
  const [hours, mins] = start.split(":").map(Number)
  const date = new Date(0, 0, 0, hours, mins)
  date.setMinutes(date.getMinutes() + duration)
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

export const getPositionEventPercent = (startDateTime: Date) => {
  const startHours = startDateTime.getHours() + startDateTime.getMinutes() / 60

  return (
    ((startHours - FIRSTCALENDARHOURS) /
      (LASTCALENDARHOURS - FIRSTCALENDARHOURS)) *
    100
  )
}

export const getHeightEventPercent = (duration: number) => {
  // end - start => 100%, duration / 60 => ?
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

// count overlapsmax to the right
const countOverlapsMax = (
  matrix: MatrixEventType,
  event: EventType,
  renderingEvent: EventType[]
) => {
  const hours = Object.keys(matrix)
  hours.sort()
  event.overlapsMax = 0
  for (const hour of hours) {
    if (matrix[hour].includes(event)) {
      let overlapsLength = matrix[hour].length

      // on rajoute le tableau dans overlapsMax
      if (event.overlapsMax < overlapsLength) {
        event.overlapsMax = matrix[hour].length
      }

      if (!event.overlapsEvents || event.overlapsEvents?.length == 0)
        event.overlapsEvents = matrix[hour]
      else
        event.overlapsEvents = [
          ...new Set([...event.overlapsEvents, ...matrix[hour]]),
        ]
    }
  }

  setWidthOfOneEvent(event, renderingEvent)
}

// chercher si les autres chevauchement ont déjà une taille et une position

const setWidthOfOneEvent = (
  event: EventType,
  renderingEvents: EventType[]
  // widthMax = 100
) => {
  let widthMax = 100
  let posX = 0
  const overlapsEvents = event.overlapsEvents
  const indexOfEvent = overlapsEvents?.findIndex(
    (overlasped) => overlasped.id == event.id
  )

  if (event.overlapsMax)
    // Calculer le width restant
    overlapsEvents?.map((overlapsed, index) => {
      if (renderingEvents.includes(overlapsed) && index !== indexOfEvent) {
        widthMax -= overlapsed.percentWidth || 0
        if (event.overlapsMax) event.overlapsMax--
      }
    })

  // position
  // trouver le premier endroit pas encore placé de gauche à droite

  let eventWidth = widthMax / (event.overlapsMax ?? 1)

  if (overlapsEvents) {
    const overlapsEventsCopy = [...overlapsEvents]
      .filter((overlapsed) => renderingEvents.includes(overlapsed))
      .sort((overlapsedA, overlapsedB) => {
        if (
          overlapsedA.percentPositionX == undefined ||
          overlapsedB.percentPositionX == undefined
        ) {
          return 0
        } else {
          return overlapsedA.percentPositionX - overlapsedB.percentPositionX
        }
      })
      .find((overlapsed, index, overlapsEventSorted) => {
        if (
          overlapsed.percentPositionX &&
          overlapsed.percentPositionX != posX
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
    // taille
    event.percentWidth = eventWidth

    // position
    event.percentPositionX = posX

    renderingEvents.push(event)
  }
}

const setWidthEvents = (
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

  setWidthEvents(matrix, events, renderingEvents)

  return renderingEvents
}