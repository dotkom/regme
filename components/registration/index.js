import Input from './input'
import Status from './status'

const Registration = React.createClass({
  getInitialState: function () {
    return {
      time: {
        hour: 0
        ,minute: 0
        ,second: 0
      }
    }
  },
  componentDidMount: function () {
    setInterval(() => {
      let date = new Date()
      this.setState(Object.assign({}, this.state, {
        time: {
          hour: date.getHours()
          ,minute: date.getMinutes()
          ,second: date.getSeconds()
        }
      }))
    }, 1000)
  },
  render: function () {
    return (
      <div>
        <div>Registrering!</div>
        <Status message="Systemet er klar til bruk!"
          time={ this.state.time } />
        <Input placeholder="Skriv inn RFID eller brukernavn..." />
      </div>
    )
  }
})

export default Registration
