/**
 * Checks if a string is a valid rfid 
 * @param {String} rfid - the string to test
 * @returns {Boolean} - true if rfid is a valid rfid else false
*/
export function isRfid(rfid) {
  return typeof (rfid) === 'string' && /^\d{8,10}$/.test(rfid);
}
