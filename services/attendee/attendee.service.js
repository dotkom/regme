import { Observable, ReplaySubject, Subject } from 'rxjs'
import { Event } from 'services/event'
import { Attendee } from './attendee'

import { API_BASE, API_EVENTS, API_ATTEND ,API_ATTENDEES, API_USERS } from 'common/constants'
import { isRfid } from 'common/utils'
import { http } from 'services/net'

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



class AttendeeServiceProvider{
  
  constructor(){
    this.cache = {}
  }

  registerAttendee(event, rfid, approved = false){
    return this.handleResponse(http.post(`${API_BASE}${API_ATTEND}`,{
      rfid: isRfid(rfid) ? rfid : null,
      username: isRfid(rfid) ? null : rfid,
      event: event.id,
      approved: approved
    }))
      .map(res => {
        let ret = Object.assign({},res,{
          event: event
        })
        return ret;
      })
  }
  getCached(attendee_id){
    return this.cache[attendee_id]
  }
  registerRfid(username, rfid, event){
    if(username!=null && rfid!=null && rfid.length > 0){
      return this.handleResponse(http.post(`${API_BASE}${API_ATTEND}`,{
        rfid: rfid,
        username: username,
        event: event.id
      }))
    }
  }
  handleResponse(r){
    return r.catch( (error) => {
      //if(error.status == 400 || error.status == 100)
      return Observable.fromPromise(error.json()).flatMap((r) => Observable.throw(r))
        //return Observable.throw(Observable.fromPromise(error.json()))
      
    })
  }
  getAttendees(event, page=1){
    let count = 0;
    return http.get(`${API_BASE}${API_ATTENDEES}`,{"event": event.id,"page":page})
      .map(result => result.results)
      .map(attendees => {
        let a = [];
        for(let attendee of attendees){
          let at = new Attendee(
            attendee.id,
            "NONE",
            attendee.user.first_name,
            attendee.user.last_name,
            new Date(attendee.timestamp),
            attendee.attended,
            event
          )
          a.push(at)
          this.cache[at.id] = at
        }
        return a;
      })
      .flatMap(attendees => {
        if(attendees.length == 10){
          return this.getAttendees(event,++page).zip(Observable.of(attendees),(a,b) => {
            return a.concat(b);
          });
        }
        return Observable.of(attendees);
      })
     
  }

}
//Export singleton
export const attendeeService = new AttendeeServiceProvider()
