import React, { Component } from 'react';
import { eventService } from 'services/event';

import Events from './events';
import Attendees from './attendees';

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      selectedEvent: null,
      events: [{ name: 'Loading...', id: 1 }],
    };
    this.eventSub = null;
  }
  componentDidMount() {
    eventService.getEvents().subscribe((events) => {
      this.setState(Object.assign({}, this.state, { events }), () => {
        this.selectedEvent = this.selectedEvent || events[0];
      });
    });
  }

  clickHandler() {
    this.setState(Object.assign({}, this.state, { showOptions: !this.state.showOptions }));
  }

  get events() {
    return this.state.events;
  }

  set selectedEvent(event) {
    if (this.eventSub) {
      this.eventSub.unsubscribe;
    }
    this.eventSub = event.attendees.subscribe((v) => {
      if (this.props.onOptionsChanged) {
        this.props.onOptionsChanged({
          event,
        });
      }
    });
    this.setState(Object.assign({}, this.state, { selectedEvent: event }), () => {
      if (this.props.onOptionsChanged) {
        this.props.onOptionsChanged({
          event,
        });
      }
    });
  }
  get selectedEvent() {
    return this.state.selectedEvent;
  }
  render() {
    let optionBody = '';
    if (this.state.showOptions) {
      optionBody = (
        <div className="options-content">
          <Events events={this.events} event={this.selectedEvent} onEventChanged={(event) => { this.selectedEvent = event; }} />
          <Attendees event={this.selectedEvent} />
        </div>
      );
    }
    return (
      <div className="options">
        <button onClick={() => { this.clickHandler(); }}>Alternativer</button>
        { optionBody }
      </div>
    );
  }

}

export default Options;

