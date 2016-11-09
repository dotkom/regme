import { Observable, ReplaySubject } from 'rxjs'

export class Event{
  constructor(id,name,capacity,attendees=[],org?){
    this._name = name
    this._id = id
    this._capacity = capacity 
    this._attendees = []
    this._attendingList = []
    this._notAttendedList = []
    this._waitList = []
    this._attendeesSubject = new ReplaySubject(1)
    this._attendingSubject = new ReplaySubject(1)
    this._waitlistSubject = new ReplaySubject(1)
    this._notAttendedSubject = new ReplaySubject(1)
    this._organisation = org
    this._attendeesSubject.next({
      waitlist: [],
      attending: [],
      notAttended: []
    })
    this._attendingSubject.next([])
    this._waitlistSubject.next([])
    this._notAttendedSubject.next([])
    
    for(let i of attendees){
      this.addAttendee(i)
    }
  }
  get id(){
    return this._id
  }
  addAttendee(attendee){
    if(attendee.isRegistered()){
      this._attendingList.push(attendee)
      this._attendingSubject.next(this._attendingList)
    }
    else if(this._attendees.length < this.capacity){
      this._notAttendedList.push(attendee)
      this._notAttendedSubject.next(this._notAttendedList)
    }
    else{
      this._waitList.push(attendee)
      this._waitlistSubject.next(this._waitList)
    }

    this._attendees.push(attendee)
    this._attendeesSubject.next({
      waitlist: this._waitList,
      attending: this._attendingList,
      notAttended: this._notAttendedList
    })
  }
  moveAttendee(attendee: Attendee){
    this._waitList = this._waitList.filter(v => v!=attendee)
    this._notAttendedList = this._notAttendedList.filter(v => v!=attendee)
    this._attendingList.push(attendee)
    this.refresh()
  }
  refresh(){
    this._waitlistSubject.next(this._waitList)
    this._attendingSubject.next(this._attendingList)
    this._notAttendedSubject.next(this._attendingList)
    this._attendeesSubject.next({
      waitlist: this._waitList,
      attending: this._attendingList,
      notAttended: this._notAttendedList
    })
    
  }
  get organisation(){
    return this._organisation
  }
  get attendees(){
    return this._attendeesSubject.asObservable()
  }
  
  get attending(){
    return this._attendingSubject.asObservable()
  }
  
  get waitlist(){
    return this._waitlistSubject.asObservable()
  }

  get notAttended(){
    return this._notAttendedSubject.asObservable()
  }

  get name(){
    return this._name
  }

  get id(){
    return this._id
  }

  get capacity(){
    return this._capacity
  }
  get registeredCount(){
    return this._attendingList.length;
  }
  get totalCount(){
    return this._waitList.length + this._notAttendedList.length + this._attendingList.length;
  }
}