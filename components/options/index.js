import React, { Component } from 'react'
import { eventService } from 'services/event';

import Events from './events'
import Attendees from './attendees'

class Options extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showOptions: false,
      selectedEvent: null,
      events: [{name: "Loading...", id:1}],
    }
  }
  componentDidMount () {
    eventService.getEvents().subscribe( ( events ) => {
      this.setState(Object.assign({}, this.state, { events: events }),()=>{
        this.selectedEvent = this.selectedEvent || events[0]
      })
    })
  }
  
  clickHandler(){
    this.setState(Object.assign({}, this.state, {showOptions: !this.state.showOptions}))
  }
  get events(){
    return this.state.events;
  }
  set selectedEvent(event){
    this.setState(Object.assign({},this.state,{selectedEvent: event}),() => {
      if(this.props.onOptionsChanged){
        this.props.onOptionsChanged({
          event: event
        })
      }
    })
  }
  get selectedEvent(){
    return this.state.selectedEvent
  }
  render(){
    let optionBody = ''
    if(this.state.showOptions){
      optionBody = (
        <div>
          <Events events={this.events} event={ this.selectedEvent } onEventChanged={ (event) => {this.selectedEvent = event} } />
          <Attendees event={ this.selectedEvent } />
        </div>
      )
    }
    return(
      <div>
        <a className='mdl-button mdl-js-button mdl-button--raised  mdl-js-ripple-effect mdl-button--accent' onClick={ () => {this.clickHandler()} }>Alternativer</a>
        { optionBody }
      </div>
    )  
  }

}

export default Options

