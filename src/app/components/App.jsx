/**
 * This file is the whole app binding all the parts together.
 * The Regme is the core of the app and are lying inside this component.
 */

/**
 * Importing essential parts for storing and react to work with view.
 */
import React from 'react'
import { connect } from 'react-redux'

/**
 * Import static files.
 */
//import '../app.css'
//import {users, regme} from '../data.js'

/**
 * Import the application core file
 */
import Regme from '../components/Regme'

/**
 * Adding the regme app to this component.
 * Also passing users into the Regme component.
 */
const App = props => (
    <Regme users={ props.users } />
)

/**
 * Must define types for eslint to validate code.
 */
App.propTypes = {
    users: React.PropTypes.array,
    regme: React.PropTypes.shape({
        sortBy: React.PropTypes.string,
        sort: React.PropTypes.string,
    })
}

/**
 * Connecting the data via the redux pattern.
 * When the app variables gets updated, the view updates too.
 */
export default connect(state => ({
    users: state.users
}))(App)
