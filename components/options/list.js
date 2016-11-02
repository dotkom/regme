const List = ({ category, attendees }) => {

  let userList = []

  for(let attendee of attendees){
    userList.push(
      <tr key={attendee.id}>
        <td className='mdl-data-table__cell--non-numeric'>{ [attendee.firstname, attendee.lastname].join(' ') }</td>
        <td className='mdl-data-table__cell--non-numeric'>{ attendee.date.toLocaleString() }</td>
      </tr>
    )
  }
  return (
    <tbody>
    <tr>
      <th className='mdl-data-table__cell--non-numeric' colSpan='1'>{category}</th>
      <th className='mdl-data-table__cell--non-numeric' colSpan='1'>Registrerings dato</th>
    </tr>
    { userList }
    </tbody>
  )
}

export default List;
