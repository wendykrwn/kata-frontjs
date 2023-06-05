import { EventType, InputType } from "../types/calendar"

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
  return `${
    date.getHours() < 10 ? "0" : ""
  }${date.getHours()}:${date.getMinutes()}`
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

export const getWidthEventPercent = (inputs: InputType[]) => {
  const eventSorted: EventType[] = sortByStartAndEndTime(inputs)

  console.log({ eventSorted })

  if (eventSorted?.length > 0) {
    eventSorted[0].percentWidth = 100
    eventSorted[0].overlapsEvents = []
    eventSorted[0].percentPositionX = 0

    for (let i = 1; i < eventSorted.length; i++) {
      const currentEvent = eventSorted[i]
      // Liste des events qui overlaps avec eventSorted[j]
      const overlapsEvents = [...eventSorted]
        .splice(0, i)
        ?.filter((event) => isOverlap(event, currentEvent))

      currentEvent.overlapsEvents = [...overlapsEvents]

      // console.log({ eventSorted, overlapsEventToTheNext: overlapsEvents })
      const numberOfoverlapsEvent = overlapsEvents.length

      if (numberOfoverlapsEvent == 0) {
        currentEvent.percentWidth = 100
        currentEvent.percentPositionX = 0
      } else {
        const percentWidth = 100 / (numberOfoverlapsEvent + 1)
        currentEvent.percentWidth = percentWidth
        let eventWidthPercent = 100

        const eventsOverlapsArePlaced = currentEvent.overlapsEvents?.find(
          (val, index) =>
            val.percentWidth &&
            val.percentPositionX !== index * val.percentWidth
        )
        overlapsEvents.forEach((event, index) => {
          if (event.overlapsEvents)
            event.overlapsEvents = [...event.overlapsEvents, currentEvent]
          console.log({ CURRENT: currentEvent })
          if (event.percentWidth) {
            if (event.percentWidth >= percentWidth) {
              console.log({ eventsOverlapsArePlaced, event })
              if (eventsOverlapsArePlaced) {
                let posX = 0

                for (
                  let index = 0;
                  event.overlapsEvents?.length &&
                  i < event.overlapsEvents?.length;
                  i++
                ) {
                  if (event.overlapsEvents[index].percentPositionX !== posX) {
                    currentEvent.percentWidth = posX
                    break
                  }
                  posX += event.overlapsEvents[index].percentWidth || 0
                }
              } else {
                event.overlapsEvents?.forEach((eventOverlapsed, index) => {
                  eventOverlapsed.percentPositionX = index * percentWidth
                })
                currentEvent.percentPositionX = 100 - percentWidth
              }

              event.percentWidth = percentWidth
            } else {
              eventWidthPercent -= event.percentWidth
            }
          }

          event?.overlapsEvents?.push(currentEvent)
        })

        if (eventWidthPercent < 100) {
          currentEvent.percentWidth = eventWidthPercent

          let posX = 0
          let event: EventType
          for (const index in currentEvent.overlapsEvents) {
            if (currentEvent.overlapsEvents[index].percentPositionX != posX) {
              currentEvent.percentWidth = posX
              break
            }
            posX += currentEvent.overlapsEvents[index].percentWidth || 0
          }

          currentEvent.percentPositionX = posX
        }
      }
    }
  }

  return eventSorted
}

// export const getPositionEventX = (event: EventType) => {
//   if (!event.overlapsEvents || event.overlapsEvents?.length == 0)
//     return 0
//   else {
//     const overlapsSorted = [...event.overlapsEvents, event].sort((eventA, eventB) => {
//       if(eventA.endDateTime )
//     })
//   }
// }
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
