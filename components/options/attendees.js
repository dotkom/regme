import List from './list'

const Attendees = ( {event} ) => {
  let hasMeet = []
  let notMeet = []
  let waitingList = []
  let pushTo = null
  if(event){
    for(let attendee of event.attendees){
      if(attendee.isRegistered()){
        pushTo = hasMeet
      }else if(attendee.isPrimary()){
        pushTo = notMeet
      }else{
        pushTo = waitingList
      }
      pushTo.push(attendee)
    }
  }
  return (
    <div>
      <h3>Deltakere</h3>
      <table className='mdl-data-table mdl-js-data-table attendee-lists'>
        <List category='Møtt' attendees={hasMeet} />
        <List category='Ikke møtt' attendees={notMeet} />
        <List category='Venteliste' attendees={waitingList} />
      </table>
    </div>
  )
}

export default Attendees;
