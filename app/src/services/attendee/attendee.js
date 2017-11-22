/**
 * A class representing an attendee
 */

export class Attendee {
  /**
   * @class Attendee
   * @param {Number} id - the attendee's database id
   * @param {String} username - the attendee's username
   * @param {String} firstname - the attendee's first name
   * @param {String} lastname - the attendee's last name
   * @param {Date} date - the attendee's registration date
   * @param {boolean} registered - wether or not the attendee has attended the event
   * @param {Event} event - the event the attendee is registerd for
   */
  constructor(id, username, firstname, lastname, date, registered = false, event) {
    /** @private */
    this._id = id;
    /** @private */
    this._username = username;
    /** @private */
    this._firstname = firstname;
    /** @private */
    this._lastname = lastname;
    /** @private */
    this._registered = registered;
    /** @private */
    this._date = date;
    /** @private */
    this._event = event;
  }
  
  /**
   * @public
   * @type {Number} 
   */
  get id() {
    return this._id;
  }
  
  /**
   * @public
   * @type {String} 
   */
  get username() {
    return this._username;
  }
  
  /**
   * @public
   * @type {String} 
   */
  get firstname() {
    return this._firstname;
  }
  
  /**
   * @public
   * @type {String} 
   */
  get lastname() {
    return this._lastname;
  }
  
  /**
   * The attendee's full name
   * @public
   * @type {String} 
   */
  get fullname() {
    return `${this._firstname} ${this._lastname}`;
  }
  
  /**
   * The attendee's full name in lowercase
   * @public
   * @type {String} 
   */
  get lfullname() {
    return this.fullname.toLowerCase();
  }
  
  /**
   * The attendee's registration date
   * @public
   * @type {Date} 
   */
  get date() {
    return this._date;
  }
  
  /**
   * @method register - Markes and attendee as attended
   * @memberof Attendee
   * @inner
   * @public
   */
  register() {
    this._registered = true;
    this._event.moveAttendee(this);
    // Do something with event
  }
  
  /**
   * @method isRegistered
   * @memberof Attendee
   * @inner
   * @public
   * @type {Boolean} - true if attendee has attended else false 
   */
  isRegistered() {
    return this._registered;
  }
}
