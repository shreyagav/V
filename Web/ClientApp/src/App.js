//import { Route, Router, history } from 'react-router';
import { Route, Router, BrowserRouter, Switch } from 'react-router-dom';

import './TeamRiverRunner.css'
import React, { Component } from 'react'
import  Event from './components/event/Event'
import EventDemo from './components/event/EventDemo';
import  Events from './components/Events'
import  Chapter from './components/chapter/Chapter'
import SideBarLayout from './components/SideBarLayout'
import EventsSideBar from './components/EventsSideBar'
import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import { createStore } from './components/store'
import SignIn  from './components/account/SignIn';
import SignUp from './components/account/SignUp';

import CalendarSideBar from './components/CalendarSideBar';
import Chapters from './components/Chapters';
import Members from './components/Members';
import Member from './components/member/Member';
import MembersSideBar from './components/MembersSideBar'
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = {
      chapterFilter: [],
    };
  }

  render () {
      return (
          <BrowserRouter>
              <Switch>
                  <Route exact path='/' render={(match)=><div><NavMenu />
                    <SideBarLayout {...match} 
                      sideBarContent={CalendarSideBar} 
                      bodyContent={Calendar}
                      onSideBarDropDownValueChange = {value => {this.setState({chapterFilter: value})}}
                      onBodyDropDownValueChange = {value => this.setState({chapterFilter: value})}
                      chapterFilter = {this.state.chapterFilter}
                      clearChapterFilter = {() => this.setState({chapterFilter: []})}
                    />
                  </div>}/>
                  <Route path='/events' render={(match)=><div><NavMenu /><SideBarLayout {...match} sideBarContent={EventsSideBar} bodyContent={Events}/></div>}/>
                  <Route path='/members' render={(match)=><div><NavMenu /><SideBarLayout {...match} sideBarContent={MembersSideBar} bodyContent={Members}/></div>} />
                  <Route path='/event/:id' render={(match) => <div><NavMenu /><Event {...match} /></div>} />
                  <Route path='/new-event' render={(match) => <div><NavMenu /><Event {...match} /></div>} />
                  <Route path='/chapters' render={(match) => <div><NavMenu /><Chapters {...match} /></div>} />
                  <Route path='/new-member' render={(match) => <div><NavMenu /><Member {...match} /></div>} />
                  <Route path='/SignIn' component={SignIn} />
                  <Route path='/SignUp' component={SignUp} />
                  <Route path='/new-event' component={Event} />
                  <Route path='/event-demo' component={EventDemo} />
                  <Route path='/new-chapter' component={Chapter} />
                  </Switch>
          </BrowserRouter>
         

      );
  }
}

export default createStore(App)
