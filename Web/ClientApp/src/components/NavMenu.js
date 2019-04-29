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
      this.signOut = this.signOut.bind(this);
  }

    signOut() {
        var me = this;
        fetch('/api/Account/SignOut')
            .then(function (data) { return data.json(); })
            .then(function (jjson) {
                if (jjson.result=='ok')
                    me.props.store.set('userInfo',null);
            });
    }

  toggleChapters() {
    let sideBarIsHidden = this.props.store.sideBarIsHidden;
    this.props.store.set("sideBarIsHidden", !sideBarIsHidden);
  }

    render() {
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
                  tabEqualWidth={true}
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
            <a href="/events">
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
                {this.props.store.userInfo == null && (<li>
                    <a href="/SignIn">
                        <UserSVG />
                        <span style={{ 'textTransform': "none" }}>Sign In</span>
                    </a>
                </li>)}
                {this.props.store.userInfo != null && (<li>
                    <a href="javascript:" onClick={this.signOut}>
                        <UserSVG />
                        <span style={{ 'textTransform': "none" }}>Sign Out</span>
                    </a>
                </li>)}
        </ul>
      </header>
    );
  }
}

export default withStore(NavMenu);
