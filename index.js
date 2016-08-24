import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header'
import Registration from './components/registration'

const App = () => {
  return(
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header />
      <Registration />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
