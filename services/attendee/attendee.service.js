import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Event } from 'services/event';
import { Attendee } from './attendee';

import { API_BASE, API_EVENTS, API_ATTEND, API_ATTENDEES, API_USERS } from 'common/constants';
import { isRfid } from 'common/utils';
import { http } from 'services/net';

/**
 * Status codes:
 * 50:
 *   des: no user with given username
 *   context: try to register rfid for a user
 *   http: status: 400 BAD_REQUEST
 * 40:
 *   des: no user with given rfid
 *   context: try to register with an rfid that is not bound to a user'
 *   http: status: 400 BAD_REQUEST
 * 30:
 *   des: Attendee is on waitinglist
 *   context: try to register an attendee when attendee is on waitinglist, force option = false'
 *   http: status: 100 CONTINUE
 * 20:
 *   des: Attendee has already registered
 *   context: try to register attendee when attendee is already registered
 *   http: status: 400 BAD_REQUEST
 * 10:
 *   des: Attendee successfuly registered
 *   context: try to register an attendee
 *   http: status: 200 OK
 */


class AttendeeServiceProvider {

  constructor() {
    this.cache = {};
  }

  registerAttendee(event, rfid, approved = false) {
    return this.handleResponse(http.post(`${API_BASE}${API_ATTEND}`, {
      rfid: isRfid(rfid) ? rfid : null,
      username: isRfid(rfid) ? null : rfid,
      event: event.id,
      approved,
    }))
      .map((res) => {
        const ret = Object.assign({}, res, {
          event,
        });
        return ret;
      }); 
  }
  getCached(attendee_id) {
    return this.cache[attendee_id];
  }
  registerRfid(username, rfid, event) {
    if (username != null && rfid != null && rfid.length > 0) {
      return this.handleResponse(http.post(`${API_BASE}${API_ATTEND}`, {
        rfid,
        username,
        event: event.id,
      }));
    }
  }
  handleResponse(r) {
    return r.catch(error =>
      // if(error.status == 400 || error.status == 100)
       Observable.fromPromise(error.json()).flatMap(r => Observable.throw(r))
        // return Observable.throw(Observable.fromPromise(error.json()))

    );
  }
  getAttendees(event, page = 1) {
    const count = 0;
    
    return http.get(`${API_BASE}${API_ATTENDEES}`, { event: event.id, page })
      .map((result) => {
        let attendees = result.results;
        const a = [];
        for (const attendee of attendees) {
          const at = new Attendee(
            attendee.id,
            'NONE',
            attendee.user.first_name,
            attendee.user.last_name,
            new Date(attendee.timestamp),
            attendee.attended,
            event
          );
          a.push(at);
          if(this.getCached(at.id) == null)
            event.addAttendee(at);
          
          this.cache[at.id] = at;
        }
        return {attendees: a, next: result.next};
      })
      .flatMap((r) => {
        if (r.next) {
          return this.getAttendees(event, ++page).zip(Observable.of(r.attendees), (a, b) => a.concat(b));
        }
        return Observable.of(r.attendees);
      });
  }

}
// Export singleton
export const attendeeService = new AttendeeServiceProvider();
