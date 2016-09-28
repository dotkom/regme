import { eventService } from 'services/event';

const Events = React.createClass({
  getInitialState: function(){
    return {
      events: [{name: "Loading...",id:1}]
    }
  },
  componentDidMount: function(){
    eventService.getEvents().subscribe( (events) => {
      this.setState(Object.assign({},this.state,{events: events}))
    })
  },
  render: function(){
    let eventButtons = []
    for(let event of this.state.events){
      eventButtons.push(
        <a className='mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect' key={event.id}>{event.name}</a>
      )
    }
    return (<div>
      <h3>Arrangementer</h3>
      <div className='event-button-div'>
        { eventButtons }
      </div>
    </div>)
  }
})



export default Events
