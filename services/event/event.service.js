import { Observable, ReplaySubject, Subject } from 'rxjs'
import { Event } from './event'
import { Attendee } from './attendee'

import { API_BASE, API_EVENTS, API_ATTENDEES, API_USERS } from 'common/constants'
import { http } from 'services/net'

interface IEventService{
  //Fetch events
  getEvents(): Observable<Event[]>
  //Observable -> null if rfid is non-existing
  //registerAttendee(rfid: string): Observable<Attendee>
  //Observable -> null if failed 
  //registerRfid(rfid: string, username: string): Observable<Attendee>
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
    http.get(`${API_BASE}${API_EVENTS}`,{"ordering":"-event_start"})
      .map(r => {
        //Fetch attendees
        let newEvents = []
        for(let a of r.results){
          let event = new Event(a.id,a.title,a.attendance_event.max_capacity)
          http.get(`${API_BASE}${API_ATTENDEES}`,{"event": event.id})
            .map(result => result.results)
            .flatMap(attendees => {
              let attendeeSub = new Subject()
              let count = attendees.length
              for(let i in attendees){
                let attendee = attendees[i]
                http.get(`${API_BASE}${API_USERS}${attendee.user}/`).subscribe(user => {
                  attendeeSub.next(new Attendee(
                    attendee.user,
                    "None",
                    user.first_name,
                    user.last_name,
                    i < event.capacity,
                    attendee.attended
                  ))
                  count--
                  if(count <= 0){
                    attendeeSub.complete()
                  }  
                })
              }
              return attendeeSub.asObservable()
            })
            .subscribe((attendee) => {
              event.addAttendee(attendee)
            /*for(let attendee of attendees){
              event.addAttendee(new Attendee())
            }*/
          })
          /*newEvents.push(new Event(a.id,a.title,[
              new Attendee(0,a.title + "TestUser1","TestUser1",true, new Date()),
              new Attendee(1,a.title + "TestUser2","TestUser2",false, new Date()),
              new Attendee(2,a.title + "TestUser3","TestUser3",false),
              new Attendee(3,a.title + "TestUser4","TestUser4",true),
            ])
          )*/
          newEvents.push(event)
        }
        return newEvents
      }).subscribe( eventList => this.events = eventList)
  }

  getEvents(){
    return this.eventSubject.asObservable()
  }

}
//Export singleton
export const eventService = new EventServiceProvider()
