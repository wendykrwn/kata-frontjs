import { useEffect } from "react";
import styles from "../styles/calendar.module.css"
import { FIRSTCALENDARHOURS, LASTCALENDARHOURS, getHeightEventPercent, getPositionEventPercent } from "../utils/calendar";
import { EventType } from "../types/calendar";

type EventProps = {
  id: number;
  start: string;
  duration: number;
  percentWidth?: number;
  startDateTime: Date
  percentPositionX?: number
};

const Event = ({ start, id, duration, percentWidth, startDateTime, percentPositionX }: EventProps) => {
  return (
    <div
      key={id}
      id={id.toString()}
      className={styles.event}
      style={{
        height: `${getHeightEventPercent(duration)}%`,
        width: `${percentWidth}%`,
        top: `${getPositionEventPercent(startDateTime)}%`,
        left: `${percentPositionX}%`
        
      }}
    >
      {id}
      {/* <div className={styles.tooltip}>
        <div>{start}</div>
        <div>{duration}min</div>
      </div> */}
    </div>
  )
}

export default Event