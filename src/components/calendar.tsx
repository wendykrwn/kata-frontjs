import styles from "../styles/calendar.module.css"
import inputs from "../data/input.json"
import Event from "./event"
import { useEffect, useState } from "react"
import { buildMatrix } from "../utils/calendar"
import { EventType } from "../types/calendar"

const Calendar = () => {

  const [events, setEvents] = useState<EventType[]>([])
  
  useEffect(() => {
    const events =  buildMatrix(inputs)
    if (events?.length > 0)
      setEvents(events)
    
  }, [inputs])
  
  return (
    <div className={styles.calendar}>

      <div className={styles.eventsContainer}>
        {
          events?.map((input, index) => <Event key={index} {...input} />)
        }
      </div>
    </div>
  )
}

export default Calendar