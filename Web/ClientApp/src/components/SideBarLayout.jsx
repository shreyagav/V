import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
//import NatureLocationSVG from '../svg/NatureLocationSVG';
import PlusSVG from '../svg/PlusSVG';
import { withStore } from './store';
import './Calendar.css'
import { createMultiDropDownStore } from './MultiDropDown/MultiDropDownStore';
import MultiDropDownHeader from './MultiDropDown/MultiDropDownHeader';

class SideBarLayout extends Component {
    static displayName = SideBarLayout.name;
    
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            setFocusTo: -1,
            filters: [],
        };
        this.setFocusToRef = null;
        this.sideBarRef = null;
        this.bodyRef = null;
        this.initialX = null;
        this.initialY = null;
        this.longTouch = false;
        this.startTouch = this.startTouch.bind(this);
        this.moveTouch = this.moveTouch.bind(this);

        this.forwardToContentRef = null;
        this.backToSideBarRef = null;
        props.store.refreshUserInfo();
        props.store.set("withSideBar", true);
    }

    componentWillMount() {
        if (this.props.store.narrowScreen) { this.props.store.set("sideBarIsHidden", true); }
    }

    componentDidMount(){
      if (this.sideBarRef !== null){
        window.addEventListener("touchstart", this.startTouch, false);
        window.addEventListener("touchmove", this.moveTouch, false);
      }
  }

  componentDidUpdate() {
    this.setFocus();
  }

  componentWillUnmount() {
      window.removeEventListener("touchstart", this.startTouch, false);
      window.removeEventListener("touchmove", this.moveTouch, false);
  }

  updateFilters(filters){
    this.setState({filters: filters}, console.log(this.state.filters));
    //alert("time to refresh the Table");
  }

  startTouch(e) {
    this.initialX = e.touches[0].clientX;
    this.initialY = e.touches[0].clientY;
    this.longTouch = false;
    setTimeout(() => {this.longTouch = true;}, 200);
  };
 
  moveTouch(e) {
    if (!this.props.store.narrowScreen) {return;}
    if (this.initialX === null) {return;} 
    if (this.initialY === null) {return;} 
    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY; 
    let diffX = this.initialX - currentX;
    let diffY = this.initialY - currentY;
 
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
        if (diffX > 0) {
        // swiped left
        if(this.sideBarRef.contains(e.target) && !this.longTouch){
          //this.setState(() => ({sideBarTransform: 'translate3d(-325px,0,0)'}));
          this.props.store.set("sideBarIsHidden", true);
        }
      } else {
        // swiped right
        if(this.bodyRef.contains(e.target) && this.initialX < 100 && this.props.store.sideBarIsHidden && !this.longTouch ){
          //this.setState(() => ({sideBarTransform: 'translate3d(0px,0,0)'}));
          this.props.store.set("sideBarIsHidden", false);
        }
      }  
    }
    /*else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        console.log("swiped up");
      } else {
        // swiped down
        console.log("swiped down");
      }  
    } */
    this.initialX = null;
    this.initialY = null; 
  };

    setFocus() {
        if (this.setFocusToRef !== null) {
          this.setFocusToRef.focus();
        }
    }

    mainLevelStyleUpdate = () => {
      if (this.props.store.narrowScreen){
        if(this.props.store.sideBarIsHidden){return {"paddingLeft": "0rem", "paddingRight": "0rem"};}
        else return {"paddingLeft": "0rem", "paddingRight": "0rem", "position":"fixed"};}
      else {return {"paddingLeft":"325px","paddingRight": "1rem"};}
    }

    render() {
        const mainLevelStyle = this.mainLevelStyleUpdate();
        var maxWidth = {};
        const SideBarContent = this.props.sideBarContent;
        const BodyContent = this.props.bodyContent;
        if (!this.state.regularCalendar) {maxWidth = {'maxWidth' : '500px'}};
        return (
          <div className={'lm-wrapper overflow-hidden'} >
            <div 
              ref={el => this.sideBarRef = el} 
              style={ (this.props.store.narrowScreen && this.props.store.sideBarIsHidden) ? {"left":"-325px"} : {"left":"0px"}}
              className='overflow-auto'
            >
              <SideBarContent {...this.props} 
                updateFilters={filters => this.updateFilters(filters)} 
                filters={this.state.filters} 
                setBackToSideBarRef = {el => this.backToSideBarRef = el}
                forwardToContentRef = {this.forwardToContentRef}
              />
            </div>
            <div 
              className = {(this.props.store.narrowScreen && !this.props.store.sideBarIsHidden) ? "black-layer-visible" : "black-layer-invisible"}
              onClick = {() => this.props.store.set("sideBarIsHidden", true)}
            >
            </div>
            {/*!this.props.store.narrowScreen &&
              <div style={{"width":"325px","height":"100%"}}></div>
            */}
            <div 
              ref={el => this.bodyRef = el} 
              style={mainLevelStyle} 
              className='sbl-bodyWrapper flex-nowrap flex-flow-column align-center cw-100 overflow-auto'
            >
              <BodyContent {...this.props} 
                updateFilters={filters => this.updateFilters(filters)} 
                filters={this.state.filters}
                setForwardToContentRef = {el => this.forwardToContentRef = el}
                backToSideBarRef = {this.backToSideBarRef}
              />
            </div>
          </div>
        );
    }
}

export default withStore(createMultiDropDownStore(SideBarLayout));