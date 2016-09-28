import { Observable, ReplaySubject } from 'rxjs';

interface IEventService{
  //Fetch events
  getEvents(): Observable<Event[]>
}


export class Event{
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
  //_events: Event[]
  //eventSubject: ReplaySubject = new ReplaySubject(1)
  constructor(){
    //this.events = null
    this._events = null
    this.eventSubject = new ReplaySubject(1)
    this.refresh()  
  }
  set events(newEvents: Event[]){
    console.log("Got events",newEvents)
    this._events = newEvents
    this.eventSubject.next(newEvents)
  }
  get events(){
    return this._events
  }
  refresh(){
    Observable.fromPromise(fetch("https://online.ntnu.no/api/v1/splash-events/"))
      .switchMap(r => r.json())
      .map(r => {
        let newEvents = []
        let count = 0
        for(let a of r.results){
          newEvents.push(new Event(a.title,count++))
          if(count > 3){
            break
          }  
        }
        return newEvents
      }).subscribe((eventList) => {
        this.events = eventList
      })
  }
  getEvents(){
    return this.eventSubject.asObservable()//Observable.of(this.events)//return new Promise( (ok,fail) => { ok(this.events) } )
  }
}
//Export singleton, or use static class in future?
export const eventService = new EventServiceProvider()
