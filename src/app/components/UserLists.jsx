
var UserLists extends React.Component {
  getInitialState () {
    return {
      data: [],
      selectedIndex: null,
      sortedBy: 'username',
      sort: 'asc'
    }
  }

  componentDidMount () {
    this.request = $.get('src/data.json', function (data) {
      var events = data.events.filter(function (event) {
        return (event.attendance_event != null)
      }).map(function (event) {
        if (event.attendance_event.waitlist) {
          event.attendance_event.listed = event.attendance_event.users.slice(0, event.attendance_event.max_capacity)
          event.attendance_event.registered = event.attendance_event.listed.filter(function (user) {
            return user.attended
          })
          event.attendance_event.listed = event.attendance_event.listed.filter(function (user) {
            return !user.attended
          })
          event.attendance_event.waiting = event.attendance_event.users.slice(event.attendance_event.max_capacity)
        }

        event.attendance_event.registered = event.attendance_event.registered.sort(sortBy.date.asc)
        event.attendance_event.listed = event.attendance_event.listed.sort(sortBy.username.asc)
        event.attendance_event.waiting = event.attendance_event.waiting.sort(sortBy.username.asc)

        return event
      })

      document.querySelector('#title').innerHTML = events[0].title

      if (this.isMounted()) {
        this.setState({
          data: events,
          selectedIndex: 0
        })
      }
    }.bind(this))
  }

  componentWillUnmount () {
    this.request.abort()
  }

  handleClick (i) {
    document.querySelector('#title').innerHTML = this.state.data[i].title

    this.setState({
      selectedIndex: i
    })
  }

  handleSort (func) {
    this.setState({
      sort: (this.state.sort === 'asc' ? 'desc' : 'asc'),
      sortedBy: func,
      data: this.state.data.map(function (event) {
        event.attendance_event.registered = event.attendance_event.registered.sort(sortBy[func][(this.state.sort === 'asc' ? 'desc' : 'asc')])
        event.attendance_event.listed = event.attendance_event.listed.sort(sortBy[func][(this.state.sort === 'asc' ? 'desc' : 'asc')])
        event.attendance_event.waiting = event.attendance_event.waiting.sort(sortBy[func][(this.state.sort === 'asc' ? 'desc' : 'asc')])

        return event
      }, this)
    })
  }

  render () {
    var eventNames = this.state.data.map(function (event, index) {
      return <button className={'mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect btn' + (this.state.selectedIndex === index ? ' btn-default' : '')}
        onClick={this.handleClick}
        listItem={index} key={index}>{event.title}</button>
    }, this)

    var usersRegistered = []
    var usersListed = []
    var usersWaiting = []

    if (typeof this.state.selectedIndex === 'number') {
      usersRegistered = this.state.data[this.state.selectedIndex].attendance_event.registered
      usersListed = this.state.data[this.state.selectedIndex].attendance_event.listed
      usersWaiting = this.state.data[this.state.selectedIndex].attendance_event.waiting
    }

    return (
      <div>{eventNames}
        <br/>
        <br/>
        <button className={'btn' + (this.state.sortedBy === 'username' ? ' btn-default' : '')}
          onClick={this.handleSort}>
          <span className={'glyphicon glyphicon-chevron-' + (this.state.sort === 'asc' ? 'up' : 'down')}></span>
          Sorter etter navn
        </button>
        <button className={'btn' + (this.state.sortedBy === 'date' ? ' btn-default' : '')}
          onClick={this.handleSort}>
          <span className={'glyphicon glyphicon-chevron-' + (this.state.sort !== 'asc' ? 'up' : 'down')}></span>
          Sorter etter dato
        </button>
        <UserList title={(usersListed.length > 0 ? usersRegistered.length + ' har møtt' : 'Alle har møtt!')} users={usersRegistered} />
        <UserList title={(usersRegistered.length > 0 ? usersListed.length + ' har ikke møtt' : 'Ingen har møtt')} users={usersListed} />
        <UserList title='Venteliste' empty='Ingen på venteliste' users={usersWaiting} />
      </div>
    )
  }
}
