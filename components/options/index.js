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
        <input type='button' value='Alternativer' onClick={ this.clickHandler } />
        { optionBody }
      </div>
    )
  }
})

export default Options;

