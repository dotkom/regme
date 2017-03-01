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
        return 'label-ok';
      case 'ERROR':
        return 'label-danger';
      default:
        return 'label-progress';
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
    <div className={`label ${statusClass(statusCode)}`}>
      <div>{ statusMessage(statusCode, message) }</div>
      <div>
        { `${dd(time.hour)}:${dd(time.minute)}:${dd(time.second)}` }
      </div>
    </div>
  );
};

export default Status;
