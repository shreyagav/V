import React, { Component } from 'react';
import EventSVG from '../svg/EventSVG';
import ChaptersSVG from '../svg/ChaptersSVG';
import MembersSVG from '../svg/MembersSVG';
import ReportsSVG from '../svg/ReportsSVG';
import LogoSVG from '../svg/LogoSVG';
import UserSVG from '../svg/UserSVG';
import TabComponent from './TabComponent';
import MenuSVG from '../svg/MenuSVG';

import { withStore } from './store';

class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);
    this.state = {};
  }

  toggleChapters() {
    let sideBarIsHidden = this.props.store.sideBarIsHidden;
    this.props.store.set("sideBarIsHidden", !sideBarIsHidden);
  }

  render () {
    return (
      <header className="main-nav-wrapper">
        {this.props.store.narrowScreen 
          ? 
          <ul className="flex-nowrap main-nav">
            <li>
              <MenuSVG onClick={() => this.toggleChapters()}/>
            </li>
            <li>
              <TabComponent 
                  inheritParentHeight = {true}
                  tabList={["table", "list"]}
                  proceedInOrder={false}
                  wasSelected={(index) => {if(index===0){this.props.store.set('tableStileView',true)} else {this.props.store.set('tableStileView', false)}}}
              />
            </li>
          </ul>
            :
          <a href="/" style={{"width":"260px","display":"flex","justifyContent":"center","alignItems":"center"}}>
            <LogoSVG /> 
          </a>
        }
        <ul className="flex-nowrap main-nav">
          <li>
            <a href="/chapters">
              <ChaptersSVG />
              <span>Chapters</span>
            </a>
          </li>
          <li>
            <a href="/">
              <EventSVG />
              <span>Events</span>
            </a>
          </li>
          <li>
            <a href="/members">
              <MembersSVG />
              <span>Members</span>
            </a>
          </li>
          <li>
            <a href="/reports">
              <ReportsSVG />
              <span>Reports</span>
            </a>
          </li>
          <li>
            <a href="/Account">
              <UserSVG />
              <span style={{'textTransform' : "none"}}>Sign In</span>
            </a>
          </li>
        </ul>
      </header>
    );
  }
}

export default withStore(NavMenu);
