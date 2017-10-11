import React from 'react';
import { BASE } from 'common/constants';
import online_logo from 'assets/images/logo_online.png'
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
      <img width={239} src={online_logo} alt="Online"/>
      {companyImg}
    </header>
  );
};

export default Header;
