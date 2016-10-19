export class Attendee{
  constructor(id,username,fullname,primary=false,reg_date?){
    this._id = id
    this._username = username
    this._fullname = fullname
    this._reg_date = reg_date
    this._primary = primary
  }
  get id(){
    return this._id
  }
  get username(){
    return this._username
  }
  get fullname(){
    return this._fullname
  }
  isRegistered(){
    return this._reg_date != null
  }
  isPrimary(){
    return this._primary
  }
}