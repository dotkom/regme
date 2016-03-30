/* eslint react/prop-types: 0 */
// Types of events:
// 1 = Sosialt
// 2 = Bedriftspresentasjon
// 3 = Kurs
// 4 = Utflukt
// 5 = Ekskursjon
// 6 = Internt
// 7 = Annet
// var API_KEY = 'derp', API_BASE_URL = 'http://localhost'
//import React from 'react'
//import ReactDOM from 'react-dom'
var $ = window.jQuery

/**
 *
 * @param date
 * @param format
 * @returns {*}
 */
function dateFormatter (date, format) {
  if (typeof date === 'string') {
    format = (typeof format === 'string' ? format : 'dag DD.MM.YYYY (HH:MM:SS)')
    var dager = ['Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør', 'Søn']
    var d = new Date(date.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''))
    var formatted = format.replace(new RegExp('da[gy]', 'ig'), dager[d.getDay()])

    for (var i = 5; i > 0; i--) {
      formatted = formatted.replace(new RegExp('(^|\\W)y{' + i + ',}($|\\W)', 'ig'), '$1' + digits(d.getFullYear(), i) + '$2')
        .replace(new RegExp('(^|\\W)m{' + i + ',}($|\\W)', 'ig'), '$1' + digits(d.getMonth() + 1, i) + '$2')
        .replace(new RegExp('(^|\\W)d{' + i + ',}($|\\W)', 'ig'), '$1' + digits(d.getDate(), i) + '$2')
        .replace(new RegExp('(^|\\W)h{' + i + ',}($|\\W)', 'ig'), '$1' + digits(d.getHours(), i) + '$2')
        .replace(new RegExp('(^|\\W)m{' + i + ',}($|\\W)', 'ig'), '$1' + digits(d.getMinutes(), i) + '$2')
        .replace(new RegExp('(^|\\W)s{' + i + ',}($|\\W)', 'ig'), '$1' + digits(d.getSeconds(), i) + '$2')
    }

    return formatted
  }

  return ''
}

/**
 *
 * @param number
 * @param places
 * @returns {string}
 */
function digits (number, places) {
  places = (typeof places === 'number' ? places : 2)

  return (Array(places).join('0') + number).slice(-(places))
}

/**
 *
 * @type {{date: {asc: sortBy.date.asc, desc: sortBy.date.desc}, username: {asc: sortBy.username.asc, desc: sortBy.username.desc}}}
 */
var sortBy = {
  date: {

    /**
     *
     * @param user1
     * @param user2
     * @returns {number}
     */
    asc: function (user1, user2) {
      var time1 = user1.timestamp
      var time2 = user2.timestamp

      if (time1 > time2) return 1
      if (time1 < time2) return -1

      return 0
    },

    /**
     *
     * @param user2
     * @param user1
     * @returns {number}
     */
    desc: function (user2, user1) {
      var time1 = user1.timestamp
      var time2 = user2.timestamp

      if (time1 > time2) return 1
      if (time1 < time2) return -1

      return 0
    }
  },
  username: {

    /**
     *
     * @param user1
     * @param user2
     * @returns {number}
     */
    asc: function (user1, user2) {
      var time1 = user1.user.first_name.toLowerCase()
      var time2 = user2.user.first_name.toLowerCase()

      if (time1 > time2) return 1
      if (time1 < time2) return -1

      return 0
    },

    /**
     *
     * @param user2
     * @param user1
     * @returns {number}
     */
    desc: function (user2, user1) {
      var time1 = user1.user.first_name.toLowerCase()
      var time2 = user2.user.first_name.toLowerCase()

      if (time1 > time2) return 1
      if (time1 < time2) return -1

      return 0
    }
  }
}
/*
var UserList = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      selectedIndex: null
    }
  },

  render: function () {
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
          <h3>{this.props.title}</h3>
          <table className='mdl-data-table mdl-js-data-table table table-hover table-responsive'>
            <thead>
              <tr>
                <th>Navn</th>
                <th>Brukernavn</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{List}</tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div>
          <h3>{this.props.empty}</h3>
        </div>
      )
    }
  }
})
* /
var UserLists = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      selectedIndex: null,
      sortedBy: 'username',
      sort: 'asc'
    }
  },

  componentDidMount: function () {
    this.request = $.get('js/data.json', function (data) {
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

      // document.querySelector('#title').innerHTML = events[0].title

      if (this.isMounted()) {
        this.setState({
          data: events,
          selectedIndex: 0
        })
      }
    }.bind(this))
  },

  componentWillUnmount: function () {
    this.request.abort()
  },

  handleClick: function (i) {
    document.querySelector('#title').innerHTML = this.state.data[i].title

    this.setState({
      selectedIndex: i
    })
  },

  handleSort: function (func) {
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
  },

  render: function () {
    var eventNames = this.state.data.map(function (event, index) {
      return <button className={'btn' + (this.state.selectedIndex === index ? ' btn-default' : '')}
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
      <div className='mdl-cell--12-col'>{eventNames}<br/>
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
})
*/
ReactDOM.render(
  <UserLists />,
  document.querySelector('#options')
)
/*
 UserLists.propTypes = {
 data: React.PropTypes.node,
 selectedIndex: React.PropTypes.number,
 sortedBy: React.PropTypes.string,
 sort: React.PropTypes.string
 }*/

UserList.propTypes = {
  users: React.PropTypes.node,
  title: React.PropTypes.string,
  empty: React.PropTypes.node
}
