import { eventService } from 'services/event';
import React, { Component } from 'react'

class Events extends Component {
  constructor (props) {
    super(props)
    this.state = {
      events: [{name: "Loading...", id:1}]
    }
  }

  componentDidMount () {
    eventService.getEvents().subscribe( ( events ) => {
      this.setState(Object.assign({}, this.state, { events: events }))
    })
  }

  render () {
    let eventButtons = []

    for(let event of this.state.events){
      eventButtons.push(
        <a className='mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect' key={event.id}>{event.name}</a>
      )
    }

    return (
      <div>
        <h3>Arrangementer</h3>
        <div className='event-button-div'>
          { eventButtons }
        </div>
      </div>
    )
  }
}

export default Events
