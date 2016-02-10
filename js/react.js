// Types of events:
// 1 = Sosialt
// 2 = Bedriftspresentasjon
// 3 = Kurs
// 4 = Utflukt
// 5 = Ekskursjon
// 6 = Internt
// 7 = Annet

var UserList = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            selectedIndex: null
        };
    },
    
    componentDidMount: function () {
        $.get("js/data.json", function (data) {
            var events = data.events.filter(function (event) {
                return (event.attendance_event != null)
            });
            
            if (this.isMounted()) {
                this.setState({
                    data: events,
                    selectedIndex: 0
                });
            }
        }.bind(this));
    },
    
    render: function () {
        var eventNames = this.state.data.map(function (event, index) {
            return React.createElement('div',
                                      { className: "event-name", listItem: index, key: index },
                                      event.title)
        });
        
        var usersData = [];
        
        if (this.state.selectedIndex) {
            usersData = this.state.data.events[0].attendance_event.users.map(function (user) {
                return React.createElement('li',
                                           { className: "user-item", key: user.id },
                                           "noe"/*"User: " + user.user.first_name + ", rfid: " + user.user.rfid*/)
            });
        }
        
        return <div>{ eventNames }<ul>{ usersData }</ul></div>;
    }
});

ReactDOM.render(
    React.createElement(UserList, null),
    document.querySelector('#options')
);