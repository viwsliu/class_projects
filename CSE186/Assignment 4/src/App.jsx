import React from 'react';
import Picker from './Picker';
import './App.css';

/**
 * Simple component with no state.
 *
 * See the basic-react from lecture for an example of adding and
 * reacting to changes in state.
 */
class App extends React.Component {
  variable = React.createRef();
  isDisabled=true;

  check(){
    return this.isDisabled;
  }

  /**
   * @return {object} a <div> containing an <h2>
   */
  render() {
    return (
      <div id = "div">
        <h2>CSE186 Assignment 4</h2>
        <Picker ref = {this.variable}/>
        <div id = "stretchstuff">
          <label> <input type="text" 
            id="date" 
            placeholder="MM/DD/YYYY" 
            onChange={(e)=> {this.isDisabled = this.variable.current.checkifValid(e); this.forceUpdate()}}/>
          </label>

          <button 
            id="set" 
            className="stretch" 
            disabled={this.check()} 
            onClick={() => {this.variable.current.setDate(this.variable.current.state.inputDate)}}>
               Set 
          </button>
        </div>
      </div>
    );
  }
}

export default App;
