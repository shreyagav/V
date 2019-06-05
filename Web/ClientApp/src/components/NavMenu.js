import React, { Component } from 'react';
import EventSVG from '../svg/EventSVG';
import ChaptersSVG from '../svg/ChaptersSVG';
import MembersSVG from '../svg/MembersSVG';
import ReportsSVG from '../svg/ReportsSVG';
import LogoSVG from '../svg/LogoSVG';
import UserSVG from '../svg/UserSVG';
import  CalendarSVG from '../svg/CalendarSVG';
import SignInSVG from '../svg/SignInSVG';
import SignOutSVG from '../svg/SignOutSVG';
import TabComponent from './TabComponent';
import MenuSVG from '../svg/MenuSVG';
import { Link } from 'react-router-dom';

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
        const showLogo = !this.props.store.narrowScreen || (this.props.store.narrowScreen && !this.props.store.withSideBar && !this.props.store.withListSwitch);
        const user = this.props.store.userInfo;
    return (
      <header className="main-nav-wrapper">
        {this.props.store.narrowScreen 
          && 
          <ul className="flex-nowrap main-nav">
                    {this.props.store.withSideBar && <li>
                        <MenuSVG onClick={() => this.toggleChapters()} />
                    </li>}
                    {this.props.store.withListSwitch && <li>
                        <TabComponent
                            inheritParentHeight={true}
                            tabList={["table", "list"]}
                            proceedInOrder={false}
                            wasSelected={(index) => { if (index === 0) { this.props.store.set('tableStileView', true) } else { this.props.store.set('tableStileView', false) } }}
                            tabEqualWidth={true}
                        />
                    </li>}
                </ul>}
            
            {showLogo && <Link to="/" style={{ "width": "260px", "display": "flex", "justifyContent": "center", "alignItems": "center" }}>
                <LogoSVG />
            </Link>}
        
            <ul className="flex-nowrap main-nav">
                <li>
                    <Link to="/">
                        <CalendarSVG />
                        <span>Calendar</span>
                    </Link>
                </li>
                {user && user.authType=="Admin" && <li>
                    <Link to="/chapters">
                        <ChaptersSVG />
                        <span>Chapters</span>
                    </Link>
                </li>}
                {user && (user.authType == "Admin" || user.authType == "Secretary" )&&  <li>
                    <Link to="/events">
                        <EventSVG />
                        <span>Events</span>
                    </Link>
                </li>}
                {user && (user.authType == "Admin" || user.authType == "Secretary") &&<li>
                    <Link to="/members">
                        <MembersSVG />
                        <span>Members</span>
                    </Link>
                </li>}
                {user && (user.authType == "Admin" || user.authType == "Secretary") && <li>
                    <Link to="/reports">
                        <ReportsSVG />
                        <span>Reports</span>
                    </Link>
                </li>}
                {user && <li>
                    <Link to="/profile">
                        <UserSVG />
                        <span>Profile</span>
                    </Link>
                </li>}
                {user == null && (<li>
                    <Link to="/SignIn">
                        <SignInSVG />
                        <span style={{ 'textTransform': "none" }}>Sign In</span>
                    </Link>
                </li>)}
                {user != null && (<li>
                    <a href="javascript:" onClick={this.signOut}>
                        <SignOutSVG />
                        <span style={{ 'textTransform': "none" }}>Sign Out</span>
                    </a>
                </li>)}
        </ul>
      </header>
    );
  }
}

export default withStore(NavMenu);
