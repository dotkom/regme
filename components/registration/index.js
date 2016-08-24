import Input from './input'
import Status from './status'

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
  updateTime: function (evt) {
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
