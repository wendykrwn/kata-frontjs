import styles from "../styles/calendar.module.css"

type EventProps = {
  id: number;
  start: string;
  duration: number;
};

const Event = ({ start, id, duration }:EventProps) => {
  return (
    <div id={id.toString()} className={styles.event}>
      {id}
      <div className={styles.tooltip}>
        <div>{start}</div>
        <div>{duration}min</div>
      </div>
    </div>
  )
}

export default Event