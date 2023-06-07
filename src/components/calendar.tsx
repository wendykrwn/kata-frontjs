import styles from "../styles/calendar.module.css"
import inputs from "../data/input.json"
import Event from "./event"
import { useEffect, useState } from "react"
import { sortByStartAndEndTime, FIRSTCALENDARHOURS, LASTCALENDARHOURS, getPositionEventPercent, parseTime, buildMatrix } from "../utils/calendar"
import { EventType } from "../types/calendar"

const Calendar = () => {

  const [events, setEvents] = useState<EventType[]>([])
  
  useEffect(() => {
    const events =  buildMatrix(inputs)
    if (events?.length > 0)
      setEvents(events)
    
  }, [inputs])

  const numbersOfLines =  LASTCALENDARHOURS - FIRSTCALENDARHOURS
  const hoursLines = new Array(numbersOfLines).fill(0).map((v, i) => (
    <div className={styles.hoursLines} key={i}>{i + FIRSTCALENDARHOURS}</div>))
  
  return (
    <div className={styles.calendar}>
      <div className={styles.hoursLinesContainer}>
        {hoursLines}
      </div>
      <div className={styles.eventsContainer}>
        {
          events?.map((input, index) => <Event key={index} {...input} />)
        }
      </div>
    </div>
  )
}

export default Calendar