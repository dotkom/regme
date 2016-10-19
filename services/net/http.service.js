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
        for(let i of this.requestQueue){
          this.request(i)
        }
        this.requestQueue = {}
      },(e)=>{
        console.log("Error",e)
      },() => {
        //Use a timeout to prevent a feedback loop
        this.waitingForToken = false
      });
    }
  }
  handleResponse(r,req){
    if(!r.ok){
      if(r.status == 401){
        //Add request to queue
        this.requestQueue.push(req)
        //Renew if not waiting for token
        this.renewToken()
      }
      return Observable.throw(r)
    }
    return r.json()
  }
  request(request){
    //Add token to request
    request.headers.set("Authorization", "Bearer " + this.auth_token)
    return Observable.fromPromise(fetch(request))
      .flatMap(r => this.handleResponse(r,request))
  }
  get(url,params){
    let pUrl = url
    if(params){
      pUrl += HttpService.urlEncode(params);
    }
    let request = new Request(pUrl,{method:'get'})
    return this.request(request)
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

  post(url,body,url_encoded): Observable<any>{
    let pUrl = url
    let pBody = body
    let headers = new Headers()
    headers.set('Content-Type', 'application/json')
    
    if(url_encoded){
      pUrl += HttpService.urlEncode(pBody)
      headers.set('Content-Type',"application/x-www-form-urlencoded; charset=UTF-8")
    }
    let request = new Request(pUrl,{
      method: "POST",
      body: pBody,
      headers: headers
    });
    return this.request(request)
  }
}
//Export singleton
export const http = new HttpService()
