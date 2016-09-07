const List = ({ category }) => {

  let userList = []

  for(let id = 0; id < 5; id++){
    userList.push(
      <tr key={id}>
        <td className='mdl-data-table__cell--non-numeric'>{ ['fornavn', 'etternavn'].join(' ') }</td>
        <td className='mdl-data-table__cell--non-numeric'>{ 'brukernavn' }</td>
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
