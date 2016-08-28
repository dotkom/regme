import Events from './events'
import Attendees from './attendees'

const Options = React.createClass({
  getInitialState: function (){
    return{ showOptions: false }
  },
  clickHandler: function () {
    this.setState({ showOptions: !this.state.showOptions })
  },
  render: function () {
    let optionBody = ''
    if(this.state.showOptions){
      optionBody = (
        <div>
          <Events />
          <hr />
          <Attendees />
        </div>
      )
    }
    return(
      <div>
        <a className='mdl-button mdl-js-button mdl-button--raised  mdl-js-ripple-effect mdl-button--accent' onClick={ this.clickHandler }>Alternativer</a>
        { optionBody }
      </div>
    )
  }
})

export default Options;

