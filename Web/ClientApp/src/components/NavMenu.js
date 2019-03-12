import React, { Component } from 'react';
import { Navbar} from 'reactstrap';
import './NavMenu.css';
import EventSVG from '../svg/EventSVG';
import ChaptersSVG from '../svg/ChaptersSVG';
import MembersSVG from '../svg/MembersSVG';
import ReportsSVG from '../svg/ReportsSVG';
import LogoSVG from '../svg/LogoSVG';
import UserSVG from '../svg/UserSVG';
import TabComponent from './TabComponent';
import MenuSVG from '../svg/MenuSVG';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  toggleMenu () {
    this.setState(() => ({
      collapsed: !this.state.collapsed
    }));
  }

  render () {
    return (
      <header>
        <Navbar className="navbar">
              {/*<MenuSVG onClick={() => this.toggleMenu()}/>*/}
              <a href="/" style={{"width":"240px","display":"flex","justifyContent":"center","alignItems":"center"}}>
                <LogoSVG /> 
              </a>
              <ul className="flex-nowrap main-nav">
                {/*<li>
                  <TabComponent 
                    fontSize='inherit'
                    height='100%'
                    tabList={["month", "day"]}
                    proceedInOrder={false}
                    tabEqualWidth={false}
                  />
                </li>*/}
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
                  <a href="/signin">
                    <UserSVG />
                    <span style={{'textTransform' : "none"}}>Sign In</span>
                  </a>
                </li>
              </ul>
        </Navbar>
      </header>
    );
  }
}
