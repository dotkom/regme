
class UserList extends React.Component {
  getInitialState () {
    return {
      data: [],
      selectedIndex: null
    }
  }

  render () {
    if (this.props.users.length > 0) {
      var List = (
        this.props.users.map(function (user, index) {
          return (
            <tr className='user-item' key={index}>
              <td className='text-left'>{[user.user.first_name, user.user.last_name].join(' ')}</td>
              <td className='text-left'>{user.user.username}</td>
              <td className='text-right'>{dateFormatter(user.timestamp, 'day DD/MM/YY (HH:MM:SS)')}</td>
            </tr>
          )
        }, this)
      )

      return (
        <div>
          <h5>{this.props.title}</h5>
          <table className='mdl-data-table mdl-js-data-table table table-hover table-responsive'>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Brukernavn</th>
                <th>Dato</th>
              </tr>
            </thead>
            <tbody>{List}</tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div>
          <h5>{this.props.empty}</h5>
        </div>
      )
    }
  }
}
