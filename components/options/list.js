const List = ({ category }) => {

  let userList = []
  let id = 0

  //for(let user of users){
    userList.push(
      <tr key={id}>
        <td className='mdl-data-table__cell--non-numeric'>{ ['fornavn', 'etternavn'].join(' ') }</td>
        <td className='mdl-data-table__cell--non-numeric'>{ 'brukernavn' }</td>
        <td>dag DD.MM.YYYY (HH:MM:SS)</td>
      </tr>
    )
    id++
  //}
  return (
    <tbody>
    <tr>
      <th className='mdl-data-table__cell--non-numeric' colSpan='3'>{category}</th>
    </tr>
    <tr>
      <th className='mdl-data-table__cell--non-numeric'>Navn</th>
      <th className='mdl-data-table__cell--non-numeric'>Brukernavn</th>
      <th className='mdl-data-table__cell--non-numeric'>Dato</th>
    </tr>
    { userList }
    </tbody>
  )
}

export default List;
