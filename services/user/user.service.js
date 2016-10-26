import { Observable, ReplaySubject, Subject } from 'rxjs'

import { API_BASE, API_EVENTS, API_ATTENDEES, API_USERS } from 'common/constants'
import { http } from 'services/net'

interface IUserService{
  getUserByRfid(): Observable<User>;
  getUserById(): Observable<User>;
  getUserByName(): Observable<User>;
}

export class UserServiceProvider{

  getUserByRfid(rfid:string): Observable<User>{
    return http.get(`${API_BASE}${API_USERS}`,{
      rfid: rfid
    }).map(data => data.results)
      .map((users) => {
        //Users with given rfid need to be exactly 1
        if(users.length == 1)
          return new User(-1,user.first_name,user.last_name)
    })
  }

  getUserById(id:number): Observable<User>{
    return http.get(`${API_BASE}${API_USERS}${id}/`)
      .map((user) => {
        if(user.first_name)
          return new User(id,user.first_name,user.last_name)
    })
  }

  getUserByName(username: string): Observable<User>{
    return http.get(`${API_BASE}${API_USERS}`,{
      username: username
    }).map(data => data.results)
      .map((users) => {
        //Users with given username need to be exactly 1
        if(users.length == 1)
          return new User(-1,users[0].first_name,users[0].last_name)
    })
  }

}

export const userService = new UserServiceProvider()