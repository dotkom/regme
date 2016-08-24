import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header'

const App = () => {
  return(
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <Header />
      <main className="mdl-layout__content">
        <div className="page-content">Here there be content</div>
      </main>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)