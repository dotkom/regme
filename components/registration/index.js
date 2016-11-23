import React, { Component } from 'react'
import Input from './input'
import Status from './status'
import { Modal } from '../modal'
import { eventService } from 'services/event'
import { userService } from 'services/user'
import { attendeeService } from 'services/attendee'
import { Observable } from 'rxjs'
import { isRfid, showToast } from 'common/utils'

/**
 * Registration view. This is what the user see
 * as the initial outlook. The component should:
 *  - Show status of the system.
 *  - Handle input from user/RFID.
 *  - Show user stats in numbers.
 */
const Placeholders = {
  default: "Skriv inn RFID...",
  username: "Skriv inn brukernavn for å registrere RFID",
  passOrUser: "Skriv inn brukernavn eller RFID"
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
      placeholder: "default",
      showModal: false
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
  /*handleUsername(input){

  }*/
  get event(){
    return this.props.event;
  }
  handleSubmit(input){
    let responseStream = null
    this.update = {status:'WAIT',message: 'Venter...'}
    if(isRfid(input) && this.event){
      this.setState(Object.assign({},this.state,{
        pRfid: input
      }))
      responseStream = attendeeService.registerAttendee(this.event,input)
        
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
    if(!responseStream && (this.attendeeStatus.attend_status == 40 || this.attendeeStatus.attend_status == 50)){
      responseStream = attendeeService.registerRfid(input,this.pRfid,this.event)
    }
    
    if(responseStream){
      this.handleAttendeeResponse(responseStream)
    }else{
      this.update = {status:'ERROR',message: 'Invalid input!'}
    }
  }
  updateTime(){
    let date = new Date()
    this.setState(Object.assign({},this.state,{
      time: {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      }
    }))
  }
  handleAttendeeResponse(stream){
    stream.subscribe(v => {
      //this.event.refresh();
      attendeeService.getCached(v.attendee).register()
      this.update = {status:'OK',message: v.message}
      this.setState(Object.assign({},this.state,{
        attend_status: v,
        placeholder: "default",
        ivalue: ""
      }))
    },(v) => {
      this.updateTime()
      var toast = {
        message: v.message,
        timeout: 1500
      }
      showToast(toast);
      this.update = {status:'ERROR',message: v.message}
      let attendeeStatus = v
      let placeholder = "default"
      let ivalue = ""
      let showModal = false;
      switch(v.attend_status){
        case 50:
          placeholder = "passOrUser"
          break;
        case 40:
          placeholder = "username"
          break;
        case 30:
          showModal = true;
          /*this.update = {
            status: "WAIT",
            message: "Venter på bruker",
            showModal: true
          }
          console.log();*/
          break;
        
      }
      this.setState(Object.assign({},this.state,{
        attendee_status: attendeeStatus,
        placeholder: placeholder,
        ivalue: ivalue,
        showModal: showModal
      }))
    },() => this.updateTime())
  }

  acceptHandler () {
    attendeeService.registerAttendee(this.event, this.pRfid, true)
    this.update = {
      showModal: false
    }
  }

  declineHandler () {
    this.update = {
      showModal: false,
      status: 'ERROR',
      message: 'Denne brukeren ble ikke godkjent.'
    }
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
        <Modal show={this.state.showModal} accept={ () => this.acceptHandler() } decline={ () => this.declineHandler() } content="Denne persjonen er på venteliste. Vil du at personen skal slippe inn?" />
      </div>
    )
  }
}

export default Registration
