const Attendees = () => {
  return (
    <div>
      <h3>Deltakere</h3>
      <table className='mdl-data-table mdl-js-data-table'>
        <tbody>
          <tr>
            <th className='mdl-data-table__cell--non-numeric'>Møtt</th>
          </tr>
          <tr>
            <th className='mdl-data-table__cell--non-numeric'>Ikke møtt</th>
          </tr>
          <tr>
            <th className='mdl-data-table__cell--non-numeric'>Venteliste</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Attendees;
