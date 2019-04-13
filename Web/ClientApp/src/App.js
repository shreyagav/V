//import { Route, Router, history } from 'react-router';
import { Route, Router, BrowserRouter, Switch } from 'react-router-dom';

import './TeamRiverRunner.css'
import React, { Component } from 'react'
import  Event from './components/Event'
import  Events from './components/Events'
import  Chapter from './components/Chapter'
import SideBarLayout from './components/SideBarLayout'
import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import { createStore } from './components/store'
import { SignIn } from './components/account/SignIn';
import { SignUp } from './components/account/SignUp';
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
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
          <BrowserRouter>
              <Switch>
                  <Route exact path='/' render={(match) => <div><NavMenu /><Calendar {...match} /></div>} />
                  <Route path='/event:id' render={(match) => <div><NavMenu /><Event {...match} /></div>} />
                  <Route path='/new-event' render={(match) => <div><NavMenu /><Event {...match} /></div>} />
                  <Route path='/SignIn' component={SignIn} />
                  <Route path='/SignUp' component={SignUp} />
                  </Switch>
          </BrowserRouter>
         

      );
  }
}

export default createStore(App)
