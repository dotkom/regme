// Polyfills for fetch
import 'es6-promise/auto';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { initErrorReporting } from 'common/errorReporting';
initErrorReporting();

import Header from 'components/header';
import Registration from 'components/registration';
import Options from 'components/options';

require('assets/styles/base.less');

import {ServiceManager} from 'services/ServiceManager';
import {ServiceProvider} from 'services/ServiceProvider';

import {HttpServiceProvider, UserServiceProvider, EventServiceProvider, AttendeeServiceProvider, EventService} from 'services';

const serviceManager = new ServiceManager();


// set up all services



serviceManager.registerService(HttpServiceProvider);
serviceManager.registerService(UserServiceProvider);
serviceManager.registerService(AttendeeServiceProvider);
serviceManager.registerService(EventServiceProvider);

serviceManager.getService(EventService).subscribe(() => {
  console.log("index got http service");
})

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
    const event = this.options ? this.options.event : null;
    return (
      <ServiceProvider serviceManager={serviceManager}>
        <div>
          <Header event={event} />
          <main>
            <Registration event={event} />
            <Options onOptionsChanged={options => this.options = options} />
          </main>
        </div>
      </ServiceProvider>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
);
