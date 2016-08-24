const Status = ( { message, time } ) => {
  return (
    <div className="color">
      <div className="left">{ message }</div>
      <div className="right">{ `${time.hour}:${time.minute}:${time.second}` }</div>
    </div>
  )
}

export default Status
