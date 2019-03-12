import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Calendar } from './components/Calendar.jsx';
import { Event } from './components/Event.jsx';

import './TeamRiverRunner.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
      return (
      <Layout>
        <Route exact path='/' component={Calendar} />
        <Route path='/event' component={Event} />
      </Layout>
    );
  }
}
