import { useEffect } from "react";
import styles from "../styles/calendar.module.css"
import {  getHeightEventPercent, getPositionEventPercent } from "../utils/calendar";
import { EventType } from "../types/calendar";

const Event = ({ start, id, duration, percentWidth, percentPositionX,...props }: EventType) => {
  return (
    <div
      key={id}
      id={id.toString()}
      className={styles.event}
      style={{
        height: `${getHeightEventPercent(duration)}%`,
        width: `${percentWidth}%`,
        top: `${getPositionEventPercent(start)}%`,
        left: `${percentPositionX}%`
        
      }}
    >
      <span>{id}</span> 
    </div>
  )
}

export default Event