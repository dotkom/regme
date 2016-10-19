import React, { Component } from 'react'
import Input from './input'
import Status from './status'
import { eventService } from 'services/event'

import { Observable } from 'rxjs'
/**
 * Registration view. This is what the user see
 * as the initial outlook. The component should:
 *  - Show status of the system.
 *  - Handle input from user/RFID.
 *  - Show user stats in numbers. 
 */
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
      status: ''
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
  handleSubmit(input){
    alert(input);
    //Temp, false clears input field
    //True keeps input field
    return Observable.of(false)
  }
  render () {
    return (
      <div>
        <h3>{ this.props.title }</h3>
        <Status message='Systemet er klar til bruk!'
          time={ this.state.time }
          statusCode={ this.state.status } />
        <Input placeholder='Skriv inn RFID eller brukernavn...' onSubmit={ (input) => this.handleSubmit(input) } />
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
