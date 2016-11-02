
import React, { Component } from 'react'

import List from './list'

class Attendees extends Component{

  constructor(props){
    super(props)
    this.state = {
      waitlist: [],
      attending: [],
      notAttended: []
    }
    this.attendeesSub = null
  }

  componentWillReceiveProps(props){
    this.resub(props);
  }
  resub(props){
    if(this.attendeesSub){
      this.attendeesSub.unsubscribe()
      this.attendeesSub = null
    }
    if(props.event){
      this.attendeesSub = props.event.attendees.subscribe((attendees)=>{
        console.log(attendees);
        this.setState(Object.assign({},this.state,{
          waitlist: attendees.waitlist.slice(0),
          attending: attendees.attending.slice(0),
          notAttended: attendees.notAttended.slice(0)
        }))
      })
    }
  }
  componentWillMount(){
    this.resub(this.props);
  }
  componentWillUnmount(){
    if(this.attendeesSub){
      this.attendeesSub.unsubscribe()
    }
  }
  
  render(){
    return (
      <div>
        <h3>Deltakere</h3>
        <table className='mdl-data-table mdl-js-data-table attendee-lists'>
          <List category='Møtt' attendees={this.state.attending} />
          <List category='Ikke møtt' attendees={this.state.notAttended} />
          <List category='Venteliste' attendees={this.state.waitlist} />
        </table>
      </div>
    )
  }
}

export default Attendees;
