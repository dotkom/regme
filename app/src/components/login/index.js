import React, { Component } from 'react';
import { Modal } from 'components/modal';

import { ServiceContext } from 'services/ServiceProvider';
import { OidcService } from 'services/auth';
import { StatusService, Status } from 'services/status';
import StatusComponent from 'components/registration/status';


class LoginComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      showModal: true,
      ready: false,
      loginStatus: new Status('WAIT', 'Ikke logget inn')
    }
  }
  
  componentDidMount(){
    // check if user is logged in, if show modal to login
    this.context.getServices(OidcService, StatusService).switchMap((services) => {
      this.auth = services[OidcService];
      this.status = services[StatusService];
      return this.auth.getUser();
    }).subscribe((user) => {
      let loggedIn = !!user;
      this.setState({
        ready: true,
        showModal: !loggedIn,
        loginStatus: loggedIn ? new Status('OK', `Logget inn som ${user.profile.name}`) : this.state.loginStatus
      });
      if(!loggedIn){
        this.status.setStatus(new Status('WAIT', 'Logg inn for å bruke systemet.'));
      }
    });

  }

  tryLogin(){
    this.auth.login().subscribe((user) => {
      this.setState({
        showModal: !user,
        loginStatus: !!user ? new Status('OK', `Logget inn som ${user.profile.name}`) : this.state.loginStatus
      });
    });

  }

  declineLogin(){
    //location.href="http://localhost:8000";
    this.setState({
      showModal: false,
      loginStatus: new Status('ERROR', `Brukeren logget ikke inn!`)
    });
  }
  
  render(){
    return (
      <div>
        <div>{this.state.loginStatus.message}</div>
        <Modal show={this.state.showModal && this.state.ready} acceptText="Login" declineText="Cancel" accept={() => this.tryLogin()} decline={() => this.declineLogin()}>
          Logg in for å bruke regme
        </Modal>
      </div>
    )
  }
}

LoginComponent.contextType = ServiceContext;

export default LoginComponent;
