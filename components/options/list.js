

const List = ({ category, attendees, orderby, asc, onChange, collapse }) => {
  
  let userList = []
  if(!collapse)
    for(let attendee of attendees){
      userList.push(
        <tr key={attendee.id}>
          <td className='mdl-data-table__cell--non-numeric'>{ [attendee.firstname, attendee.lastname].join(' ') }</td>
          <td className='mdl-data-table__cell--non-numeric' colSpan="2">{ attendee.date.toLocaleString() }</td>
        </tr>
      )
    }
  let collapseContent = collapse ? (<i className="material-icons">keyboard_arrow_left</i>) : (<i className="material-icons">keyboard_arrow_down</i>)  
  let tableHeaders = [
    <th key="1" onClick={() => onChange("NAME",!asc)} className={'mdl-data-table__cell--non-numeric ' + (orderby=="NAME" ? (asc ? 'mdl-data-table__header--sorted-ascending' : 'mdl-data-table__header--sorted-descending' ) : '')} colSpan='1'>{category}</th>,
    <th key="2" onClick={() => onChange("DATE",!asc)} className={'mdl-data-table__cell--non-numeric ' + (orderby=="DATE" ? (asc ? 'mdl-data-table__header--sorted-ascending' : 'mdl-data-table__header--sorted-descending' ) : '')} colSpan='1'>Registrerings dato</th>,
    <th key="3" className='mdl-data-table_cell--non-numeric'>{collapseContent}</th>
  ]
  return (
    <tbody>
    <tr>
      { tableHeaders }
    </tr>
    { userList }
    </tbody>
  )
}

export default List;
