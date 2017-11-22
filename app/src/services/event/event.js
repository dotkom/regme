import { Observable, ReplaySubject } from 'rxjs'

export class Event{
  
  /**
   * @class Event
   * @param {Number} id - the event's database id
   * @param {String} name - the event's name
   * @param {Number} capacity - the event's capacity
   * @param {Array<Attendee>} attendees - a list of registerd attendees
   * @param {Company} org - the company representing the event
   */
  constructor(id,name,capacity,attendees=[],org){
    /** @private */
    this._name = name;
    /** @private */
    this._id = id;
    /** @private */
    this._capacity = capacity; 
    /** @private */
    this._attendees = [];
    /** @private */
    this._attendingList = [];
    /** @private */
    this._notAttendedList = [];
    /** @private */
    this._waitList = [];
    /** @private */
    this._attendeesSubject = new ReplaySubject(1);
    /** @private */
    this._attendingSubject = new ReplaySubject(1);
    /** @private */
    this._waitlistSubject = new ReplaySubject(1);
    /** @private */
    this._notAttendedSubject = new ReplaySubject(1);
    /** @private */
    this._organization = org;
    /** @private */
    this._attendeesSubject.next({
      waitlist: [],
      attending: [],
      notAttended: []
    });
    /** @private */
    this._attendingSubject.next([]);
    /** @private */
    this._waitlistSubject.next([]);
    /** @private */
    this._notAttendedSubject.next([]);
    for(let i of attendees){
      this.addAttendee(i);
    }
  }

  /**
   * @method hasAttendees
   * @memberof Event
   * @inner
   * @public
   * @returns {Boolean} - true if there are any attendees registerd for the event
   */
  hasAttendees(){
    return this._attendees.length > 0;
  }

  /**
   * @method addAttendee - adds an attendee to the event instance
   * @memberof Event
   * @inner
   * @public
   */
  addAttendee(attendee){
    if(attendee.isRegistered()){
      this._attendingList.push(attendee);
      this._attendingSubject.next(this._attendingList);
    }
    else if(this._attendees.length < this.capacity){
      this._notAttendedList.push(attendee);
      this._notAttendedSubject.next(this._notAttendedList);
    }
    else{
      this._waitList.push(attendee);
      this._waitlistSubject.next(this._waitList);
    }

    this._attendees.push(attendee);
    this._attendeesSubject.next({
      waitlist: this._waitList,
      attending: this._attendingList,
      notAttended: this._notAttendedList
    });
  }

  /**
   * @method moveAttendee - moves an attendee from not attended to attended
   * @memberof Event
   * @inner
   * @public
   * @param {Attendee} attendee 
   */
  moveAttendee(attendee){
    this._waitList = this._waitList.filter(v => v.id!=attendee.id);
    this._notAttendedList = this._notAttendedList.filter(v => v.id!=attendee.id);
    this._attendingList.push(attendee);
    this.refresh();
  }

  /**
   * @method refresh - pushes out new 'notifications' to all observers listening for changes to the attendee lists
   * @memberof Event
   * @inner
   * @public
   */
  refresh(){
    this._waitlistSubject.next(this._waitList)
    this._attendingSubject.next(this._attendingList)
    this._notAttendedSubject.next(this._attendingList)
    this._attendeesSubject.next({
      waitlist: this._waitList,
      attending: this._attendingList,
      notAttended: this._notAttendedList
    });  
  }

  /**
   * @type {Company}
   * @public
   */
  get organization(){
    return this._organization;
  }

  /**
   * @type {Observable<Array<Attendee>>}
   * @public
   */
  get attendees(){
    return this._attendeesSubject.asObservable();
  }
  
  /**
   * @type {Observable<Array<Attendee>>}
   * @public
   */
  get attending(){
    return this._attendingSubject.asObservable();
  }
  
  /**
   * @type {Observable<Array<Attendee>>}
   * @public
   */
  get waitlist(){
    return this._waitlistSubject.asObservable();
  }

  /**
   * @type {Observable<Array<Attendee>>}
   * @public
   */
  get notAttended(){
    return this._notAttendedSubject.asObservable();
  }

  /**
   * @type {Number}
   * @public
   */
  get id(){
    return this._id;
  }
  
  /**
   * @type {String}
   * @public
   */
  get name(){
    return this._name;
  }

  /**
   * @type {Number}
   * @public
   */
  get capacity(){
    return this._capacity;
  }

  /**
   * @type {Number}
   * @public
   */
  get registeredCount(){
    return this._attendingList.length;
  }
  
  /**
   * @type {Number}
   * @public
   */
  get totalCount(){
    return this._waitList.length + this._notAttendedList.length + this._attendingList.length;
  }
}