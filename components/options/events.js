import React, { Component } from 'react';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.event,
    };
  }
  set selected(event) {
    this.setState(Object.assign({}, this.state, { selected: event }));
    if (this.props.onEventChanged) {
      this.props.onEventChanged(event);
    }
  }
  get selected() {
    return this.state.selected;
  }
  appendMDL(ref) {
    if (ref) {
      // componentHandler.upgradeElement(ref);
    }
  }
  render() {
    const eventButtons = [];
    for (const event of this.props.events) {
      let btnClass = '';
      if (this.selected && this.selected.id === event.id) {
        btnClass = 'selected';
      }
      eventButtons.push(
        <button ref={a => this.appendMDL(a)} className={btnClass} onClick={() => { this.selected = event; }}
           key={event.id}>{event.name}</button>
      );
    }

    return (
      <div className="events">
        <h2>Arrangementer</h2>
        { eventButtons }
      </div>
    );
  }
}

export default Events;
