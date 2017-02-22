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
            <td className="cell-non-numeric">{ [attendee.firstname, attendee.lastname].join(' ') }</td>
            <td className="cell-non-numeric" colSpan="2">{ attendee.date.toLocaleString() }</td>
          </tr>
        );
      }
    }
    const tableHeaders = [
      <th key="1" onClick={() => onChange('NAME', !asc)} className='cell-non-numeric' colSpan="1">{category}</th>,
      <th key="2" onClick={() => onChange('DATE', !asc)} className='cell-non-numeric' colSpan="1">Registreringsdato</th>,
      <th key="3" onClick={() => this.toggleCollapse()}>{collapseContent}</th>,
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
