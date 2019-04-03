

import { ServiceType } from 'services/ServiceType';
import { HttpService } from 'services/net';
import { StatusService, Status } from 'services/status';


import { UserManager, Log } from 'oidc-client';

import { Observable, ReplaySubject } from 'rxjs';


export const OidcService = new ServiceType("Openid-connect", HttpService, StatusService); 


export class OidcServiceProvider {
  constructor(dependencies, config){
    this.http = dependencies[HttpService];
    this.status = dependencies[StatusService];
    this.config = config;
    this.userManager = new UserManager(config);
    this.userSubject = new ReplaySubject(1);
    
    this._initBindings();
  }


  _initBindings(){
    this.userManager.events.addUserLoaded((user) => {
      this.setUser(user, true);
    });
    
    Observable.from(this.userManager.getUser()).subscribe((user) => {
      this.setUser(user, true);
    });

    Observable.from(this.userManager.signinPopupCallback()).subscribe((user) => {
      if(user){
        location.href = '/';
      }
    });

  }

  getUser(){
    return this.userSubject.asObservable().take(1);
  }

  onUserChange(){
    return this.userSubject.asObservable();
  }


  login(){
    this.status.setStatus(new Status("WAIT", "Logger inn"));
    return Observable.from(this.userManager.signinPopup()).switchMap((...a) => {
      this.status.setStatus(new Status("OK", "Logget inn"))
      return this.getUser();
    }).catch((err) => {
      this.status.setStatus(new Status("ERROR", "Kunne ikke logge inn!"))
      return Observable.of(null);
    });
  }

  setUser(user, push=true){

    this.http.setToken(user && user.access_token);
    this._user = user;

    if(push){
      this.userSubject.next(this._user);
    }

  }

  static getType(){
    return OidcService;
  }

}