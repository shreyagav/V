import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import './DatePicker.css'
import TodaySVG from '../svg/TodaySVG';
import CloseUpSVG from '../svg/CloseUpSVG';

class DatePicker extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            calendar: [],
            dateWasSet: false,
            currentYear: null,
            currentMonth: null,
            currentDate: null,
            regularCalendar: true,
            setFocusTo: -1,
            isOpen: false,
        };
        this.todayYear = null;
        this.todayMonth = null;
        this.todayDate = null;
        this.setFocusToRef = null;
        this.calendarBodyRef = null;
        this.datePickerRef = null;
        this.dropDownHeaderRef = null;
        this.setCurrentDate = this.setCurrentDate.bind(this);
    }

    componentWillMount() {
        let today;
        if (this.props.value) {
            this.setCurrentDate(this.props.value, true);
        } else {
            this.setCurrentDate(new Date(), false);
        }
        
    }

    componentWillReceiveProps(props) {
        if(props.value)
            this.setCurrentDate(props.value, true);
    }

    setCurrentDate(today, dateSet) {
        this.todayYear = today.getFullYear();
        this.todayMonth = today.getMonth();
        this.todayDate = today.getDate();
        this.createCalendar(this.todayYear, this.todayMonth);
        this.setState({ currentDate: this.todayDate, dateWasSet: dateSet });

    }

    componentDidUpdate() {
        this.setFocus();
    }

    toggle(){
        this.setState({isOpen: !this.state.isOpen});
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
            this.setState(() => ({calendar: calendar, currentYear: year, currentMonth: month}));
        }
        else {
            this.setState(() => ({calendar: calendar, currentYear: year, currentMonth: month, regularCalendar: true, setFocusTo: -1}));}
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
          case 27: //escape
            this.toggle();
            this.dropDownHeaderRef.focus();
            break;
          default: break;
        }
    }

    calendarKeyDownHandler(e, index, date) {
        switch (e.keyCode)
        {
          case 9: //tab
            e.preventDefault();
            break;
          case 13: //enter 
            this.setState({currentDate: date, dateWasSet: true});
            this.toggle();
            this.dropDownHeaderRef.focus();
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
          case 27: //escape
            this.toggle();
            this.dropDownHeaderRef.focus();
            break;
          default: break;
        }
    }

    buttonKeyDownHandler(e) {
        switch (e.keyCode)
        {
          case 38: //Up Arrow
            e.preventDefault();
            break;
          case 40: //Down Arrow
            e.preventDefault();
            break;
          case 27: //escape
            this.toggle();
            this.dropDownHeaderRef.focus();
            break;
          default: break;
        }
    }

    headerKeyDownHandler(e){
        switch (e.keyCode){
            case 13: //enter
                this.toggle();
                this.dropDownHeaderRef.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.toggle();
                    this.dropDownHeaderRef.focus();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.toggle();}
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.toggle();}
                break;
            default: break;
        }
    }
    onSelect(val) {
        this.toggle();
        if (!this.props.onSelect) {
            this.setState({ currentDate: val, dateWasSet: true });
        } else {
            this.props.onSelect(new Date(this.state.currentYear, this.state.currentMonth,val));
        }
    }

    render() {
        const calendar = this.state.calendar;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return (
            <div ref={el => this.datePickerRef = el} className='date-picker position-wrapper'>
                <div
                    ref={el => this.dropDownHeaderRef = el}
                    tabIndex='0' 
                    onClick={() => this.toggle()}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                    style={this.state.isOpen ? {"border":"1px solid #0099cc"} : {}}
                >
                    <input 
                        readOnly 
                        disabled={true} 
                        placeholder='mm/dd/yy' 
                        value={this.state.dateWasSet ? (("0"+(this.state.currentMonth+1)).slice(-2)+"/"+("0" + this.state.currentDate).slice(-2)+"/"+this.state.currentYear) : ""}
                        style={{'paddingRight':'0px'}}
                    />
                    {this.state.dateWasSet 
                    ?
                    <button className='arrow-button' onClick={(e) => {this.setState({dateWasSet: false}); e.stopPropagation();}}>
                        <CloseUpSVG />
                    </button>
                    :
                    <button disabled className='arrow-button' >
                        <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                    }
                </div>
                {this.state.isOpen &&
                    <div 
                        ref={el => this.calendarBodyRef = el} 
                        className='flex-nowrap flex-flow-column align-center cw-100 date-picker-drop-down absolute-drop-down'
                    >
                        <div className='flex-nowrap justify-stretch mb-05 mt-05 align-center'>
                            <button className='arrow-button' 
                                onClick={() => this.onArrowClick(false)}
                                onKeyDown={(e) => this.buttonKeyDownHandler(e)}
                            >
                                <ArrowUpSVG />
                            </button>
                            <button 
                                className="h2 uppercase-text flex11auto align-self-stretch" 
                                onClick={() => this.toggleCalendar()} disabled={this.state.regularCalendar ? false : true}
                                onKeyDown={(e) => this.buttonKeyDownHandler(e)}
                            >
                                {this.state.regularCalendar && monthNames[this.state.currentMonth] + ' '}<strong><b>{this.state.currentYear}</b></strong>
                            </button>
                            <button className='arrow-button'
                                onClick={() => this.onArrowClick(true)}
                                onKeyDown={(e) => this.buttonKeyDownHandler(e)}
                            >
                                <ArrowUpSVG svgClassName='flip180' />
                            </button>
                        </div>

                        {this.state.regularCalendar &&
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
                                {calendar.map((element, index) =>
                                    <li 
                                        key={index} 
                                        className={element.className} 
                                        tabIndex='0'
                                        onKeyDown={(e) => {
                                            if(index === calendar.length-1 && e.keyCode === 9) {this.toggle();}
                                            else {this.calendarKeyDownHandler(e, index, element.label)}}
                                }
                                onClick={() => this.onSelect(element.label)}
                                        ref={el => {if (index === this.state.setFocusTo) {this.setFocusToRef = el}}}
                                    > 
                                        <div className={element.className}><strong>{element.label}</strong></div>
                                    </li>
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
                                            ref={el => {if (index === this.state.setFocusTo) {this.setFocusToRef = el}}}
                                        >
                                            <div>
                                                <span>
                                                    <strong className='uppercase-text'>{element.slice(0,3)}</strong>
                                                </span>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        }
                        {!(this.state.currentMonth === this.todayMonth && this.state.currentYear === this.todayYear && this.state.regularCalendar) && 
                            <button
                                style={{'flexShrink' : '0'}}
                                className='round-button medium-round-button no-outline-button' 
                                onClick={() => this.createCalendar(this.todayYear, this.todayMonth)}
                            >
                                <span>today</span>
                            </button>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default DatePicker;