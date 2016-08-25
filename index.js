import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header'
import Registration from './components/registration'
import Options from './components/options'

const App = () => {
  let title = "Bedrift"
  return(
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header />
      <main className="mdl-layout__content">
        <div className="page-content">
          <Registration title={ title } />
          <Options />
        </div>
      </main>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
