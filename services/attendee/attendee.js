export class Attendee{
  constructor(id,username,firstname,lastname,date,registered=false){
    this._id = id
    this._username = username
    this._firstname = firstname
    this._lastname = lastname
    this._registered = registered
    this._date = date
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
  isRegistered(){
    return this._registered
  }
}