/**
 * The input field. Should only fetch input from
 * user or RFID-reader, then let the core
 * application validate the rest.
 */
const Input = ( { placeholder } ) => {
  return (
    <input placeholder={ placeholder } />
  )
}

export default Input
