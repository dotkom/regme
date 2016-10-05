import React, { Component } from 'react'

import Events from './events'
import Attendees from './attendees'


class Options extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showOptions: false,
      selectedEvent: null
    }
  }
  clickHandler(){
    this.setState(Object.assign({}, this.state, {showOptions: !this.state.showOptions }))
  }
  set event(event){
    this.setState(Object.assign({},this.state,{selectedEvent: event}))
    console.log(event);
  }
  render(){
    let optionBody = ''
    if(this.state.showOptions){
      optionBody = (
        <div>
          <Events onEventChanged={ (event) => {this.event = event} }/>
          <Attendees />
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

export default Options;

