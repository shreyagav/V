import { Route } from 'react-router';

import './TeamRiverRunner.css'
import React, { Component } from 'react'
import  Event from './components/Event'
import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import { createStore } from './components/store'

class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render () {
      return (
          <div>
            <NavMenu/>
            <Route exact path='/' component={Calendar} />
            <Route path='/event' component={Event} />
          </div>

      );
  }
}

export default createStore(App)
