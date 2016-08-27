import React from 'react';
import ReactDOM from 'react-dom';

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
          <div className='mdl-cell mdl-cell--6-col mdl-cell--3-offset'>
            <Registration title={ 'Bedrift' } />
            <hr />
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
