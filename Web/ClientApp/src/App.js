import { Route } from 'react-router';
//import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Event } from './components/Event.jsx';

import './TeamRiverRunner.css'
import React, { Component } from 'react'

import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import { createStore } from './components/store'

//const {Consumer, Provider} = React.createContext();
//const initialState = {narrowScreen: false};

class App extends Component {
  static displayName = App.name;

  render () {
      return (
        
          <div>
            <NavMenu/>
            <Calendar />
            {/*<Route exact path='/' component={Calendar} />
            <Route path='/event' component={Event} />*/}
          </div>

      );
  }
}

export default createStore(App)
