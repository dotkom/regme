import React, { Component } from 'react';
import Input from './input';
import StatusComponent from './status';
import { Modal } from '../modal';
import { EventService } from 'services/event';
import { userService } from 'services/user';
import { AttendeeService } from 'services/attendee';
import { StatusService, Status } from 'services/status';
import { OidcService } from 'services/auth';
import { Observable } from 'rxjs';
import { isRfid } from 'common/utils';


import { ServiceContext } from 'services/ServiceProvider';


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
      status: null,
      message: null,
      attendee_status: {},
      ivalue: null,
      pValue: null,
      placeholder: 'default',
      showModal: false,
      loggedIn: false,
    };
  }

  /**
   * This is called when the status gets updated
   * and needs to save the timestamp.
   */

  updateStatus(status){
    this.setState({
      status: status
    })
  }

  set update(update) {
    this.setState(Object.assign({}, this.state, update));
  }
  
  componentWillReceiveProps(props){
    if(props.event && !props.event.hasAttendees()){
      //this.updateTime();
      //this.update = { status: 'WAIT', message: 'Henter deltagere...' };      
      if (this.attendeeService) {
        this.attendeeService.getAttendees(props.event).subscribe((attendees) => {
          this.updateStatus(new Status('OK', 'Systemet er klar til bruk!'));
        });
      }
    }
  }

  componentDidMount() {
    //this.updateTime();
    //this.update = { status: 'WAIT', message: 'Henter arrangemententer...' };      
    this.context.getServices(AttendeeService, StatusService, EventService, OidcService).subscribe((services) => {
      this.attendeeService = services[AttendeeService];
      this.statusService = services[StatusService];
      this.eventService = services[EventService];
      this.authService = services[OidcService];
      this.authService.onUserChange((user) => {
        this.setState({
          loggedIn: !!user
        });
      });
      this.statusService.onStatusUpdate().subscribe((newStatus) => {
        this.updateStatus(newStatus);
      })
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
    //this.update = { status: 'WAIT', message: 'Venter...' };
    //Only try to bind rfid to user if input is a username and not an rfid
    if (!isRfid(input) && isRfid(this.state.pInput) && 
      (this.attendeeStatus.attend_status == 40 || this.attendeeStatus.attend_status == 50 || this.attendeeStatus.attend_status == 51)
    ) {
      responseStream = this.attendeeService.registerRfid(input, this.state.pInput, this.event);
    } else if (this.event) {
      this.setState(Object.assign({}, this.state, {
        pInput: input
      }));
      responseStream = this.attendeeService.registerAttendee(this.event, input);
    }
    
    if (responseStream) {
      this.handleAttendeeResponse(responseStream);
    }
  }

  handleAttendeeResponse(stream) {
    stream.subscribe(({ detail }) => {
      // this.event.refresh();
      this.attendeeService.getCached(detail.attendee).register();
      this.updateStatus(new Status('OK', detail.message));
      this.setState(Object.assign({}, this.state, {
        attend_status: detail,
        placeholder: 'default',
        ivalue: '',
      }));
    }, ({ detail }) => {
      this.updateStatus(new Status('ERROR', detail.message));
      const attendeeStatus = detail;
      let placeholder = 'default';
      const ivalue = '';
      let showModal = false;
      switch (detail.attend_status) {

        case 51:
        case 50:
          placeholder = 'default';
          break;
        case 40:
          placeholder = 'username';
          break;
        case 30:
          showModal = true;
          break;

      }
      this.setState(Object.assign({}, this.state, {
        attendee_status: attendeeStatus,
        placeholder,
        ivalue,
        showModal,
      }));
    }, () => {
      /*this.updateTime() */
    });
  }

  acceptHandler() {
    const userOrRfid = this.state.pInput;
    this.handleAttendeeResponse(this.attendeeService.registerAttendee(this.event, userOrRfid, true));
    this.update = {
      showModal: false,
    };
  }

  declineHandler() {
    this.update = {
      showModal: false,
      status: new Status('Error', 'Denne brukeren ble ikke godkjent.')
    };
  }

  render() {
    const event = this.event;
    return (
      <div className="registration">
        <h1>
          { event ? event.name : '' } { (event && event.company) ? event.company.name : '' }
        </h1>

        {this.state.status ? <StatusComponent
          status = {this.state.status}
        /> : null}
        <Input value={this.state.ivalue} placeholder={Placeholders[this.state.placeholder]} onSubmit={input => this.handleSubmit(input)} />
        <p>
          <span>Møtt: { event ? event.registeredCount : 0}</span>
          &nbsp;- <span>Påmeldt: { event ? event.totalCount : 0 }</span>
          &nbsp;- <span>Plasser: { event ? event.capacity : 0 }</span></p>
        <Modal show={this.state.showModal} accept={() => this.acceptHandler()} decline={() => this.declineHandler()}>
          Denne personen er på venteliste. Vil du at personen skal slippe inn?
        </Modal>
      </div>
    );
  }
}

Registration.contextType = ServiceContext;

export default Registration;
