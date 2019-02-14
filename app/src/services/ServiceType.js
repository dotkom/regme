
export class ServiceType{
  constructor(name, ...dependencies){
    this.name = name
    this.dependencies = dependencies;
  }

  getDependencies(){
    return this.dependencies;
  }

  toString(){
    return `ServiceType: ${this.name}`
  }
}