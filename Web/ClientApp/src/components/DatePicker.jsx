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

        this.actTodayYear = null;
        this.actTodayMonth = null;
        this.actTodayDate = null;

        this.setFocusToRef = null;
        this.calendarBodyRef = null;
        this.datePickerRef = null;
        this.dropDownHeaderRef = null;
        this.setCurrentDate = this.setCurrentDate.bind(this);
    }

    componentWillMount() {
        if (this.props.value) {
            this.setCurrentDate(this.props.value, true);
        } else {
            this.setCurrentDate(new Date(), false);
        }
        
    }

    componentWillReceiveProps(props) {
        
        this.actTodayYear = new Date().getFullYear();
        this.actTodayMonth = new Date().getMonth();
        this.actTodayDate = new Date().getDate();

        if(props.value){
            this.setCurrentDate(props.value, true);
        }
        else {
            let actToday = new Date();
            let date = actToday;
            if (props.minDate !== null && props.minDate !== undefined && props.minDate > actToday) {date = props.minDate}
            if (props.maxDate !== null && props.maxDate !== undefined && props.maxDate < actToday) {date = props.maxDate}
            this.setCurrentDate(date, false);
        }
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
        if (this.setFocusToRef !== null) {this.setFocusToRef.focus();}
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
        let setFocusTo = 0;
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
              setFocusTo = i + firstDayOfMonth;
            } else calendar.push({label:i+1, className:'current-month', date:new Date(year, month, i+1)})
        }
        //NEXT MONTH
        for (let i = 0; i < 42 - thisMonthNumberOfDays - firstDayOfMonth; i++){
            calendar.push({label:i+1, className:'next-month', date:new Date(nextYear, nextMonth, i+1)});
        }
        //check if to toggle the calendar
        if (this.state.regularCalendar){
            this.setState({calendar: calendar, currentYear: year, currentMonth: month, setFocusTo: setFocusTo});
        }
        else {
            this.setState({calendar: calendar, currentYear: year, currentMonth: month, regularCalendar: true, setFocusTo: setFocusTo});
        }
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

    calendarKeyDownHandler(e, index, element) {
        switch (e.keyCode)
        {
          case 9: //tab
            e.preventDefault();
            break;
          case 13: //enter 
            this.setState({currentDate: element.label, dateWasSet: true});
            this.props.onSelect(element.date);
            this.toggle();
            this.dropDownHeaderRef.focus();
            break;
          case 39: // Right Arrow
            if (!(this.props.maxDate !== null && 
                this.props.maxDate !== undefined &&
                element.date.getFullYear() === this.props.maxDate.getFullYear() &&
                element.date.getMonth() === this.props.maxDate.getMonth() &&
                element.date.getDate() === this.props.maxDate.getDate()
            )){
                // if next date is not max date
                if (index < 41) {
                    this.setState(()=>({setFocusTo: index+1}));
                }
                else {
                    let date = element.date.getDate();
                    let year = element.date.getFullYear();
                    let month = element.date.getMonth();
                    let firstDayOfMonth = (new Date(year, month, 1)).getDay();
                    //let lastDayOfMonth = this.amountOfDays(month, year);
                    // NOTE !!! There is no option the last day is the last day of the month
                    this.createCalendar (year, month);
                    this.setState({setFocusTo: date + firstDayOfMonth});
                }
            }
            break;
          case 37: //Left arrow
            if (!(this.props.minDate !== null && this.props.minDate !== undefined && 
                element.date.getFullYear() === this.props.minDate.getFullYear() &&
                element.date.getMonth() === this.props.minDate.getMonth() &&
                element.date.getDate() === this.props.minDate.getDate()
            )){
                // if previous date is not min date
                if (index > 0) {
                    this.setState(()=>({setFocusTo: index-1}));
                }
                else {
                    let date = element.date.getDate();
                    let year = element.date.getFullYear();
                    let month = element.date.getMonth();
                    let firstDayOfMonth = (new Date(year, month, 1)).getDay();
                    if (date === 1) {
                        if(month > 0){
                            this.createCalendar (year, month-1);
                            this.setState({setFocusTo: this.amountOfDays(month-1, year) + (new Date(year, month-1, 1)).getDay() - 1});
                        } 
                        else {
                            this.createCalendar (year-1, 11);
                            this.setState({setFocusTo: this.amountOfDays(11, year-1) + (new Date(year-1, 11, 1)).getDay() - 1});
                        }
                    }
                    else {
                        this.createCalendar (year, month);
                        this.setState({setFocusTo: date - 1 + firstDayOfMonth - 1});
                    }
                }
            }
            break;

          case 38: //Up Arrow 
          {
            //debugger
            let year = element.date.getFullYear();
            let month = element.date.getMonth();
            let date = element.date.getDate();
            let newDateYear = year;
            let newDateMonth = month;
            let newDateDate = date - 7;
            if (newDateDate < 1) {
                if (newDateMonth > 0) {newDateMonth = newDateMonth - 1;}
                else {
                    newDateMonth = 11;
                    newDateYear = year - 1;
                }
                let newDateLastDayOfMonth = this.amountOfDays(newDateMonth, newDateYear);
                newDateDate = date + newDateLastDayOfMonth - 7;
            }
            if (!(this.props.minDate !== null && 
                this.props.minDate !== undefined && 
                new Date(newDateYear, newDateMonth, newDateDate) > this.props.minDate
            )){
                if (index > 6) {
                    let newDate = this.state.calendar[index-7].date;
                    if (!(this.props.minDate !== null && this.props.minDate !== undefined && newDate < this.props.minDate)){
                        this.setState(()=>({setFocusTo: index-7}))
                    }
                }
                else {
                    this.createCalendar (newDateYear, newDateMonth);
                    let firstDayOfNewMonth = (new Date(newDateYear, newDateMonth, 1)).getDay();
                    this.setState({setFocusTo: newDateDate + firstDayOfNewMonth - 1});
                }
                e.preventDefault();
            }}
            break;

          case 40: //Down Arrow
            let year = element.date.getFullYear();
            let month = element.date.getMonth();
            let date = element.date.getDate();
            let lastDayOfMonth = this.amountOfDays(month, year);
            let newDateYear = year;
            let newDateMonth = month;
            let newDateDate = date + 7 - lastDayOfMonth;
            if (newDateDate > 0){
                if (month > 10) {newDateMonth = 0; newDateYear = year + 1}
                else {newDateMonth = month + 1; newDateYear = year;}
            }
            if (!(this.props.maxDate !== null && 
                this.props.maxDate !== undefined &&
                new Date(newDateYear, newDateMonth, newDateDate) < this.props.maxDate
            )){
                if (index < 35) {
                    let newDate = this.state.calendar[index+7].date;
                    if (!(this.props.maxDate !== null && 
                        this.props.maxDate !== undefined && 
                        newDate > this.props.maxDate
                    )){
                        this.setState(()=>({setFocusTo: index+7}));
                    }
                }
                else {
                    this.createCalendar (newDateYear, newDateMonth);
                    let firstDayOfNewMonth = (new Date(newDateYear, newDateMonth, 1)).getDay();
                    if(newDateMonth === month){
                        this.setState({setFocusTo: date + firstDayOfNewMonth + 6});
                    }
                    else {this.setState({setFocusTo: newDateDate + firstDayOfNewMonth - 1});}
                }
                e.preventDefault();
            }
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

    checkIfDisabled(date) {
        if (this.props.minDate !== null && this.props.minDate !== undefined){
            // the MIN date was set
            if(date < this.props.minDate){
                return true;
            } else return false;
        }
        else {
            if (this.props.maxDate !== null && this.props.maxDate !== undefined) {
                // the MAX date was set
                if(date > this.props.maxDate){
                    return true;
                } 
                else return false;
            } else return false;
        }
    }

    checkIfActToday(date) {
        if(this.actTodayDate === date.getDate() && this.actTodayMonth === date.getMonth() && this.actTodayYear === date.getFullYear()){
            return true;
        } else return false;
    }

    render() {
        const calendar = this.state.calendar;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return (
            <div ref={el => this.datePickerRef = el} className='date-picker position-wrapper'>
                <div 
                    className='input-button-wrapper'
                    ref={el => this.dropDownHeaderRef = el}
                    tabIndex='0' 
                    onClick={() => this.toggle()}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                    style={this.state.isOpen ? {"border":"1px solid #0099cc"} : {}}
                >
                    <input 
                        readOnly 
                        tabIndex='-1'
                        placeholder='mm/dd/yy' 
                        value={this.state.dateWasSet ? (("0"+(this.state.currentMonth+1)).slice(-2)+"/"+("0" + this.state.currentDate).slice(-2)+"/"+this.state.currentYear) : ""}
                    />
                    {this.state.dateWasSet && !this.state.isOpen
                    ?
                    <button 
                        className='arrow-button'
                        onClick={(e) => {
                            this.setState({dateWasSet: false, isOpen: false}); 
                            e.stopPropagation();
                            this.props.onSelect(null);
                        }}
                        onKeyDown={(e) => {
                            if(e.keyCode === 13){
                                e.stopPropagation();
                                this.setState({dateWasSet: false, isOpen: false});
                                this.props.onSelect(null);
                                this.dropDownHeaderRef.focus();
                            }}}
                    >
                        <CloseUpSVG />
                    </button>
                    :
                    <button 
                        disabled
                        className='arrow-button' 
                    >
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
                                className="h2 uppercase-text flex11auto align-self-stretch no-outline-button" 
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
                                {calendar.map((element, index) => {
                                    let disabled = this.checkIfDisabled(element.date);
                                    let actToday = this.checkIfActToday(element.date);
                                    return <li key={index} 
                                        className={element.className + (disabled ? " disabled" : "") + (actToday ? " act-today" : "")}
                                        tabIndex={disabled ? -1 : 0}
                                        onKeyDown={(e) => {
                                            if(!disabled){
                                                if(index === calendar.length-1 && e.keyCode === 9) {this.toggle();}
                                                else {this.calendarKeyDownHandler(e, index, element)}
                                            }
                                        }}
                                        onClick={() => {if(!disabled){this.onSelect(element.label)}}}
                                        ref={el => {
                                            if (index === this.state.setFocusTo) {this.setFocusToRef = el}
                                        }}
                                    > 
                                        <div className={element.className}><strong>{element.label}</strong></div>
                                    </li>
                                    })}
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
                                            ref={el => {
                                                if (index === this.state.setFocusTo) {
                                                    this.setFocusToRef = el
                                                }
                                            }}
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