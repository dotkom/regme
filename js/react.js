var UserList = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    
    componentDidMount: function () {
        $.get("js/data.json", function (data) {
            var users = data.events[0].attendance_event.users;
            
            if (this.isMounted()) {
                this.setState({
                    data: users
                });
            }
        }.bind(this));
    },
    
    render: function () {
        var usersDatas = this.state.data.map(function (user) {
            return React.createElement('li', { className: "user-item", key: user.id }, "User: " + user.user.first_name + ", rfid: " + user.user.rfid)
        });
        
        return <ul>{ usersDatas }</ul>;
    }
});

ReactDOM.render(
    React.createElement(UserList, null),
    document.querySelector('#options')
);