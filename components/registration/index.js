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
        <h3>{ this.props.title }</h3>
        <Status message="Systemet er klar til bruk!"
          time={ this.state.time } />
        <Input placeholder="Skriv inn RFID eller brukernavn..." />
      </div>
    )
  }
})

export default Registration
