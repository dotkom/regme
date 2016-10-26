import React, { Component } from 'react'
import ReactDOM from 'react-dom'

require('./styles/base.less')

import Header from './components/header'
import Registration from './components/registration'
import Options from './components/options'

class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      options: null
    }
  }
  set options(newOptions){
    this.setState(Object.assign({},this.state,{options:newOptions}))
  }
  get options(){
    return this.state.options
  }
  render(){
    return(
      <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
        <Header />
      <main className='mdl-layout__content regme-layout-content'>
        <div className='mdl-grid regme-grid'>
          <div className='mdl-cell regme-grid-cell mdl-cell--8-col-desktop mdl-cell--2-offset-desktop mdl-cell--6-col-tablet mdl-cell--1-offset-tablet mdl-cell--4-col-phone'>
              <Registration event={this.options ? this.options.event : null} />
              <Options onOptionsChanged={(options) => this.options = options}/>
            </div>
          </div>
        </main>
      </div>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
