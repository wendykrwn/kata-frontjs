import styles from "../styles/calendar.module.css"
import inputs from "../data/input.json"
import Event from "./event"

type CalendarProps = {
  firstHour: number,
  lastHour: number
}
const Calendar = ({
  firstHour,
  lastHour,
}: CalendarProps) => {

  const numbersOfLines = lastHour - firstHour
  const hoursLines = new Array(numbersOfLines).fill(0).map((v, i) => (
    <div className={styles.hoursLines} key={i}>{i + firstHour}</div>))
  
  return (
    <div className={styles.calendar}>
      <div className={styles.hoursLinesContainer}>
        {hoursLines}
      </div>
      {
        inputs?.map((input, index) => <Event {...input} />)
      }
    </div>
  )
}

export default Calendar