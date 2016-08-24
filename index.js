import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header'
<<<<<<< 49cc0e03de8937597b85afefb382e37ab4b9997e
import Registration from './components/registration'
=======
import Options from './components/options'
>>>>>>> Added basic options

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
