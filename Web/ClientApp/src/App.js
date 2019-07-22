//import { Route, Router, history } from 'react-router';
import { Route, Router, BrowserRouter, Switch } from 'react-router-dom';

import './TeamRiverRunner.css'
import React, { Component } from 'react'
import  Event from './components/event/Event'
import EventDemo from './components/event/EventDemo';
import  Events from './components/Events'
import  Chapter from './components/chapter/Chapter'
import SideBarLayout from './components/SideBarLayout'
import SimpleLayout from './components/SimpleLayout'
import EventsSideBar from './components/EventsSideBar'
import Calendar from './components/Calendar'
import NavMenu from './components/NavMenu'
import ComingSoon from './components/ComingSoon'
import { createStore } from './components/store'
import SignIn  from './components/account/SignIn';
import SignUp from './components/account/SignUp';

import CalendarSideBar from './components/CalendarSideBar';
import Chapters from './components/Chapters';
import Members from './components/Members';
import Member from './components/member/Member';
import MembersSideBar from './components/MembersSideBar'
import TestPage from './components/TestPage';
import MembersReport from './components/reports/MembersReport';
import EventsByType from './components/reports/EventsByType';
import VeteransBySite from './components/reports/VeteransBySite';
import ReportsList from './components/reports/ReportsList';
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
                  <Route exact path='/' render={(match) => <div><NavMenu {...match}/>
                    <SideBarLayout {...match} 
                      sideBarContent={CalendarSideBar} 
                      bodyContent={Calendar}
                      onSideBarDropDownValueChange = {value => {this.setState({chapterFilter: value})}}
                      onBodyDropDownValueChange = {value => this.setState({chapterFilter: value})}
                      chapterFilter = {this.state.chapterFilter}
                      clearChapterFilter = {() => this.setState({chapterFilter: []})}
                    />
                  </div>}/>
                  <Route path='/events' render={(match) => <div><NavMenu {...match} /><SideBarLayout {...match} sideBarContent={EventsSideBar} bodyContent={Events}/></div>}/>
                  <Route path='/members' render={(match) => <div><NavMenu {...match} /><SideBarLayout {...match} sideBarContent={MembersSideBar} bodyContent={Members}/></div>} />
                  <Route path='/event-edit/:id' render={(match) => <div><NavMenu {...match}  /><SimpleLayout><Event {...match} /></SimpleLayout></div>} />
                  <Route path='/new-event' render={(match) => <div><NavMenu {...match} /><SimpleLayout><Event {...match} /></SimpleLayout></div>} />
                  <Route path='/chapters' render={(match) => <div><NavMenu {...match}  /><SimpleLayout><Chapters {...match} /></SimpleLayout></div>} />
                  <Route path='/new-member' render={(match) => <div><NavMenu {...match} /><SimpleLayout><Member {...match} /></SimpleLayout></div>} />
                  <Route path='/profile' render={(match) => <div><NavMenu {...match} /><SimpleLayout><Member {...match} /></SimpleLayout></div>} />
                  <Route path='/member/:id' render={(match) => <div><NavMenu {...match} /><SimpleLayout><Member {...match} /></SimpleLayout></div>} />
                  <Route path='/SignIn' render={(match) => <div><SimpleLayout><SignIn {...match} /></SimpleLayout></div>} />
                  <Route path='/reports' render={(match) => <div><NavMenu {...match} /><SimpleLayout><ReportsList {...match} /></SimpleLayout></div>} />
                  <Route path='/SignUp' render={(match) => <div><SimpleLayout><SignUp {...match} /></SimpleLayout></div>}/>
                  <Route path='/event-view/:id' render={(match) => <div><NavMenu {...match} /><SimpleLayout><EventDemo {...match} /></SimpleLayout></div>} />
                  <Route path='/new-chapter' render={(match) => <div><NavMenu {...match} /><SimpleLayout><Chapter {...match} /></SimpleLayout></div>} />


                  <Route path='/Report/Members' render={(match) => <div><NavMenu {...match} /><SimpleLayout><MembersReport {...match} /></SimpleLayout></div>} />
                  <Route path='/Report/EventsByType' render={(match) => <div><NavMenu {...match} /><SimpleLayout><EventsByType {...match} /></SimpleLayout></div>} />
                  <Route path='/Report/VeteransBySite' render={(match) => <div><NavMenu {...match} /><SimpleLayout><VeteransBySite {...match} /></SimpleLayout></div>} />

                  <Route path='/test' component={TestPage} />
                  </Switch>
          </BrowserRouter>
      );
  }
}

export default createStore(App)
