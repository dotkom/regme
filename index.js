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
      <main className='mdl-layout__content regme-layout-content'>
        <div className='mdl-grid regme-grid'>
          <div className='mdl-cell regme-grid-cell mdl-cell--8-col-desktop mdl-cell--2-offset-desktop mdl-cell--6-col-tablet mdl-cell--1-offset-tablet mdl-cell--4-col-phone'>
            <Registration title={ 'Bedrift' } />
            <Options />
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
