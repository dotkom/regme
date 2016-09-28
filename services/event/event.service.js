import { Observable } from 'rxjs';

interface IEventService{
  //Fetch events
  fetchEvents(): Observable<Event[]>
}


class Event{
  constructor(name,id){
    this._name = name
    this._id = id
  }
  get name(){
    return this._name
  }
  get id(){
    return this._id
  }
}

class EventServiceProvider implements IEventService{
  constructor(){
    this.events = null
  }
  fetchEvents(){
    if(!this.events){
      //Example data from splash
      return Observable.fromPromise(fetch("https://online.ntnu.no/api/v1/splash-events/"))
        .flatMap(r => r.json())
        .map(r => {
          this.events = []
          let count = 0
          for(let a of r.results){
            this.events.push(new Event(a.title,count++))
            if(count > 3){
              break;
            }  
          }
          return this.events
        })
      
    }
    return Observable.of(this.events)//return new Promise( (ok,fail) => { ok(this.events) } )
  }
}
//Export singleton, or use static class in future?
export const eventService = new EventServiceProvider()
