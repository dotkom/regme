// Types of events:
// 1 = Sosialt
// 2 = Bedriftspresentasjon
// 3 = Kurs
// 4 = Utflukt
// 5 = Ekskursjon
// 6 = Internt
// 7 = Annet

var API_KEY = "derp",
    API_BASE_URL = "http://localhost";

// API module, has a private doRequest method, and public get and set methods

/*
TABLE OF CONTENTS
=================

Private:
-----------------
- doRequest

Public:
-----------------
- get_events
- get_user_by_username
- get_user_by_rfid
- set_attended
- patch_user
- update_event

*/

// Does a request based in input parameters
var doRequest = function (type, dataType, url, params, data, callback) {
    $.ajax({
        type: type,
        dataType: dataType,
        contentType: "application/json",
        data: data,
        url: API_BASE_URL + url + params,
        success: function (return_data) {
            if (debug) console.log(return_data);
            callback(return_data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status === 202 || xhr.status === 204 || xhr.status === 304) {
                callback(xhr);
            }
            else {
                callback(null);
            }
        }
    });
}

var apicalls = {
    // Gets event list
    get_events: function () {
        return doRequest("GET", "json", "/api/rfid/events/", "?api_key=" + API_KEY + "&event_end__gte=" + tools.today() + "&order_by=event_start&limit=4", {}, events.events_callback);
    },
    // Gets user object by username
    get_user_by_username: function (username) {
        return doRequest("GET", "json", "/api/rfid/user/", "?username=" + username + "&api_key=" + API_KEY, {}, tools.user_callback);
    },
    // Gets user object by rfid
    get_user_by_rfid: function (rfid) {
        return doRequest("GET", "json", "/api/rfid/user/", "?rfid=" + rfid + "&api_key=" + API_KEY, {}, tools.user_callback);
    },
    // Sets an attendee as attended
    set_attended: function (attendee) {
        return doRequest("PATCH", "json", attendee.resource_uri, "?api_key=" + API_KEY, "{\"attended\": true}", events.attend_callback);
    },
    // Updates the RFID field on a user
    patch_user: function (user, rfid) {
        return doRequest("PATCH", "json", user.resource_uri, "?api_key=" + API_KEY, '{"rfid": "' + rfid + '"}', tools.patch_user_callback);
    },
    // Updates an event with new info
    update_event: function (event) {
        return doRequest("GET", "json", event.resource_uri, "?api_key=" + API_KEY, {}, events.update_event_callback);
    }
}

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
    
    handleClick: function () {
        this.setState({
            selectedIndex: 1
        });
    },
    
    render: function () {
        var eventNames = this.state.data.map(function (event, index) {
            return <div className="event-name" listItem=index key=index>{event.title}</div>
        });
        
        var usersData = [];
        
        if (typeof this.state.selectedIndex === "number") {
            usersData = this.state.data[this.state.selectedIndex].attendance_event.users.map(function (user) {
                return React.createElement('li',
                                           { className: "user-item", key: user.id },
                                           "User: " + user.user.first_name + ", rfid: " + user.user.rfid)
            });
        }
        
        return <div>{ eventNames }<ul>{ usersData }</ul></div>;
    }
});

ReactDOM.render(
    React.createElement(UserList, null),
    document.querySelector('#options')
);