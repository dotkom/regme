const Events = () => {
  let eventButtons = []
  for(let i = 0; i < 4; i++){
    eventButtons.push(
      <a className='mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect' key={i}>Event name</a>
    )
  }
  return (
    <div>
      <h3>Arrangementer</h3>
      <div className='event-button-div'>
        { eventButtons }
      </div>

    </div>
  )
}

export default Events;
