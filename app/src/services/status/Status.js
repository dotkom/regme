

export class Status{
  constructor(statusCode, message, date=new Date()){
    this.statusCode = statusCode;
    this.message = message;
    this.time = {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    }
  }

  getTime(){
    return this.time;
  }

  getMessage(){
    return this.message;
  }

  getStatusCode(){
    return this.statusCode;
  }
}