import React from 'react'
import ReactDOM from 'react-dom'

require('./styles/base.less')

import Header from './components/header'
import Registration from './components/registration'
import Options from './components/options'

const App = () => {
  return(
    <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
      <Header />
      <main className='mdl-layout__content '>
        <div className='mdl-grid'>
          <div className='mdl-cell mdl-cell--8-col mdl-cell--2-offset'>
            <div className='mdl-card mdl-shadow--2dp'>
              <Registration title={ 'Bedrift' } />
              <Options />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
