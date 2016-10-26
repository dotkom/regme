const List = ({ category, attendees }) => {

  let userList = []

  for(let attendee of attendees){
    userList.push(
      <tr key={attendee.id}>
        <td className='mdl-data-table__cell--non-numeric'>{ [attendee.firstname, attendee.lastname].join(' ') }</td>
        <td className='mdl-data-table__cell--non-numeric'>{ attendee.username }</td>
        <td>dag DD.MM.YYYY (HH:MM:SS)</td>
      </tr>
    )
  }
  return (
    <tbody>
    <tr>
      <th className='mdl-data-table__cell--non-numeric' colSpan='3'>{category}</th>
    </tr>
    { userList }
    </tbody>
  )
}

export default List;
