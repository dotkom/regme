import React, { Component } from 'react';
/**
 * The input field. Should only fetch input from
 * user or RFID-reader, then let the core
 * application validate the rest.
 *
 * @prop {string} placeholder The placeholder text for the input field.
 */
class Input extends Component {
  constructor(props) {
    super(props);
    // this.placeholder = props.placeholder
    // this.onSubmit = props.onSubmit
    // this.value = props.value

    const input = null;
  }

  componentDidMount() {
    this.input.focus();
  }

  submit(evt) {
    evt.preventDefault();
    if (this.input) {
      this.props.onSubmit(this.input.value);
    }
  }

  setRef(ref) {
    this.input = ref;
    if (ref) {
      this.input.value = (this.props.value != null) ? this.props.value : this.input.value;
    }
  }

  render() {
    return (
      <form onSubmit={evt => this.submit(evt)}>
        <div className="registration-input">
          <input
            type="text"
            pattern="[A-Za-z0-9]+"
            placeholder={ this.props.placeholder }
            autoComplete={false}
            ref={a => this.setRef(a)}
          />
          <span>Input er ikke gyldig!</span>
        </div>
      </form>
    );
  }
}

export default Input;
