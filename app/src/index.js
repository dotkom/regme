// Polyfills for fetch
import 'es6-promise/auto';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { initErrorReporting } from 'common/errorReporting';
initErrorReporting();

import Header from 'components/header';
import Registration from 'components/registration';
import Options from 'components/options';
import LoginComponent from 'components/login';

import { OIDC_SETTINGS } from 'common/constants';

require('assets/styles/base.less');

import {ServiceManager} from 'services/ServiceManager';
import {ServiceProvider} from 'services/ServiceProvider';

import { 
  HttpServiceProvider, 
  UserServiceProvider, 
  EventServiceProvider, 
  AttendeeServiceProvider, 
  EventService, 
  OidcService, 
  OidcServiceProvider,
  StatusService,
  StatusServiceProvider
} from 'services';



const serviceManager = new ServiceManager();


// set up all services
serviceManager.registerService(HttpServiceProvider);
serviceManager.registerService(UserServiceProvider);
serviceManager.registerService(AttendeeServiceProvider);
serviceManager.registerService(EventServiceProvider);
serviceManager.registerService(OidcServiceProvider, OIDC_SETTINGS);
serviceManager.registerService(StatusServiceProvider);

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
            <LoginComponent />
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
