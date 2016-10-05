export class Event{
  constructor(id,name,attendees=[]){
    this._name = name
    this._id = id
    this._attendees = attendees //list of all attendees?
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
}