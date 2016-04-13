/**
 * This file is the core of the app it self.
 * It contains the stucture for the app and the logic pieces.
 * This is how the logic and components are united.
 */

import React from 'react'
import { connect } from 'react-redux'

/**
 * Importing the pieces for the first level of components.
 * *This may contain the input-field and logo afterwards.
 */
import UserLists from './UserLists'

/**
 * Importing spesific functions from actions.
 * This file contains all the logic for the app.
 */
import {
    sortBy
} from '../actions'

/**
 * This is the component which carrys the structure.
 * Functions used further inside the hirearchy is transfered
 * through this gateway.
 */
const Regme = ( props ) => {

 //const handleClick = (key, asc) => {
 //    console.log(asc, key)
 //    props.dispatch(sortBy(key, asc))
 //}
 
  return (
    <div>
      <h1>Works!</h1>
    </div>
  )
}

export default connect()(Regme)
