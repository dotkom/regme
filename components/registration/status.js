/**
 * Showing the status of the application.
 * Component should:
 *  - Display color appropriate for situation.
 *  - Show message for situation.
 *  - Show time when situation was created.
 * 
 * @prop {string} message The current feedback
 * @prop {object} time Time object with hour, minute and second
 */
const Status = ( { message, time } ) => {
  return (
    <div className="color">
      <div className="left">{ message }</div>
      <div className="right">{ `${time.hour}:${time.minute}:${time.second}` }</div>
    </div>
  )
}

export default Status
