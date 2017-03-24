// Polyfills for fetch
import 'es6-promise/auto';
import 'whatwg-fetch';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header';
import Registration from './components/registration';
import Options from './components/options';

require('./styles/base.less');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: null,
    };
  }
  set options(newOptions) {
    this.setState(Object.assign({ }, this.state, { options: newOptions }));
  }
  get options() {
    return this.state.options;
  }
  render() {
    return (
      <div>
        <Header />
        <main className="regme-layout-content">
          <Registration event={this.options ? this.options.event : null} />
          <Options onOptionsChanged={options => this.options = options} />
        </main>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
