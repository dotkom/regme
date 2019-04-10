
import { ServiceType } from 'services/ServiceType';
import { Status } from './Status';

import { ReplaySubject } from 'rxjs';

export const StatusService = new ServiceType("Status-Service");



export class StatusServiceProvider {
  constructor(){
    this.statusSubject = new ReplaySubject(1);
    this.setStatus(new Status("WAIT", "Ingen status"))
  }

  setStatus(status){
    this.statusSubject.next(status);
  }

  getStatus(){
    return this.statusSubject.asObservable().take(1);
  }

  onStatusUpdate(){
    return this.statusSubject.asObservable();
  }

  static getType(){
    return StatusService;
  }
}