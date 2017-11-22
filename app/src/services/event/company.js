
export class Company {
  /**
   * @class Company
   * @param {String} name - the company's name
   * @param {String} site - url to the company's website
   * @param {String} thumbnail - url to a thumbnail of the company logo
   */
  constructor(name, site, thumbnail) {
    /** @private */
    this._name = name;
    /** @private */
    this._site = site;
    /** @private */
    this._thumbnail = thumbnail;
  }

  /**
   * @public
   * @type {String}
   */
  get thumbnail() {
    return this._thumbnail;
  }
  
  /**
   * @public
   * @type {String}
   */
  get site() {
    return this._site;
  }
  
  /**
   * @public
   * @type {String}
   */
  get name() {
    return this._name;
  }

}
