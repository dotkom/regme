import React, { Component } from 'react'
/**
 * The input field. Should only fetch input from
 * user or RFID-reader, then let the core
 * application validate the rest.
 * 
 * @prop {string} placeholder The placeholder text for the input field.
 */
class Input extends Component {
  constructor (props) {
    super(props)
    //this.placeholder = props.placeholder
    //this.onSubmit = props.onSubmit
    //this.value = props.value

    let _input = null
  }

  componentDidMount () {
    this._input.focus()
  }

  submit () {
    evt.preventDefault()
    if(this._input) {
      onSubmit(this._input.value)
    }
  }

  setRef (ref) {
    this._input = ref
    if (ref) {
      this._input.value = (this.value != null) ? this.value : this._input.value
    }
  }

  render () {
    return (
      <form onSubmit={ this.submit.bind(this) }>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label registration-input">
          <input className="mdl-textfield__input"
            type="text"
            id="registration-input"
            pattern="[A-Za-z0-9]+"
            autoComplete={false}
            ref={(a)=>this.setRef(a)} />
          <label className="mdl-textfield__label"
            htmlFor="registration-input">{ this.props.placeholder }</label>
          <span className="mdl-textfield__error">Input er ikke gyldig!</span>
        </div>
      </form>
    )
  }
}

export default Input
