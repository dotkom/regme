export class Event{
  constructor(id,name,capacity,attendees=[]){
    this._name = name
    this._id = id
    this._capacity = capacity 
    this._attendees = attendees
  }
  addAttendee(attendee){
    this._attendees.push(attendee)
  }
  get attendees(){
    return this._attendees
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
}