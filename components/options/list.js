import React, { Component } from 'react'

export default class List extends Component{
  constructor(props){
    super(props);
    this.state = {
      collapse: false,
    }
  }
  toggleCollapse(){
    this.setState({
      collapse: !this.state.collapse
    });
  }
  render(){
    let attendees = this.props.attendees
    let category = this.props.category
    let orderby = this.props.orderby
    let asc = this.props.asc
    let onChange = this.props.onChange
    let collapse = this.state.collapse


    let userList = []

    if(!collapse)
      for(let attendee of attendees){
        userList.push(
          <tr key={attendee.id}>
            <td className='mdl-data-table__cell--non-numeric'>{ [attendee.firstname, attendee.lastname].join(' ') }</td>
            <td className='mdl-data-table__cell--non-numeric' colSpan="2">{ attendee.date.toLocaleString() }</td>
          </tr>
        )
      }
    let collapseContent = collapse ? (<i className="material-icons">keyboard_arrow_left</i>) : (<i className="material-icons">keyboard_arrow_down</i>)  
    let tableHeaders = [
      <th key="1" onClick={() => onChange("NAME",!asc)} className={'mdl-data-table__cell--non-numeric ' + (orderby=="NAME" ? (asc ? 'mdl-data-table__header--sorted-ascending' : 'mdl-data-table__header--sorted-descending' ) : '')} colSpan='1'>{category}</th>,
      <th key="2" onClick={() => onChange("DATE",!asc)} className={'mdl-data-table__cell--non-numeric ' + (orderby=="DATE" ? (asc ? 'mdl-data-table__header--sorted-ascending' : 'mdl-data-table__header--sorted-descending' ) : '')} colSpan='1'>Registreringsdato</th>,
      <th key="3" onClick={() => this.toggleCollapse()}>{collapseContent}</th>
    ]
    return (
      <tbody>
      <tr>
        { tableHeaders }
      </tr>
      { userList }
      </tbody>
    )
  }
}
