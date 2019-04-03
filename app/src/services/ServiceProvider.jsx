import React, { Component, createContext } from 'react';





export const ServiceContext = createContext();

export class ServiceProvider extends Component{
  constructor(props){
    super(props);
    this.state = {
      services: {}
    }
    this.serviceSub = null;
  }

  _regServiceManager(){
    this._unregServiceManager();
    this.serviceSub = this.props.serviceManager.getServices().subscribe((services) => {
      this.setState({services: services});
    });
  }

  _unregServiceManager(){
    if (this.serviceSub) {
      this.serviceSub.unsubscribe();
    }
    this.serviceSub = null;
  }

  componentDidMount(){
    this._regServiceManager();
  }

  componentDidUpdate(prevProps){
    if(this.props.serviceManager != prevProps.serviceManager){
      this._regServiceManager()
    }
  }

  componentWillUnmount(){
    this._unregServiceManager();
  }

  render(){
    const getService = (...a) => this.props.serviceManager.getService(...a);
    const getServices = (...a) => this.props.serviceManager.getServices(...a);
    return(
      <ServiceContext.Provider value={{services: this.state.services, getService, getServices}}>{this.props.children}</ServiceContext.Provider>
    )
  }
}
