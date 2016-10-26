import React, { Component } from 'react'
import Input from './input'
import Status from './status'
import { eventService } from 'services/event'
import { userService } from 'services/user'
import { attendeeService } from 'services/attendee'
import { Observable } from 'rxjs'
/**
 * Registration view. This is what the user see
 * as the initial outlook. The component should:
 *  - Show status of the system.
 *  - Handle input from user/RFID.
 *  - Show user stats in numbers. 
 */
const Placeholders = {
  default: "Skriv inn RFID...",
  username: "Skriv inn brukernavn for å registrere RFID"
}

class Registration extends Component {
  constructor (props) {
    super(props)
    let date = new Date()

    this.state = {
      time: {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      },
      event: null,
      /*attendees: {
        listed: 0,
        registered: 0,
        waiting: 0,
      },*/
      status: '',
      message: null,
      attendee_status: {},
      ivalue: null,
      pRfid: null,
      placeholder: "default"
    }
  }

  /**
   * This is called when the status gets updated
   * and needs to save the timestamp.
   */
  updateTime () {
    let date = new Date()
    this.setState(Object.assign({}, this.state, {
      time: {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      }
    }))
  }

  set update (update) {
    this.setState(Object.assign({}, this.state, update))
  }
  
  componentDidMount () {
    this.updateTime()

    eventService.getEvents().subscribe((events) => {
      this.updateTime()
      this.update = {status: 'OK',message: 'Systemet er klar til bruk!'}
    }, error => {
      this.update = {status: 'ERROR', message: 'Kunne ikke hente inn events!'}
    })
  }
  get attendeeStatus(){
    return this.state.attendee_status
  }
  get pRfid(){
    return this.state.pRfid
  }
  static isRfid(rfid){

  }
  /*handleUsername(input){

  }*/
  get event(){
    return this.props.event || this.state.event;
  }
  handleSubmit(input){
    let responseStream = null
    this.update = {status:'WAIT',message: 'Venter...'}
    if(this.attendeeStatus.attend_status == 40){
      //Check if is rfid
      if(!isRfid){
        responseStream = attendeeService.registerRfid(input,this.pRfid,this.event.id);
      }
    }
    else if(this.event){
      this.setState(Object.assign({},this.state,{
        pRfid: input
      }))
      responseStream = attendeeService.registerAttendee(this.event.id,input)
        
      /**
       * Get user from rfid ->
       *  failed:  
       *    Prompt for username -> Try to assign rfid to username ->
       *      success: <- success
       *  success:
       *    Try to register ->
       *      success:
       *        move attendee from notAttended to attending ->
       *          push changes
       *      fail:
       *        kill app
       */
    }
    if(responseStream){
      this.handleAttendeeResponse(responseStream)
    }
  }

  handleAttendeeResponse(stream){
    stream.subscribe(v => {
      this.update = {status:'OK',message: v.message}
      this.setState(Object.assign({},this.state,{
        attend_status: v,
        placeholder: "default",
        ivalue: ""
      }))
    },(v) => {
      this.update = {status:'ERROR',message: v.message}
      let attendeeStatus = v
      let placeholder = "default"//this.state.placeholder
      let ivalue = ""
      
      switch(v.attend_status){
        case 40:
          placeholder = "username"
          break;
        case 30:
          //venteliste
          break;
      }
      this.setState(Object.assign({},this.state,{
        attendee_status: attendeeStatus,
        placeholder: placeholder,
        ivalue: ivalue
      }))
    })
  }
  render () {
    let event = this.event
    return (
      <div>
        <h3>{ event ? event.name : '' } { (event && event.company) ? event.company.name : "" }</h3>
        <Status message={ this.state.message }
          time={ this.state.time }
          statusCode={ this.state.status } />
        <Input value={ this.state.ivalue } placeholder={Placeholders[this.state.placeholder]} onSubmit={ (input) => this.handleSubmit(input) } />
        <p>
          <span>Møtt: { event ? event.registeredCount : 0}</span>
          &nbsp;- <span>Påmeldt: { event ? event.totalCount : 0 }</span>
          &nbsp;- <span>Plasser: { event ? event.capacity : 0 }</span></p>
      </div>
    )
  }
}

export default Registration

