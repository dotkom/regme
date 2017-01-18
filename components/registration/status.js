import React from 'react';

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
const Status = ( { message, time, statusCode } ) => {
  /**
   * Double digit short function. Making the input
   * number to a string with 2 digits minimum.
   * 
   * @param {number} number
   */
  let dd = (number) => {
    return (number < 10 ? '0' : '') + number
  }

  let statusClass = (code) => {
    switch (code) {
      case 'OK':
        return 'label-ok'
      case 'ERROR':
        return 'label-danger'
      default:
        return 'label-progress'
    }
  }

  let statusMessage = (code, message) => {
    switch (code) {
      case 'OK':
        return message
      case 'ERROR':
        return message
      default:
        return message || 'Laster inn...'
    }
  }

  return (
    <div className={'color mdl-cell mdl-cell--12-col mdl-grid mdl-shadow--2dp label ' + statusClass(statusCode)}>
      <div className='mdl-cell mdl-cell--10-col mdl-cell--6-col-tablet mdl-cell--4-col-phone'>{ statusMessage(statusCode, message) }</div>
      <div className='mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet mdl-cell--4-col-phone align-right'>
        { `${dd(time.hour)}:${dd(time.minute)}:${dd(time.second)}` }
      </div>
      <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress-bar"></div>
    </div>
  )
}

export default Status
