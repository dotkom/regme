import React from 'react';
import { BASE } from 'common/constants';

const Header = ({event}) => {
  const companyImg = event && event.organization ? (
    <div className="corner-container">
      <div className="corner">
        <img src={`${BASE}${event.organization.thumbnail}`} alt={event.organization.name} />
      </div>
    </div>
  ) : null;
  return (
    <header>
      <img src="assets/images/logo_online.svg" alt="Online"/>
      {companyImg}
    </header>
  );
};

export default Header;
