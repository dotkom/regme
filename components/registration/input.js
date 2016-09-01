/**
 * The input field. Should only fetch input from
 * user or RFID-reader, then let the core
 * application validate the rest.
 * 
 * @prop {string} placeholder The placeholder text for the input field.
 */
const Input = ( { placeholder } ) => {
  return (
    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label registration-input">
      <input className="mdl-textfield__input"
        type="text"
        id="registration-input"
        pattern="[A-Za-z\s]+|[0-9]+" />
      <label className="mdl-textfield__label"
        htmlFor="registration-input">{ placeholder }</label>
      <span className="mdl-textfield__error">Input er ikke gyldig!</span>
    </div>
  )
}

export default Input
