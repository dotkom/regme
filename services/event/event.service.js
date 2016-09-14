class Event{
  constructor(name,id){
    this._name = name
    this._id = id
  }
  get name(){
    return this._name
  }
  get id(){
    return this._id
  }
}

class EventServiceProvider{
  constructor(){
    this.events = null
  }
  fetchEvents(){
    if(!this.events){
      return new Promise( (ok,fail) => {
        this.events = [
          new Event("Event 1",1),
          new Event("Event 1",2),
          new Event("Event 1",3),
          new Event("Event 1",4)]
        ok(this.events)
      })
      //Get events from api, return promise?
      /*return new Promise( (ok,fail) => {
          fetch(SOME_URL,{
            method: "get"
          }).then( (respons) => {
            this.events = [];
            //push respons into events
            ok(this.events);
          }).catch( (respons) = {
            fail(respons);
          });  
        });*/
    }
    return new Promise( (ok,fail) => { ok(this.events) } )
  }
}
//Export singleton, or use static class in future?
export const eventService = new EventServiceProvider()
