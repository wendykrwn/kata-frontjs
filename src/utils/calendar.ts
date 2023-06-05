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

const isOverlap = (inputA: EventType, inputB: EventType) => {}

export const getHeightEventPercent = (
  firstCalendarHours: number,
  lastCalendarHours: number,
  duration: number
) => {
  // end - start => 100%, duration / 60 => ?
  return ((duration / 60) * 100) / (lastCalendarHours - firstCalendarHours)
}
