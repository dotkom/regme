export class Attendee{
  constructor(id,username,firstname,lastname,date,registered=false,event){
    this._id = id
    this._username = username
    this._firstname = firstname
    this._lastname = lastname
    this._registered = registered
    this._date = date
    this._event = event
  }
  get id(){
    return this._id
  }
  get username(){
    return this._username
  }
  get firstname(){
    return this._firstname
  }
  get lastname(){
    return this._lastname
  }
  get fullname(){
    return `${this._firstname} ${this._lastname}`
  }
  get lfullname(){
    return this.fullname.toLowerCase();
  }
  get date(){
    return this._date
  }
  register(){
    this._registered = true
    this._event.moveAttendee(this)
    //Do something with event
  }
  isRegistered(){
    return this._registered
  }
}