/**
 * This file is the only loaded file from the html file displayed.
 * Every module and component is loaded asynchronously from here
 * and put together. This is the root for the project.
 */

/**
 * Importing the node modules to build all components together.
 */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './configureStore'
import App from './components/App'
import DevTools from './components/DevTools'

/**
 * Making it possible to debud data and making the data transferable
 * between components.
 */
const store = configureStore()

/**
 * Rendering app and debug tool into an actual element on the site.
 * Now everything inside is controlled by reacts' view.
 */
render(
    <Provider store={ store }>
        <div>
            <DevTools />
            <App />
        </div>
    </Provider>,
    document.querySelector('#options')
)
