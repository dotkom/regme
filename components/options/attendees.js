import { BASE } from "common/constants";

import React, { Component } from 'react'

import List from './list'

const orderMap = {
  'NAME': (c) => c ? ( (a,b) => (a.lfullname > b.lfullname) ? -1 : 1 ) : ( (a,b) => (a.lfullname < b.lfullname) ? -1 : 1),
  'DATE': (c) => c ? ( (a,b) => a.date - b.date ) : ( (a,b) => b.date - a.date )
}

class Attendees extends Component{

  constructor(props){
    super(props)
    this.state = {
      waitlist: [],
      attending: [],
      notAttended: [],
      orderby: 'DATE',
      asc: true
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
        this.setState(Object.assign({},this.state,{
          waitlist: attendees.waitlist.slice(0),
          attending: attendees.attending.slice(0),
          notAttended: attendees.notAttended.slice(0)
        }),()=>{
          this.reorder(this.state.orderby,this.state.asc);
        })
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
  
  reorder(orderby,asc){
    let ofunc = orderMap[orderby](asc);
    
    this.setState(Object.assign({},this.state,{
      waitlist: this.state.waitlist.slice(0).sort(orderMap['DATE'](true)),
      attending: this.state.attending.slice(0).sort(ofunc),
      notAttended: this.state.notAttended.slice(0).sort(ofunc),
      asc: asc,
      orderby: orderby
    }))

  }

  exportPDF(){
    window.location.href = BASE + "events/" + this.props.event.id + "/attendees/";
  }

  render(){
    return (
      <div>
        <h3>Deltakere</h3>
        <input type="button" value="Eksporter til PDF" onClick={ () => this.exportPDF() } className="mdl-button mdl-button--colored" />
        <table className='mdl-data-table mdl-js-data-table attendee-lists'>
          <List asc={this.state.asc} orderby={this.state.orderby} onChange={(a,b) => this.reorder(a,b)} category='Møtt' attendees={this.state.attending} />
          <List asc={this.state.asc} orderby={this.state.orderby} onChange={(a,b) => this.reorder(a,b)} category='Ikke møtt' attendees={this.state.notAttended} />
          <List asc={true} orderby={'DATE'} onChange={()=>{}} category='Venteliste' attendees={this.state.waitlist} />
        </table>
      </div>
    )
  }
}

export default Attendees;
