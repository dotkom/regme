import { Observable, ReplaySubject } from 'rxjs';
import { Event } from './event';
import { Attendee } from 'services/attendee'
interface IEventService{
  //Fetch events
  getEvents(): Observable<Event[]>
}




class EventServiceProvider implements IEventService{
  constructor(){
    this._events = null
    this.eventSubject = new ReplaySubject(1)
    this.refresh()  
  }
  set events(newEvents: Event[]){
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
          newEvents.push(new Event(a.id,a.title,[
              new Attendee(0,"TestUser1","TestUser1",true, new Date()),
              new Attendee(1,"TestUser2","TestUser2",false, new Date()),
              new Attendee(2,"TestUser3","TestUser3",false),
              new Attendee(3,"TestUser4","TestUser4",true),
            ])
          )
          count++;
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
    return this.eventSubject.asObservable()
  }
}
//Export singleton
export const eventService = new EventServiceProvider()
