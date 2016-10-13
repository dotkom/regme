import { Observable, ReplaySubject, } from 'rxjs'

import { API_BASE, API_AUTH, CLIENT_SECRET, CLIENT_ID } from 'common/constants'

console.log(API_BASE,API_AUTH)
/*
interface IHttpService{
  get(): Observable<any>;
  post(): Observable<any>;
  put(): Observable<any>;
}
*/




class HttpService{
  
  constructor(){
    this.requestQueue = []
    this.auth_token = ""
    this.waitingForToken = false
    this.renewToken()
  }
  renewToken(){
    if(!this.waitingForToken){
      this.post(API_BASE + API_AUTH,{
        client_secret: CLIENT_SECRET,
        client_id: CLIENT_ID,
        grant_type: "client_credentials",
      },true).subscribe((data) => {
        this.auth_token = data.access_token;
        //Performe requests from request queue
      },(e)=>{
        console.log("Error",e)
      },() => {
        this.waitingForToken = false
      });
    }
  }
  handleResponse(r){
    if(r.status != 200){
      if(r.status == 401 && !noQueue){
        //Add request to queue
        //Renew if not waiting for token
        this.renewToken()
      }
      return Observable.throw(r)
    }
    return r.json()
  }
  get(url,params){
    let pUrl = url + HttpService.urlEncode(params);
    return Observable.fromPromise(fetch(pUrl,{
        method: 'GET'
      }))
      .flatMap(r => this.handleResponse(r))
  }

  static urlEncode(data){
    let ret = ""
    for (let key in data) {
      if (ret != "") {
        ret += "&"
      }
      ret += encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
    }
    return "?" + ret
  }

  post(url,body,url_encoded,noQueue): Observable<any>{
    let pUrl = url
    let pBody = body
    let headers = new Headers();
    headers.set('Content-Type', 'application/json')
    
    if(url_encoded){
      pUrl += HttpService.urlEncode(pBody)
    //  pBody = null
      headers.set('Content-Type',"application/x-www-form-urlencoded; charset=UTF-8")
    }
    let rb = {
      
    }
    return Observable.fromPromise(
      fetch(pUrl,{
        method: "POST",
        body: pBody,
        headers: headers
      }))
        .flatMap(r => this.handleResponse(r))
    
  }
}
//Export singleton
export const http = new HttpService()
