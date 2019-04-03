import React, { Component } from 'react';
import dialogPolyfill from 'dialog-polyfill';

/**
 * This component creates an modal when the show property is set to true.
 * After shown you get two options, and it does not close until the user selects
 * one of them.
 */

/** 
 * @typedef {Object} Modal~ModalProps
 * @property {Boolean} show - wheter or not the modal should be displayed
 * @property {String} conent - the contents of the modal
 * @property {Function} accept - callback function called if the user accepts
 * @property {Function} decline - callback function called if the user declines
 * @property {String} [acceptText] - text shown on the accept button
 * @property {String} [declineText] - text shown on the decline button
*/

export class Modal extends Component {
  /**
   * Creates an instance of Modal.
   * @class Modal
   * @extends {Component}
   *
   * @param {Modal~ModalProps} props
   */
  constructor(props) {
    super(props);
    /** @private */
    this.open = false;
  }

  /**
   * @method componentDidMount - Called after the component is created.
   * @public
   * @memberof Modal
   * @inner
   */
  componentDidMount() {
    this.showModal(this.props.show);
  }

  /**
   * @method componentWillReceiveProps - The modal should check if it is shown before it gets closed and
   * the other way around.
   * @inner
   * @public
   * @param {Modal~ModalProps} nextProps
   * @memberof Modal
   */
  componentWillReceiveProps(nextProps) {
    this.showModal(nextProps.show);
  }

  /**
   * @method setDialog - Fills in support for dialog if it does not work in the browser.
   * @inner
   * @public
   * @param {any} ref
   * @memberof Modal
   */
  setDialog(ref) {
    this.dialog = ref;
    if (ref && !ref.showModal) {
      dialogPolyfill.registerDialog(ref);
    }
  }

  /**
   * @method showModal - Shows the modal.
   * @inner
   * @public
   * @param {boolean} [show=true]
   *
   * @memberof Modal
   */
  showModal(show = true) {
    if (this.open !== show) {
      this.open = show;
      show ? this.dialog.showModal() : this.dialog.close();
    }
  }

  /**
   * @method acceptHandler - Decides what happend when the user accepts.
   * @inner
   * @public
   * @param {any} evt
   * @memberof Modal
   */
  acceptHandler(evt) {
    this.showModal(false);
    this.props.accept();
  }

  /**
   * @method - Decides what happend when the user declines.
   * @inner
   * @public
   * @param {any} evt
   *
   * @memberof Modal
   */
  declineHandler(evt) {
    this.showModal(false);
    this.props.decline();
  }

  /**
   * @method render - Render the component.
   * @public
   * @inner
   * @returns {ReactElement}
   * @memberof Modal
   */
  render() {
    return (
      <dialog id="modal" ref={ref => this.setDialog(ref)}>
        <p>{this.props.children}</p>
        <div>
          <button type="button" onClick={() => this.acceptHandler()}>{this.props.acceptText || 'Ja'}</button>
          <button type="button" onClick={() => this.declineHandler()}>{this.props.declineText || 'Nei'}</button>
        </div>
      </dialog>
    );
  }
}
