import { Input } from "../types/calendar"

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

export const sortByStartAndEndTime = (inputs: Input[]) => {
  inputs.sort((inputA, inputB) => {
    const startA = parseTime(inputA.start)
    const startB = parseTime(inputB.start)
    const endA = getEndEvent(inputA.start, inputA.duration)
    const endB = getEndEvent(inputB.start, inputB.duration)

    if (startA < startB) return -1
    else if (startA > startB) return 1
    else if (endA > endB) return -1
    else if (endA < endB) return 1
    else return 0
  })

  return inputs
}

export const getHeightEventPercent = (
  firstCalendarHours: number,
  lastCalendarHours: number,
  duration: number
) => {
  // end - start => 100%, duration / 60 => ?
  return ((duration / 60) * 100) / (lastCalendarHours - firstCalendarHours)
}
