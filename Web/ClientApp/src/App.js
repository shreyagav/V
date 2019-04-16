//import { Route, Router, history } from 'react-router';
import { Route, Router, BrowserRouter, Switch } from 'react-router-dom';

import './TeamRiverRunner.css'
import React, { Component } from 'react'
import  Event from './components/Event'
import EventDemo from './components/EventDemo';
import  Events from './components/Events'
import  Chapter from './components/Chapter'
import SideBarLayout from './components/SideBarLayout'
import EventsSideBar from './components/EventsSideBar'
import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import { createStore } from './components/store'
import SignIn  from './components/account/SignIn';
import SignUp from './components/account/SignUp';

import CalendarSideBar from './components/CalendarSideBar';
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render () {
      return (
          <BrowserRouter>
              <Switch>
                  <Route exact path='/' render={(match)=><div><NavMenu /><SideBarLayout {...match} sideBarContent={CalendarSideBar} bodyContent={Calendar}/></div>}/>
                  <Route path='/events' render={(match)=><div><NavMenu /><SideBarLayout {...match} sideBarContent={EventsSideBar} bodyContent={Events}/></div>}/>
                  <Route path='/event:id' render={(match) => <div><NavMenu /><Event {...match} /></div>} />
                  <Route path='/new-event' render={(match) => <div><NavMenu /><Event {...match} /></div>} />
                  <Route path='/chapter' render={(match) => <div><NavMenu /><Chapter {...match} /></div>} />
                  <Route path='/SignIn' component={SignIn} />
                  <Route path='/SignUp' component={SignUp} />
                  <Route path='/new-event' component={Event} />
                  <Route path='/event-demo' component={EventDemo} />
                  </Switch>
          </BrowserRouter>
         

      );
  }
}

export default createStore(App)
