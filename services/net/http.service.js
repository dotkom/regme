import { Observable, Subject } from 'rxjs';

import { API_BASE, API_AUTH, CLIENT_SECRET, CLIENT_ID } from 'common/constants';


export class HttpServiceProvider {

  constructor() {
    // Request queue used for 503 and 401 responses
    this.requestQueue = [];
    this.auth_token = '';
    this.waitingForToken = false;
    this.requestSubject = new Subject();
    this.count = 0;
    this.request_rate = 1;
    //How many 503 in a row? for a given delay
    this.fail_in_row = {};
    this.request_count = {};
    // Subject for handling requests, each request is seperated by this.request_rate in ms
    // Prevents 'DOS' protection
    this.requestSubject
      //Limit throughput
      .concatMap(v => Observable.of(v).delay(v.delay))
      // Subscrive to this stream
      .subscribe((requestPair) => {
        // preforme request
        this.count++;
        this.request_count[requestPair.delay] = this.request_count[requestPair.delay] || 0
        this.request_count[requestPair.delay]++;
        Observable.fromPromise(fetch(requestPair.request))
          /*
            Send response to handleResponse()
            handleResponse will resolve or will queue the request in case of
            401 error, when token is renewed it will then try to performe the request
          */
          .flatMap(response => this.handleResponse(response, requestPair.request,requestPair.delay))
          // When the request is resolved, send it back to the source of the request
          .subscribe((r) => {
            requestPair.subject.next(r);
          }, (error) => {
            requestPair.subject.error(error);
          }, () => {
            requestPair.subject.complete();
          });
      });
  }
  renewToken() {
    if (!this.waitingForToken) {
      this.waitingForToken = true;
      // Request new token
      this.post(`${API_BASE}${API_AUTH}`, {
        client_secret: CLIENT_SECRET,
        client_id: CLIENT_ID,
        grant_type: 'client_credentials',
      }, true)
        .subscribe((data) => {
          this.auth_token = data.access_token;
          // Performe requests from request queue
          for (const i of this.requestQueue) {
            this.request(i.request).subscribe((r) => {
              i.subject.next(r);
            }, (error) => {
              i.subject.error(error);
            }, () => {
              i.subject.complete();
            });
          }
          this.requestQueue = [];
        }, (e) => {
          console.log('Error', e);
        }, () => {
        // Use a timeout to prevent a feedback loop
          setTimeout(() => {
            this.waitingForToken = false;
          }, 5000);
        });
    }
  }

  handleResponse(r, req, delay) {
    /* TODO: handle 503(service unavailable) responses
      adjust delay up when a 503 responses happens
      and retry
    */
    if(r.status == 503){
      this.fail_in_row[delay] = this.fail_in_row[delay] || 0;
      this.fail_in_row[delay]++;
      //Adjust rate
      this.request_rate += Math.ceil(10*this.fail_in_row[delay]/this.request_count[delay]);
    }else{
      this.fail_in_row[delay] = 0;  
    }
    console.log(this.request_rate);
    
    
    if (!r.ok) {
      // 401 Unauthorized
      if (r.status == 401 || r.status == 503) {
        // Add request to queue
        const resolver = new Subject();
        this.requestQueue.push({ request: req, subject: resolver, delay: this.request_rate });
        // Renew token if not waiting for token, because access denied
        this.renewToken();
        return resolver.asObservable();
      }
      return Observable.throw(r);
    }
    return r.json();
  }
  /** Performs a general request
   * @param {Request} url
   * @return Observable<{}>
   */
  request(request) {
    // Add token to request
    request.headers.set('Authorization', `Bearer ${this.auth_token}`);
    const resolver = new Subject();
    // Push request into request 'stream'/queue
    this.requestSubject.next({ request, subject: resolver, delay: this.request_rate });
    return resolver.asObservable();
  }
  /** performes a get request
   * @param {string} url
   * @param {params} {key: value}
   * @return Observable<{}>
   */
  get(url, params) {
    let pUrl = url;
    if (params) {
      pUrl += HttpServiceProvider.urlEncode(params);
    }
    // Create request
    const request = new Request(pUrl, { method: 'get' });
    return this.request(request);
  }

  static urlEncode(data) {
    let ret = '';
    for (const key in data) {
      if (ret != '') {
        ret += '&';
      }
      ret += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
    }
    return `?${ret}`;
  }
  /** Performs a post request
   * @param {string} url
   * @param {params} {key: value}
   * @param {boolean} url_encoded
   * @return Observable<{}>
   */
  post(url, body, url_encoded) {
    let pUrl = url;
    let pBody = body;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (url_encoded) {
      pUrl += HttpServiceProvider.urlEncode(pBody);
      headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      pBody = null;
    } else {
      pBody = JSON.stringify(pBody);
    }
    // Create request
    const request = new Request(pUrl, {
      method: 'POST',
      body: pBody,
      headers,
    });
    return this.request(request);
  }
}
// Export single instance
export const http = new HttpServiceProvider();
