import React, { Component } from 'react';


import { attendeeService } from 'services/attendee';


class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  componentDidMount(){
    if(this.props.event)
      this.selected = this.props.event;
  }
  set selected(event) {
    if(!event.hasAttendees())
      attendeeService.getAttendees(event).subscribe((attendees) => {
        attendees.sort((a, b) => a.date - b.date);
        for (const i of attendees) {
          event.addAttendee(i);
        }
      });
    this.setState(Object.assign({}, this.state, { selected: event }));
    if (this.props.onEventChanged) {
      this.props.onEventChanged(event);
    }
  }
  
  get selected() {
    return this.state.selected;
  }

  render() {
    const eventButtons = [];
    for (const event of this.props.events) {
      let btnClass = '';
      if (this.selected && this.selected.id === event.id) {
        btnClass = 'selected';
      }
      eventButtons.push(
        <button className={btnClass} onClick={() => { this.selected = event; }}
           key={event.id}>{event.name}</button>
      );
    }

    return (
      <div className="events">
        <h2>Arrangementer</h2>
        <div>
          { eventButtons }
        </div>
      </div>
    );
  }
}

export default Events;
