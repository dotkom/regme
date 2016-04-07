/**
 * This file has all the app logic for regme.
 * The file talks to the api and makes input actions.
 * It also fetches and passes the data to the view.
 */

import { combineReducers } from 'redux'

/**
 * Import actions from actions.js which was passed from
 * the Regme component.
 */
import {
    SORT_BY,
    SOME_OTHER_TRIGGER
} from './actions'

/**
 * Datasets for the application. When this updates
 * the whole application will update, including the view.
 * Redux helps this process so now the whole view doesn't
 * render, but just the nessesary parts/components.
 */
const initialUsersLists = {
    registered:[],
    listed:[],
    waiting:[]
}

/**
 * A reducer function to userdata. There may be more datasets.
 * This is how to connect the userdata with the view.
 * Here the logic for each trigger will execute spesifically
 * for the dataset. userReducer may sort its list after
 * sortBy is called while another dataset makes a button
 * checked after the button is pressed.
 */
const userReducer = (state = initialUsersLists, action) => {
    switch (action.type) {
        case SORT_BY:
            // return a new state with the action args -> action.id ...
        case SOME_OTHER_TRIGGER:
            // Just list new functions to change this set.
        default:
            return state
    }
}

/**
 * Export the reducers. Add more by adding to the object.
 */
export default combineReducers({
    users: userReducer
})
