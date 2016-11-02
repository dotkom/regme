import { Observable, ReplaySubject, Subject } from 'rxjs'
import { Event } from './event'
import { Company } from './company'
import { Attendee, attendeeService } from 'services/attendee'
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
    http.get(`${API_BASE}${API_EVENTS}`,{"attendance_event__isnull":"False","event_end__gte":new Date().toISOString().split("T")[0],"order_by":"event_start"})
      .map(r => {
        let newEvents = []
        for(let a of r.results){
          if(a.attendance_event){
            let company = null
            let ce = a.company_event[0]
            if(ce){
              company = new Company(ce.name,ce.site,ce.image ? ce.image.thum : null)
            }
            let event = new Event(a.id,a.title,a.attendance_event.max_capacity,[],company)
            attendeeService.getAttendees(event.id).subscribe((attendees) => {
              attendees.sort((a,b)=>{
                a.date > b.date
              })
              for(let i of attendees){
                event.addAttendee(i)
              }
            })
            newEvents.push(event)
          }
        }
        return newEvents
      }).subscribe( eventList => this.events = eventList)
  }

  getEvents(): Observable<Event[]>{
    return this.eventSubject.asObservable()
  }

}
//Export singleton
export const eventService = new EventServiceProvider()
