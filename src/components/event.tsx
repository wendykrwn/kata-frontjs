import styles from "../styles/calendar.module.css"
import { FIRSTCALENDARHOURS, LASTCALENDARHOURS, getHeightEventPercent } from "../utils/calendar";

type EventProps = {
  id: number;
  start: string;
  duration: number;
};

const Event = ({ start, id, duration }:EventProps) => {
  return (
    <div
      key={id}
      id={id.toString()}
      className={styles.event}
      style={{
        height: `${getHeightEventPercent(duration)}%`
      }}
    >
      {id}
      <div className={styles.tooltip}>
        <div>{start}</div>
        <div>{duration}min</div>
      </div>
    </div>
  )
}

export default Event