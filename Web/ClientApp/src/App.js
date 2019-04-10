//import { Route, Router, history } from 'react-router';
import { Route, Router, BrowserRouter, Switch } from 'react-router-dom';

import './TeamRiverRunner.css'
import React, { Component } from 'react'
import  Event from './components/Event'
import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import { createStore } from './components/store'
import { SignIn } from './components/account/SignIn';
import { SignUp } from './components/account/SignUp';
import MainLayout from './components/MainLayout';
import EmptyLayout from './components/EmptyLayout';
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
