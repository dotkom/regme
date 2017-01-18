import React, { Component } from 'react';

/**
 * This component creates an modal when the show property is set to true.
 * After shown you get two options, and it does not close until the user selects
 * one of them.
 *
 * @class Modal
 * @extends {Component}
 */
export class Modal extends Component {
  /**
   * Creates an instance of Modal.
   *
   * @param {{
   *    show: boolean,
   *    content: string,
   *    accept: Function,
   *    decline: Function,
   *    acceptText?: string,
   *    declineText?: string
   * }} props
   *
   * @memberOf Modal
   */
  constructor(props) {
    super(props);

    this.open = false;
  }

  /**
   * Called after the component is created.
   *
   * @memberOf Modal
   */
  componentDidMount() {
    this.showModal(this.props.show);
  }

  /**
   * The modal should check if it is shown before it gets closed and
   * the other way around.
   *
   * @param {{
   *    show: boolean,
   *    content: string,
   *    accept: Function,
   *    decline: Function,
   *    acceptText?: string,
   *    declineText?: string
   * }} nextProps
   *
   * @memberOf Modal
   */
  componentWillReceiveProps(nextProps) {
    this.showModal(nextProps.show);
  }

  /**
   * Fills in support for dialog if it does not work in the browser.
   *
   * @param {any} ref
   *
   * @memberOf Modal
   */
  setDialog(ref) {
    this.dialog = ref;
    if (ref && !ref.showModal) {
      dialogPolyfill.registerDialog(ref);
    }
  }

  /**
   * Shows the modal.
   *
   * @param {boolean} [show=true]
   *
   * @memberOf Modal
   */
  showModal(show = true) {
    if (this.open !== show) {
      this.open = show;
      show ? this.dialog.showModal() : this.dialog.close();
    }
  }

  /**
   * * Decides what happend when the user accepts.
   *
   * @param {any} evt
   *
   * @memberOf Modal
   */
  acceptHandler(evt) {
    this.showModal(false);
    this.props.accept();
  }

  /**
   * Decides what happend when the user declines.
   *
   * @param {any} evt
   *
   * @memberOf Modal
   */
  declineHandler(evt) {
    this.showModal(false);
    this.props.decline();
  }

  /**
   * Render the component.
   *
   * @returns
   *
   * @memberOf Modal
   */
  render() {
    return (
      <dialog className={`mdl-dialog status-${this.props.status ? this.props.status : 'original'}`} id="modal-example" ref={ref => this.setDialog(ref)}>
        <div className="mdl-dialog__content">
          <p><i className="material-icons modal-icon">{this.props.icon || ''}</i>{this.props.content}</p>
        </div>
        <div className="mdl-dialog__actions mdl-dialog__actions--full-width">
          <button type="button" onClick={() => this.acceptHandler()} className="mdl-button">{this.props.acceptText || 'Ja'}</button>
          <button type="button" onClick={() => this.declineHandler()} className="mdl-button">{this.props.declineText || 'Nei'}</button>
        </div>
      </dialog>
    );
  }
}
