import React from 'react';

/**
 * Showing the status of the application.
 * Component should:
 *  - Display color appropriate for situation.
 *  - Show message for situation.
 *  - Show time when situation was created.
 * @prop {String} message - The current feedback
 * @prop {Date} time - Time object with hour, minute and second
 * @prop {String} statusCode - The status type
 */
const Status = ({ message, time, statusCode }) => {
  /**
   * Double digit short function. Making the input
   * number to a string with 2 digits minimum.
   *
   * @param {number} number
   */
  const dd = number => (number < 10 ? '0' : '') + number;

  const statusClass = (code) => {
    switch (code) {
      case 'OK':
        return 'status-ok';
      case 'ERROR':
        return 'status-danger';
      default:
        return 'status-progress';
    }
  };

  const statusMessage = (code, message) => {
    switch (code) {
      case 'OK':
        return message;
      case 'ERROR':
        return message;
      default:
        return message || 'Laster inn...';
    }
  };

  return (
    <div className={`status ${statusClass(statusCode)}`}>
      <div>{ statusMessage(statusCode, message) }</div>
      <div>
        { `${dd(time.hour)}:${dd(time.minute)}:${dd(time.second)}` }
      </div>
    </div>
  );
};

export default Status;
