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
      attendees: {
        listed: 0,
        registered: 0,
        waiting: 0,
      },
      status: '',
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

    eventService.getEvents().subscribe(() => {
      this.updateTime()
      this.update = {status: 'OK'}
    }, error => {
      this.update = {status: 'ERROR'}
    })
  }
  get attendeeStatus(){
    return this.state.attendee_status
  }
  get pRfid(){
    return this.state.pRfid
  }
  handleUsername(input){

  }

  handleSubmit(input){
    let responseStream = null
    console.log(this.attendeeStatus.attend_status,this.pRfid)
    if(this.attendeeStatus.attend_status == 40){
      attendeeService.registerRfid(input,this.pRfid).subscribe(v=>{
        console.log(v)
      })
    }
    else if(this.props.event){
      this.setState(Object.assign({},this.state,{
        pRfid: input
      }))
      responseStream = attendeeService.registerAttendee(this.props.event.id,input)
        
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
      this.handleAttendeeRequest(responseStream)
    }
  }

  handleAttendeeRequest(stream){
    stream.subscribe(v => {
      console.log("Success",v)
      this.setState(Object.assign({},this.state,{
        attend_status: v,
        placeholder: "default",
        ivalue: ""
      }))
    },(v) => {
      console.log("Error ", v)
      let attendeeStatus = v
      let placeholder = this.state.placeholder
      let ivalue = ""
      if(v.attend_status == 40){
        placeholder = "username"
      }
      console.log(placeholder)

      this.setState(Object.assign({},this.state,{
        attendee_status: attendeeStatus,
        placeholder: placeholder,
        ivalue: ivalue
      }))
    })
  }
  render () {
    let event = this.props.event
    return (
      <div>
        <h3>{ this.props.title } { (event && event.company) ? event.company.name : "" }</h3>
        <Status message='Systemet er klar til bruk!'
          time={ this.state.time }
          statusCode={ this.state.status } />
        <Input value={ this.state.ivalue } placeholder={Placeholders[this.state.placeholder]} onSubmit={ (input) => this.handleSubmit(input) } />
        <p>
          <span>Møtt: { this.state.attendees.registered}</span>
          &nbsp;- <span>Påmeldt: { this.state.attendees.listed
            + this.state.attendees.waiting}</span>
          &nbsp;- <span>Plasser: { this.state.attendees.registered}</span></p>
      </div>
    )
  }
}

export default Registration

