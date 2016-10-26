export class Attendee{
  constructor(id,username,firstname,lastname,primary=false,registered=false){
    this._id = id
    this._username = username
    this._firstname = firstname
    this._lastname = lastname
    this._registered = registered
    this._primary = primary
    console.log(this.isPrimary(),this.isRegistered())
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
  isRegistered(){
    return this._registered
  }
  isPrimary(){
    return this._primary
  }
}