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
  /**
   * Double digit short function. Making the input
   * number to a string with 2 digits minimum.
   * 
   * @param {number} number
   */
  let dd = (number) => {
    return (number < 10 ? '0' : '') + number
  }

  return (
    <div className='color'>
      <div className='left'>{ message }</div>
      <div className='right'>{ `${dd(time.hour)}:${dd(time.minute)}:${dd(time.second)}` }</div>
    </div>
  )
}

export default Status
