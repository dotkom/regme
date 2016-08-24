import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header'
import Registration from './components/registration'

const App = () => {
  let title = "Bedrift"
  return(
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header />
      <Registration title={ title } />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
