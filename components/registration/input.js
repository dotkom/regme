/**
 * The input field. Should only fetch input from
 * user or RFID-reader, then let the core
 * application validate the rest.
 * 
 * @prop {string} placeholder The placeholder text for the input field.
 */
const Input = ( { placeholder, onSubmit, value } ) => {
  let _input = null
  let setRef = (ref) => {
    _input = ref
    if (ref) {
      _input.focus()
      _input.value = (value!=null) ? value : _input.value
    }
  }
  let submit = (evt) => {
    evt.preventDefault()
    if(_input){
      onSubmit(_input.value)
    }
  }

  return (
    <form onSubmit={ submit }>
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label registration-input">
        <input className="mdl-textfield__input"
          type="text"
          id="registration-input"
          pattern="[A-Za-z0-9]+"
          ref={setRef} />
        <label className="mdl-textfield__label"
          htmlFor="registration-input">{ placeholder }</label>
        <span className="mdl-textfield__error">Input er ikke gyldig!</span>
      </div>
    </form>
  )
}

export default Input
