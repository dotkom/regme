import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Event } from './event';
import { Company } from './company';
import { Attendee, attendeeService } from 'services/attendee';
import { API_BASE, API_EVENTS, API_ATTENDEES, API_USERS } from 'common/constants';
import { http } from 'services/net';


class EventServiceProvider {

  constructor() {
    this._events = null;
    this._cache = {};
    this.eventSubject = new ReplaySubject(1);
    this.refresh();
  }

  set events(newEvents) {
    this._events = newEvents;
    for (const i in newEvents) {
      this._cache[i] = newEvents[i];
    }
    this.eventSubject.next(newEvents);
  }

  get events() {
    return this._events;
  }
  getCached(event_id) {
    return this._cache[event_id];
  }
  refresh() {
    http.get(`${API_BASE}${API_EVENTS}`, { attendance_event__isnull: 'False', event_end__gte: new Date().toISOString().slice(0, 10), order_by: 'event_start' })
      .map((r) => {
        const newEvents = [];
        for (const a of r.results) {
          if (a.attendance_event) {
            let company = null;
            let ce = a.company_event[0];
            if (ce) {
              ce = ce.company;
              company = new Company(ce.name, ce.site, ce.image ? ce.image.thumb : null);
            }
            const event = new Event(a.id, a.title, a.attendance_event.max_capacity, [], company);
            newEvents.push(event);
          }
        }
        return newEvents;
      }).subscribe(eventList => this.events = eventList);
  }

  getEvents() {
    return this.eventSubject.asObservable();
  }

}
// Export singleton
export const eventService = new EventServiceProvider();
