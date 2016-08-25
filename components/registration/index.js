import Input from './input'
import Status from './status'

/**
 * Registration view. This is what the user see
 * as the initial outlook. The component should:
 *  - Show status of the system.
 *  - Handle input from user/RFID.
 *  - Show user stats in numbers. 
 */
const Registration = React.createClass({
  getInitialState: function () {
    let date = new Date()
    return {
      time: {
        hour: date.getHours()
        ,minute: date.getMinutes()
        ,second: date.getSeconds()
      },
      attendees: {
        listed: 0
        ,registered: 0
        ,waiting: 0
      }
    }
  },

  /**
   * This is called when the status gets updated
   * and needs to save the timestamp.
   */
  updateTime: function () {
    let date = new Date()
    this.setState(Object.assign({}, this.state, {
      time: {
        hour: date.getHours()
        ,minute: date.getMinutes()
        ,second: date.getSeconds()
      }
    }))
  },
  componentDidMount: function () {
    this.updateTime()
  },
  render: function () {
    return (
      <div>
        <h3>{ this.props.title }</h3>
        <Status message="Systemet er klar til bruk!"
          time={ this.state.time } />
        <Input placeholder="Skriv inn RFID eller brukernavn..." />
        <p>
          <span>Møtt: { this.state.attendees.registered}</span>
          &nbsp;- <span>Påmeldt: { this.state.attendees.listed
            + this.state.attendees.waiting}</span>
          &nbsp;- <span>Plasser: { this.state.attendees.registered}</span></p>
      </div>
    )
  }
})

export default Registration
