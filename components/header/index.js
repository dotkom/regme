import React from 'react';
import { BASE } from 'common/constants';

const Header = ({event}) => {
  const companyImg = event && event.organization ? (<img src={`${BASE}${event.organization.thumbnail}`} alt={event.organization.name} />) : null;
  return (
    <header>
      <img src="assets/images/logo_online.svg" alt="Online"/>
      <div className="outer">
        <div className="inner">
          {companyImg}
        </div>
      </div>
    </header>
  );
};

export default Header;
