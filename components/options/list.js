import React, { Component } from 'react';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
  }
  toggleCollapse() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }
  render() {
    const attendees = this.props.attendees;
    const category = this.props.category;
    const orderby = this.props.orderby;
    const asc = this.props.asc;
    const onChange = this.props.onChange;
    const collapse = this.state.collapse;

    const userList = [];

    if (!collapse) {
      for (const attendee of attendees) {
        userList.push(
          <tr key={attendee.id}>
            <td>{ [attendee.firstname, attendee.lastname].join(' ') }</td>
            <td>{ attendee.date.toLocaleString() }</td>
          </tr>
        );
      }
      if (attendees.length !== 0) {
        userList.push(
          <tr key="spacer" className="spacer" />
        )
      }
    }
    let ascDescName = '';
    let ascDescDate = '';
    if (orderby === 'NAME') {
      if (asc) {
        ascDescName = <i className="fa fa-sort-asc fa-stack-1x" />;
      } else {
        ascDescName = <i className="fa fa-sort-desc fa-stack-1x" />;
      }
    } else if (orderby === 'DATE') {
      if (asc) {
        ascDescDate = <i className="fa fa-sort-asc fa-stack-1x" />;
      } else {
        ascDescDate = <i className="fa fa-sort-desc fa-stack-1x" />;
      }
    }
    let indicator = '';
    if (category !== 'Venteliste') {
      indicator = <i className="fa fa-sort fa-stack-1x" />;
    }
    const tableHeaders = [
      <th key="1" onClick={() => onChange('NAME', !asc)} ><span className="fa-stack">{indicator}{ascDescName}</span> {category}</th>,
      <th key="2" onClick={() => onChange('DATE', !asc)} >Registreringsdato <span className="fa-stack">{indicator}{ascDescDate}</span></th>
    ];
    return (
      <tbody>
        <tr>
          { tableHeaders }
        </tr>
        { userList }
      </tbody>
    );
  }
}
