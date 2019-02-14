import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Event } from 'services/event';
import { Attendee } from './attendee';

import { API_BASE, API_EVENTS, API_ATTEND, API_ATTENDEES, API_USERS } from 'common/constants';
import { isRfid } from 'common/utils';
import { HttpService } from 'services/net';

import { ServiceType } from 'services/ServiceType';

export const AttendeeService = new ServiceType("Attendee", HttpService); 


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


export class AttendeeServiceProvider {
  
  /**
   * @class AttendeeServiceProvider
   */
  constructor(dependencies) {
    /** @private */
    this.cache = {};
    this.http = dependencies[HttpService];
  }

  static getType(){
    return AttendeeService;
  }

  /**
   * @method registerAttendee - Registers an attendee
   * @memberof AttendeeServiceProvider
   * @inner
   * @public
   * @param {Event} event - the event an attendee is being registerd for 
   * @param {String} rfid - the attendees rfid
   * @param {Boolean} approved - wether or not the attendee has been approved when on the waitinglist
   * @returns {Observable<{}>}
   */
  registerAttendee(event, rfid, approved = false) {
    return this.handleResponse(this.http.post(`${API_BASE}${API_ATTEND}`, {
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
  
  /**
   * @method getCached
   * @memberof AttendeeServiceProvider
   * @inner
   * @public
   * @param {Number} attendee_id - the attendee's id
   * @returns {Attendee}
   */
  getCached(attendee_id) {
    return this.cache[attendee_id];
  }

  /**
   * @method registerRfid - binds an rfid to a user
   * @memberof AttendeeServiceProvider
   * @inner
   * @public
   * @param {String} username 
   * @param {String} rfid 
   * @param {Event} event 
   */
  registerRfid(username, rfid, event) {
    if (username != null && rfid != null && rfid.length > 0) {
      return this.handleResponse(this.http.post(`${API_BASE}${API_ATTEND}`, {
        rfid,
        username,
        event: event.id,
      }));
    }
    return Observable.throw({error: "Rfid or username is null"});
  }

  /**
   * @method handleResponse - catches errors from an http response
   * @memberof AttendeeServiceProvider
   * @inner
   * @private
   * @param {Observable<{}>} r - Observable that resolves into an http/json response
   * @returns {Observable<{}>}
   */
  handleResponse(r) {
    return r.catch(error =>
      // if(error.status == 400 || error.status == 100)
       Observable.fromPromise(error.json ? error.json() : {message: "No json response in error"}).flatMap(r => Observable.throw(r))
        // return Observable.throw(Observable.fromPromise(error.json()))

    );
  }
  
  /**
   * @method getAttendees
   * @memberof AttendeeServiceProvider
   * @inner
   * @public
   * @param {Event} event - the event to fetch attendees from
   * @param {Number} page - what page to start fetching from 
   * @returns {Observable<Array<Attendee>>} - an observable that resolves into a list of Attendees
   */ 
  getAttendees(event, page = 1) {
    const count = 0;
    
    return this.http.get(`${API_BASE}${API_ATTENDEES}`, { event: event.id, page })
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
        // Fetches the next page if it exists
        if (r.next) {
          return this.getAttendees(event, ++page).zip(Observable.of(r.attendees), (a, b) => a.concat(b));
        }
        return Observable.of(r.attendees);
      });
  }

}
