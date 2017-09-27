export class Company {
  constructor(name, site, thumbnail) {
    this._name = name;
    this._site = site;
    this._thumbnail = thumbnail;
  }
  get thumbnail() {
    return this._thumbnail;
  }
  get site() {
    return this._site;
  }
  get name() {
    return this._name;
  }

}
