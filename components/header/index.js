import { BASE } from 'common/constants'


const Header = ({event}) => {
  let companyImg = event && event.organization ? (<img src={`${BASE}${event.organization.thumbnail}`} alt={event.organization.name} />) : null
  return (
    <header className='mdl-layout__header mdl-layout__header--scroll'>
      <div className='mdl-layout__header-row'>
        <img src="assets/images/logo_online.svg" alt="Online" />
        {companyImg}
      </div>
    </header>
  )
}

export default Header
