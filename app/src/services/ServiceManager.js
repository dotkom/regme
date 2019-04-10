import {AsyncSubject, ReplaySubject, Observable} from 'rxjs';





export class ServiceManager {
  constructor(){
    this.services = {};
    this.subjects = {};
    this.serviceRegisterSubject = new ReplaySubject();
  }



  registerService(service_cls, ...args){
    const type = service_cls.getType();
    const dependencies = type.getDependencies();
    
    if(this.services[type]) {
      throw new Error({error: "Service already registered", service: service_cls});
    }
    

    // fetch dependencies
    this.getServices(...dependencies).subscribe((deps) => {
      if (this.subjects[type] == null) {
        this.subjects[type] = new AsyncSubject();
      }
      
      this.services[type] = new service_cls(deps, ...args);

      this.subjects[type].next(this.services[type]);
      this.subjects[type].complete();
      this.serviceRegisterSubject.next(this.services);
    });

  }

  getServices(...types){
    let observable = Observable.of([]);
    if(types.length >= 1){
      observable = Observable.zip(...types.map((t) => this.getService(t)));
    }
    
    return observable.map((services) => {
      let ret = {};
      for(let service of services){
        ret[service.constructor.getType()] = service;
      }
      return ret;
    });
  
  }

  getService(type){
    if(this.subjects[type] == null) {
      this.subjects[type] = new AsyncSubject();
    }
    return this.subjects[type];
  }

  getAllServices(){
    return this.serviceRegisterSubject;
  }

}
