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
    
    let observable = Observable.of([])

    if (dependencies.length >= 1) {
      observable = Observable.zip(...dependencies.map((t) => this.getService(t)));
    }
    
    // wait to register to after all dependencies has been registered
    observable.map((deps) => {
      let ret = {};
      for(let dep of deps){
        ret[dep.constructor.getType()] = dep;
      }
      return ret;

    }).subscribe((deps) => {
      if (this.subjects[type] == null) {
        this.subjects[type] = new AsyncSubject();
      }
      
      this.services[type] = new service_cls(deps, ...args);

      this.subjects[type].next(this.services[type]);
      this.subjects[type].complete();
      this.serviceRegisterSubject.next(this.services);
    });

  }

  getService(type){
    if(this.subjects[type] == null) {
      this.subjects[type] = new AsyncSubject();
    }
    return this.subjects[type];
  }

  getServices(){
    return this.serviceRegisterSubject;
  }

}
