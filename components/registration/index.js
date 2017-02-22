import React, { Component } from 'react';
import Input from './input';
import Status from './status';
import { Modal } from '../modal';
import { eventService } from 'services/event';
import { userService } from 'services/user';
import { attendeeService } from 'services/attendee';
import { Observable } from 'rxjs';
import { isRfid, showToast } from 'common/utils';

/**
 * Registration view. This is what the user see
 * as the initial outlook. The component should:
 *  - Show status of the system.
 *  - Handle input from user/RFID.
 *  - Show user stats in numbers.
 */
const Placeholders = {
  default: 'Fyll inn RFID eller brukernavn',
  username: 'Fyll inn brukernavn for å registrere RFID',
  passOrUser: 'Fyll inn brukernavn eller RFID',
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
      pRfid: null,
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

  componentDidMount() {
    this.updateTime();

    eventService.getEvents().subscribe((events) => {
      this.updateTime();
      this.update = { status: 'OK', message: 'Systemet er klar til bruk!' };
    }, (error) => {
      this.update = { status: 'ERROR', message: 'Kunne ikke hente inn events!' };
    });
  }
  get attendeeStatus() {
    return this.state.attendee_status;
  }
  get pRfid() {
    return this.state.pRfid;
  }
  get pUsername() {
    return this.state.pUsername;
  }
  get event() {
    return this.props.event;
  }
  handleSubmit(input) {
    let responseStream = null;
    this.update = { status: 'WAIT', message: 'Venter...' };
    if (this.event) {
      this.setState(Object.assign({}, this.state, {
        pRfid: isRfid(input) ? input : null,
        pUsername: isRfid(input) ? null : input,
      }));
      responseStream = attendeeService.registerAttendee(this.event, input);
    }
    if (!responseStream && (this.attendeeStatus.attend_status == 40 || this.attendeeStatus.attend_status == 50)) {
      responseStream = attendeeService.registerRfid(input, this.pRfid, this.event);
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
      this.update = { status: 'OK', message: v.message };
      this.setState(Object.assign({}, this.state, {
        attend_status: v,
        placeholder: 'default',
        ivalue: '',
      }));
    }, (v) => {
      this.updateTime();
      const toast = {
        message: v.message,
        timeout: 1500,
      };
      showToast(toast);
      this.update = { status: 'ERROR', message: v.message };
      const attendeeStatus = v;
      let placeholder = 'default';
      const ivalue = '';
      let showModal = false;
      switch (v.attend_status) {
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
    const userOrRfid = this.pRfid != null ? this.pRfid : this.pUsername;
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
      <div className="registration-container">
        <h3 className="event-title">
          { event ? event.name : '' } { (event && event.company) ? event.company.name : '' }
        </h3>
        <Status
          message={this.state.message}
          time={this.state.time}
          statusCode={this.state.status}
        />
        <hr />
        <Input value={this.state.ivalue} placeholder={Placeholders[this.state.placeholder]} onSubmit={input => this.handleSubmit(input)} />
        <hr />
        <p>
          <span>Møtt: { event ? event.registeredCount : 0}</span>
          &nbsp;- <span>Påmeldt: { event ? event.totalCount : 0 }</span>
          &nbsp;- <span>Plasser: { event ? event.capacity : 0 }</span></p>
        <Modal show={this.state.showModal} accept={() => this.acceptHandler()} decline={() => this.declineHandler()} status="danger" icon="error_outline" content="Denne persjonen er på venteliste. Vil du at personen skal slippe inn?" />
      </div>
    );
  }
}

export default Registration;
