import { Observable, ReplaySubject } from 'rxjs'
import { Event } from './event'
import { Attendee } from './attendee'

import { API_BASE, API_EVENTS } from 'common/constants'
import { http } from 'services/net'

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
    let filters = "?ordering=-event_start"
    Observable.fromPromise(fetch(`${API_BASE}${API_EVENTS}${filters}`))
      .switchMap(r => r.json())
      .map(r => {
        let newEvents = []
        let count = 0
        for(let a of r.results){
          newEvents.push(new Event(a.id,a.title,[
              new Attendee(0,a.title + "TestUser1","TestUser1",true, new Date()),
              new Attendee(1,a.title + "TestUser2","TestUser2",false, new Date()),
              new Attendee(2,a.title + "TestUser3","TestUser3",false),
              new Attendee(3,a.title + "TestUser4","TestUser4",true),
            ])
          )
          count++
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
