import { Route } from 'react-router';

import './TeamRiverRunner.css'
import React, { Component } from 'react'
import  Event from './components/Event'
import  Events from './components/Events'
import  Chapter from './components/Chapter'
import SideBarLayout from './components/SideBarLayout'
import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import { createStore } from './components/store'
import CalendarSideBar from './components/CalendarSideBar';

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
            <Route exact path='/' render={()=><SideBarLayout sideBarContent={CalendarSideBar} bodyContent={Calendar}/>}/>
            <Route path='/events' render={()=><SideBarLayout sideBarContent={CalendarSideBar} bodyContent={Events}/>}/>
            <Route path='/event' component={Event} />
            <Route path='/chapter' component={Chapter} />
          </div>

      );
  }
}

export default createStore(App)
