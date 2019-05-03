import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
//import NatureLocationSVG from '../svg/NatureLocationSVG';
import PlusSVG from '../svg/PlusSVG';
import { withStore } from './store';
import { withMultiDropDownStore } from './MultiDropDown/MultiDropDownStore';
import './Calendar.css'
import { createMultiDropDownStore } from './MultiDropDown/MultiDropDownStore';
import MultiDropDownHeader from './MultiDropDown/MultiDropDownHeader';
import { Service } from './ApiService';
import MultiDropDown from './MultiDropDown/MultiDropDown';

class Calendar extends Component {
    static displayName = Calendar.name;
    
    constructor(props) {
        super(props);
        this.state = {
            calendar: [],
            currentYear: null,
            currentMonth: null,
            /*flag: false,*/
            regularCalendar: true,
            setFocusTo: -1,
            chapters: [],
            events: [],
            selectedChapters: [],
            loading: false
        };
        this.todayYear = null;
        this.todayMonth = null;
        this.todayDate = null;
        this.setFocusToRef = null;

        this.calendarBodyRef = null;
        this.initialX = null;
        this.initialY = null;
        this.longTouch = false;
        this.getEventsForMonth = this.getEventsForMonth.bind(this);
        this.setSelectedChapters = this.setSelectedChapters.bind(this);
    }

    setSelectedChapters(arr) {
        this.setState({ selectedChapters: arr });
        this.getEventsForMonth(this.state.currentYear, this.state.currentMonth+1, arr);
    }
    componentWillMount() {
        let today = new Date();
        this.todayYear = today.getFullYear();
        this.todayMonth = today.getMonth();
        this.todayDate = today.getDate();
        this.createCalendar(this.todayYear, this.todayMonth);
    }

    getEventsForMonth(year,month, sites) {
        var component = this;
        var ids = [];
        component.setState({ loading: true });
        if (sites) {
            ids = sites.map(a => a.id);
        }
        Service.getCalendarEvents(month + 1, year, ids).then(data => component.setState({ events: data, loading: false })).catch(err => component.setState({ loading: false }));
    }
    componentWillReceiveProps(props) {
        console.log(props);
        var ids = [];
        props.multiDropDownStore.modifiedList.forEach(st => {
            var tmp = st.chapters.filter(ch => ch.checked);
            ids = ids.concat(tmp);
        });
        if (ids.length != this.state.selectedChapters.length) {
            this.getEventsForMonth(this.state.currentYear, this.state.currentMonth, ids);
            this.setState({ selectedChapters:ids });
        }
    }

    componentDidUpdate() {
      this.setFocus();
    }

    setFocus() {
        if (this.setFocusToRef !== null) {
          this.setFocusToRef.focus();
        }
    }

    leapYear (year){
        if (year % 4 === 0) {
          if (year % 100 === 0) {
            if (year % 400 === 0) {
              return true;
            } else {return false}
          } else {return true};
        } else {return false}
    }
      
    amountOfDays (month, year){
        const monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let leap = this.leapYear (year);
        if (month === 1 && leap) { 
          return monthArray[month] += 1;
        } else return monthArray[month];
    }

    createCalendar (year, month) {
        
        let todayYear = this.todayYear;
        let todayMonth = this.todayMonth;
        let todayDate = this.todayDate;
        let firstDayOfMonth = (new Date(year, month, 1)).getDay();
        let calendar = [];
        let prevMonth, prevYear, nextMonth, nextYear, prevMonthNumberOfDays;
        let thisMonthNumberOfDays = this.amountOfDays(month, year);
        if (month > 0) {
          prevMonthNumberOfDays = this.amountOfDays (month - 1, year);
          prevMonth = month - 1; 
          prevYear = year;
        }
        else {
          prevMonthNumberOfDays = this.amountOfDays (11, year - 1);
          prevMonth = 11; 
          prevYear = year - 1;
        }
        if (month < 11) {
          nextMonth = month + 1; 
          nextYear = year;
        } 
        else {
          nextMonth = 0; 
          nextYear = year + 1;
        }
        //PREVIOUS MONTH
        for (let i = prevMonthNumberOfDays - firstDayOfMonth + 1; i < prevMonthNumberOfDays + 1; i++){
            calendar.push({label:i, className:'last-month', date:new Date(prevYear, prevMonth, i)});
        } 
        //CURRENT MONTH
        for (let i = 0; i < thisMonthNumberOfDays; i++){
            if ((year === todayYear)&&(month === todayMonth)&&(i+1===todayDate)) { 
              calendar.push({label:i+1, className:'today', date:new Date(year, month, i+1)});
            } else calendar.push({label:i+1, className:'current-month', date:new Date(year, month, i+1)})
        }
        //NEXT MONTH
        for (let i = 0; i < 42 - thisMonthNumberOfDays - firstDayOfMonth; i++){
            calendar.push({label:i+1, className:'next-month', date:new Date(nextYear, nextMonth, i+1)});
        }
        //check if to toggle the calendar
        if (this.state.regularCalendar){
            this.setState({calendar: calendar, currentYear: year, currentMonth: month});
        }
        else {
            this.setState({ calendar: calendar, currentYear: year, currentMonth: month, regularCalendar: true, setFocusTo: -1 });
        }
        this.getEventsForMonth(year, month, this.state.selectedChapters);
    }

    incrementMonth(){
        if (this.state.currentMonth < 11){
          this.createCalendar (this.state.currentYear, this.state.currentMonth+1);
        } else this.createCalendar (this.state.currentYear+1, 0);
    }
      
    decrementMonth(){
        if (this.state.currentMonth > 0){
          this.createCalendar (this.state.currentYear, this.state.currentMonth-1);
        } else this.createCalendar (this.state.currentYear-1, 11);
    }

    incrementYear(){
        let currentYear = this.state.currentYear;
        if(currentYear < this.todayYear + 100) {
            this.setState(() => ({currentYear: currentYear + 1}));
        }
    }
      
    decrementYear(){
        let currentYear = this.state.currentYear;
        if(currentYear > this.todayYear - 100) {
            this.setState(() => ({currentYear: currentYear - 1}));
        }
    }

    onArrowClick(increment){
        switch(increment) {
            case true:
                if(this.state.regularCalendar) {this.incrementMonth()}
                else{this.incrementYear()};
                break;
            case false:
                if(this.state.regularCalendar) {this.decrementMonth()}
                else{this.decrementYear()};
                break;
        }
    }

    toggleCalendar() {
        let calendar = this.state.regularCalendar;
        this.setState(() => ({regularCalendar: !calendar, setFocusTo: -1}));
    }

    monthPickerKeyDownHandler(e, index) {
        switch (e.keyCode)
        {
          case 13: //enter
            this.createCalendar(this.state.currentYear, index);
            break;
          case 39: // Right Arrow
            if (index<11) {this.setState(()=>({setFocusTo: index+1}))};
            break;
          case 37: //Left arrow
            if (index>0) {this.setState(()=>({setFocusTo: index-1}))};
            break;
          case 38: //Up Arrow
            if (index>3) {this.setState(()=>({setFocusTo: index-4}))};
            e.preventDefault();
            break;
          case 40: //Down Arrow
            if (index<9) {this.setState(()=>({setFocusTo: index+4}))};
            e.preventDefault();
            break;
          case 9: //tab
            this.toggleCalendar();
            break;
          default: break;
        }
    }

    calendarKeyDownHandler(e, index) {
        switch (e.keyCode)
        {
          case 13: //enter 
            break;
          case 39: // Right Arrow
            if (index < 41) {this.setState(()=>({setFocusTo: index+1}))};
            break;
          case 37: //Left arrow
            if (index > 0) {this.setState(()=>({setFocusTo: index-1}))};
            break;
          case 38: //Up Arrow
            if (index > 6) {this.setState(()=>({setFocusTo: index-7}))};
            e.preventDefault();
            break;
          case 40: //Down Arrow
            if (index < 35) {this.setState(()=>({setFocusTo: index+7}))};
            e.preventDefault();
            break;
          default: break;
        }
    }

    calendarUpdate = () => {
      if (this.props.store.tableStileView) {
        return this.state.calendar;
      }
      else {
        let newCalendar = this.state.calendar.filter(element => {return element.className === 'current-month'});
        return newCalendar;
      }
    };

    setRef(el, index){
      if (index === this.state.setFocusTo) {
        this.setFocusToRef = el;
      }
    }

    setFocusFunction(el, index){
      if (index === this.state.setFocusTo) {
        this.setFocusToRef = el;
      }
    }

    render() {
        const calendar = this.calendarUpdate();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var maxWidth = {};
        if (!this.state.regularCalendar) { maxWidth = { 'maxWidth': '500px' } };
        if (this.state.loadData) {
            return (
                <div className='loader-wrapper'>
                    <img src='kayak.gif' alt='loading' className="loader-img" />
                </div>
            );
        } else {
            return (
                <div>
                    <div className='flex-flow-column'>
                        <div className='flex-wrap justify-space-between align-center'>
                            <h1 className='h2 uppercase-text pl-025'>
                                <strong>
                                    Event Calendar
                        </strong>
                    </h1>
                    <span>
                        {!(this.state.currentMonth === this.todayMonth && this.state.currentYear === this.todayYear && this.state.regularCalendar) && 
                        <button
                            style={{'flexShrink' : '0'}}
                            className='round-button medium-round-button grey-outline-button' 
                            onClick={() => this.createCalendar(this.todayYear, this.todayMonth)}
                        >
                            <span>today</span>
                        </button>
                        }
                    </span>
                    </div>
                    <MultiDropDown 
                            toggleable={false}
                            list={this.props.store.chapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            expandBy='chapters'
                            expandedTextProperty='name'
                            expandedKeyProperty='id'
                            expandedMultiSelect={true}
                            defaultValue={this.props.chapterFilter}
                            placeholder='National'
                            onDropDownValueChange = {value => this.props.onBodyDropDownValueChange(value)}
                            hideHeader = {false}
                            hideList = {true}
                    />
                    {/*<MultiDropDownHeader toggleable={false} placeholder='National'/>*/}
                </div>
                <div className='flex-nowrap justify-stretch mb-05 mt-05 align-center'>
                    <button className='h1 square-button-height' 
                    onClick={() => this.onArrowClick(false)}
                    //onKeyDown={(e) => this.buttonKeyDownHandler(e)}
                    >
                    <ArrowUpSVG svgClassName='flip0'/>
                    </button>
                    <button 
                    className="h1 uppercase-text flex11auto align-self-stretch" 
                    onClick={() => this.toggleCalendar()} disabled={this.state.regularCalendar ? false : true}
                    onKeyDown={(e) => this.buttonKeyDownHandler(e)}
                    >
                    {this.state.regularCalendar && monthNames[this.state.currentMonth] + ' '}<strong><b>{this.state.currentYear}</b></strong>
                    </button>
                    <button className='h1 square-button-height'
                    onClick={() => this.onArrowClick(true)}
                    //onKeyDown={(e) => this.buttonKeyDownHandler(e)}
                    >
                    <ArrowUpSVG svgClassName='flip180' />
                    </button>
                </div>

                    {this.state.regularCalendar && this.props.store.tableStileView &&
                        <ul className='calendar-grid calendar-header light-grey-text uppercase-text nonselect'>
                            <li>Su</li>
                            <li>Mo</li>
                            <li>Tu</li>
                            <li>We</li>
                            <li>Th</li>
                            <li>Fr</li>
                            <li>Sa</li>
                        </ul>
                    }

                    {this.state.regularCalendar &&
                        <ul className='calendar-grid calendar-content dark-grey-text'>
                            {calendar.map((element, index) => {
                                let eventKey = (element.date.getMonth() + 1).toString() + '-' + element.date.getDate().toString();
                                let dayOfEvents = this.state.events.find(a => a.day == eventKey);
                                return (
                                    <li
                                        key={index}
                                        className={this.props.store.tableStileView ? element.className : element.className + ' listStyleView'}
                                        tabIndex='0'
                                        onKeyDown={(e) => this.calendarKeyDownHandler(e, index)}
                                        ref={el => this.setRef(el, index)}
                                    >
                                        {this.props.store.tableStileView
                                            ?
                                            <div className={element.className}>
                                                <span>
                                                    <strong>{element.label}</strong>
                                                    <a className='round-button small-round-button light-grey-outline-button' href='./new-event'>
                                                        <PlusSVG />
                                                    </a>
                                                </span>
                                                {dayOfEvents &&
                                                    <ul className='calendar-events-list'>{dayOfEvents.events.map((event, index) =>
                                                        <li key={index}>
                                                            <span style={{ 'backgroundColor': event.color }}>{event.hours.toString() + ':' + ('0' + event.minutes.toString()).slice(-2) + ' ' + (event.am ? "AM" : "PM")}</span>
                                                            <span style={this.props.store.narrowScreen ? { 'color': event.color, "maxHeight": "2.2em" } : { 'color': event.color }}>{event.name}</span>
                                                        </li>
                                                    )}
                                                    </ul>
                                                }
                                            </div>
                                            :
                                            <div className={element.className}>
                                                <div>
                                                    <strong>{element.label}</strong>
                                                    {dayOfEvents &&
                                                        <ul className='calendar-events-list'>{dayOfEvents.events.map((event, index) =>
                                                            <li key={index}>
                                                                <span style={{ 'backgroundColor': event.color }}>{event.hours.toString() + ':' + ('0' + event.minutes.toString()).slice(-2) + ' ' + (event.am ? "AM" : "PM")}</span>
                                                                <span style={this.props.store.narrowScreen ? { 'color': event.color, "maxHeight": "2.2em" } : { 'color': event.color }}>{event.name}</span>
                                                            </li>
                                                        )}
                                                        </ul>
                                                    }
                                                </div>
                                                <a className='round-button medium-round-button light-grey-outline-button' href='./new-event'>
                                                    <PlusSVG />
                                                </a>
                                            </div>
                                        }
                                    </li>
                                );
                            }
                            )}
                        </ul>
                    }
                    {!this.state.regularCalendar &&
                        <div className='flex-nowrap justify-center'>
                            <ul className='calendar-grid month-calendar-grid calendar-content dark-grey-text'>
                                {monthNames.map((element, index) =>
                                    <li
                                        key={index}
                                        tabIndex='0'
                                        onClick={() => this.createCalendar(this.state.currentYear, index)}
                                        onKeyDown={(e) => this.monthPickerKeyDownHandler(e, index)}
                                        className={(this.state.currentYear === this.todayYear && index === this.todayMonth) ? 'today' : ''}
                                        ref={el => this.setFocusFunction(el, index)}
                                    >
                                        <div>
                                            <span>
                                                <strong className='uppercase-text'>
                                                    {element.slice(0, 3)}
                                                </strong>
                                            </span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                </div>
            )
        }
    }
}

export default withStore(withMultiDropDownStore(Calendar));