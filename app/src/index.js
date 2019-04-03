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

/**
export const OAUTH_SETTINGS = {
  authority: process.env.SG_AUTH_AUTHORITY,
  client_id: process.env.SG_AUTH_CLIENT_ID,
  response_type: process.env.SG_AUTH_RESPONSE_TYPE,
  redirect_uri: process.env.SG_AUTH_REDIRECT_URI,
  scope: process.env.SG_AUTH_SCOPE,
  automaticSilentRenew: true
}
 */

serviceManager.registerService(HttpServiceProvider);
serviceManager.registerService(UserServiceProvider);
serviceManager.registerService(AttendeeServiceProvider);
serviceManager.registerService(EventServiceProvider);
serviceManager.registerService(OidcServiceProvider, {
  authority: 'http://localhost:8000/openid/',
  client_id: '863535',
  response_type: 'id_token token',
  redirect_uri: 'http://localhost:8080/auth',
  scope: ['openid', 'profile', 'email', 'onlineweb4'].join(' '),
  automaticSilentRenew: true,
  popupWindowFeatures: 'location=no,toolbar=no,width=900,height=700,left=100,top=100'
});
serviceManager.registerService(StatusServiceProvider);

serviceManager.getService(OidcService).subscribe((oidcProvider) => {
  console.log("got oidc service");
  //oidcProvider.login();
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
