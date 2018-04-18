import React, { Component } from 'react';
import Input from './input';
import Status from './status';
import { Modal } from '../modal';
import { eventService } from 'services/event';
import { userService } from 'services/user';
import { attendeeService } from 'services/attendee';
import { Observable } from 'rxjs';
import { isRfid } from 'common/utils';

/**
 * Registration view. This is what the user see
 * as the initial outlook. The component should:
 *  - Show status of the system.
 *  - Handle input from user/RFID.
 *  - Show user stats in numbers.
 */
const Placeholders = {
  default: 'Fyll inn RFID eller Online-brukernavn...',
  username: 'Fyll inn brukernavn for å registrere RFID...',
};

class Registration extends Component {
  constructor(props) {
    super(props);
    const date = new Date();

    this.state = {
      time: {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      },
      status: '',
      message: null,
      attendee_status: {},
      ivalue: null,
      pValue: null,
      placeholder: 'default',
      showModal: false,
    };
  }

  /**
   * This is called when the status gets updated
   * and needs to save the timestamp.
   */

  updateTime() {
    const date = new Date();
    this.setState(Object.assign({}, this.state, {
      time: {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      },
    }));
  }

  set update(update) {
    this.setState(Object.assign({}, this.state, update));
  }
  
  componentWillReceiveProps(props){
    if(props.event && !props.event.hasAttendees()){
      this.updateTime();
      this.update = { status: 'WAIT', message: 'Henter deltagere...' };      
      attendeeService.getAttendees(props.event).subscribe((attendees) => {
        this.update = { status: 'OK', message: 'Systemet er klar til bruk!' };      
      }, () => {
        this.update = { status: 'ERROR', message: 'Kunne ikke hente inn deltagere!' };      
      });
    }
  }

  componentDidMount() {
    this.updateTime();
    this.update = { status: 'WAIT', message: 'Henter arrangemententer...' };      
    eventService.getEvents().subscribe((events) => {
      this.updateTime();
      this.update = { status: 'OK', message: 'Systemet er klar til bruk!' };
    }, (error) => {
      this.update = { status: 'ERROR', message: 'Kunne ikke hente inn arrangement!' };
    });
  }

  get attendeeStatus() {
    return this.state.attendee_status;
  }

  get event() {
    return this.props.event;
  }

  handleSubmit(input) {
    let responseStream = null;
    this.update = { status: 'WAIT', message: 'Venter...' };
    //Only try to bind rfid to user if input is a username and not an rfid
    if (!isRfid(input) && isRfid(this.state.pInput) && 
      (this.attendeeStatus.attend_status == 40 || this.attendeeStatus.attend_status == 50 || this.attendeeStatus.attend_status == 51)
    ) {
      responseStream = attendeeService.registerRfid(input, this.state.pInput, this.event);
    } else if (this.event) {
      this.setState(Object.assign({}, this.state, {
        pInput: input
      }));
      responseStream = attendeeService.registerAttendee(this.event, input);
    }
    
    if (responseStream) {
      this.handleAttendeeResponse(responseStream);
    } else {
      this.update = { status: 'ERROR', message: 'Invalid input!' };
    }
  }

  handleAttendeeResponse(stream) {
    stream.subscribe((v) => {
      // this.event.refresh();
      attendeeService.getCached(v.attendee).register();
      this.update = { status: 'OK', message: v.message != null ? v.message : message };
      this.setState(Object.assign({}, this.state, {
        attend_status: v,
        placeholder: 'default',
        ivalue: '',
      }));
    }, (v) => {
      this.updateTime();
      this.update = { status: 'ERROR', message: v.message };
      const attendeeStatus = v;
      let placeholder = 'default';
      const ivalue = '';
      let showModal = false;
      switch (v.attend_status) {

        case 51:
        case 50:
          placeholder = 'default';
          break;
        case 40:
          placeholder = 'username';
          break;
        case 30:
          showModal = true;
          /* this.update = {
            status: "WAIT",
            message: "Venter på bruker",
            showModal: true
          }
          console.log();*/
          break;

      }
      this.setState(Object.assign({}, this.state, {
        attendee_status: attendeeStatus,
        placeholder,
        ivalue,
        showModal,
      }));
    }, () => this.updateTime());
  }

  acceptHandler() {
    const userOrRfid = this.state.pInput;
    this.handleAttendeeResponse(attendeeService.registerAttendee(this.event, userOrRfid, true));
    this.update = {
      showModal: false,
    };
  }

  declineHandler() {
    this.update = {
      showModal: false,
      status: 'ERROR',
      message: 'Denne brukeren ble ikke godkjent.',
    };
  }

  render() {
    const event = this.event;
    return (
      <div className="registration">
        <h1>
          { event ? event.name : '' } { (event && event.company) ? event.company.name : '' }
        </h1>
        <Status
          message={this.state.message}
          time={this.state.time}
          statusCode={this.state.status}
        />
        <Input value={this.state.ivalue} placeholder={Placeholders[this.state.placeholder]} onSubmit={input => this.handleSubmit(input)} />
        <p>
          <span>Møtt: { event ? event.registeredCount : 0}</span>
          &nbsp;- <span>Påmeldt: { event ? event.totalCount : 0 }</span>
          &nbsp;- <span>Plasser: { event ? event.capacity : 0 }</span></p>
        <Modal show={this.state.showModal} accept={() => this.acceptHandler()} decline={() => this.declineHandler()} content="Denne personen er på venteliste. Vil du at personen skal slippe inn?" />
      </div>
    );
  }
}

export default Registration;
