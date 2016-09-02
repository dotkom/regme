import List from './list'

const Attendees = () => {
  return (
    <div>
      <h3>Deltakere</h3>
      <table className='mdl-data-table mdl-js-data-table attendee-lists'>
        <List category='Møtt' />
        <List category='Ikke møtt' />
        <List category='Venteliste' />
      </table>
    </div>
  )
}

export default Attendees;
