import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import './DatePicker.css'
import TodaySVG from '../svg/TodaySVG';
import CloseUpSVG from '../svg/CloseUpSVG';
import DatePickerDropDown from './DatePickerDropDown';

class DatePicker extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            calendar: [],
            currentYear: null,
            currentMonth: null,
            currentDate: null,
            regularCalendar: true,
            setFocusTo: -1,
            isOpen: false,
            incButtonDisabled: false,
            decButtonDisabled: false,
        };
        this.todayYear = null;
        this.todayMonth = null;
        this.todayDate = null;

        this.actTodayYear = null;
        this.actTodayMonth = null;
        this.actTodayDate = null;

        this.datePickerRef = null;
        this.dropDownHeaderRef = null;
        this.todayButtonRef = null;
        this.setCurrentDate = this.setCurrentDate.bind(this);
        this.performMultipleTimes = this.performMultipleTimes.bind(this);
        this.clearTimeoutAndInterval = this.clearTimeoutAndInterval.bind(this)
        this.toggleCalendar = this.toggleCalendar.bind(this)
        this.toggle = this.toggle.bind(this)
        this.onArrowClick = this.onArrowClick.bind(this)
        this.calendarKeyDownHandler = this.calendarKeyDownHandler.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.createCalendar = this.createCalendar.bind(this)
        this.monthPickerKeyDownHandler = this.monthPickerKeyDownHandler.bind(this)
        this.checkIfDisabled = this.checkIfDisabled.bind(this)
        this.checkIfActToday = this.checkIfActToday.bind(this)
        this.setProp = this.setProp.bind(this)
        this.checkIfMonthIsWalkable = this.checkIfMonthIsWalkable.bind(this)
        this.checkIfYearIsWalkable = this.checkIfYearIsWalkable.bind(this)
    }

    componentWillMount() {
        if (this.props.value) { this.setCurrentDate(this.props.value, true) } 
        else { this.setCurrentDate(new Date(), false) }
    }

    componentWillReceiveProps(props) {
        this.actTodayYear = new Date().getFullYear();
        this.actTodayMonth = new Date().getMonth();
        this.actTodayDate = new Date().getDate();
        if(props.value){
            this.setCurrentDate(props.value/*, true*/);
        }
        else {
            let actToday = new Date();
            let date = actToday;
            if (props.minDate !== null && props.minDate !== undefined && props.minDate > actToday) {date = props.minDate}
            if (props.maxDate !== null && props.maxDate !== undefined && props.maxDate < actToday) {date = props.maxDate}
            this.setCurrentDate(date/*, false*/);
        }
    }

    setCurrentDate(today/*, dateSet */) {
        this.todayYear = today.getFullYear();
        this.todayMonth = today.getMonth();
        this.todayDate = today.getDate();
        this.createCalendar(this.todayYear, this.todayMonth);
        this.setState({ currentDate: this.todayDate /*, dateWasSet: dateSet */ });
    }

    toggle(){
        this.clearTimeoutAndInterval();
        let currentYear = this.state.currentYear;
        let currentMonth = this.state.currentMonth;
        let incButtonDisabled = false;
        let decButtonDisabled = false;
        if(this.state.regularCalendar) {
            incButtonDisabled = !this.checkIfMonthIsWalkable(currentYear, currentMonth, true);
            decButtonDisabled = !this.checkIfMonthIsWalkable(currentYear, currentMonth, false);
        }
        else {
            incButtonDisabled = !this.checkIfYearIsWalkable(currentYear, true);
            decButtonDisabled = !this.checkIfYearIsWalkable(currentYear, false);
        }
        if (this.state.isOpen) {
            this.setState({ 
                isOpen: !this.state.isOpen,
                incButtonDisabled: incButtonDisabled,
                decButtonDisabled: decButtonDisabled,
            }, () => { this.dropDownHeaderRef.focus() });
        }
        else { this.setState({ 
            isOpen: !this.state.isOpen,
            incButtonDisabled: incButtonDisabled,
            decButtonDisabled: decButtonDisabled,
        }) }
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


    createCalendar (year, month, callback) {
        let actToday = new Date();
        let todayYear = actToday.getFullYear();
        let todayMonth = actToday.getMonth();
        let todayDate = actToday.getDate();
        //let setFocusTo = 0;
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
                calendar.push({label:i+1, className:'actToday current-month', date:new Date(year, month, i+1)}) 
                //setFocusTo = i + firstDayOfMonth;
            } else calendar.push({label:i+1, className:'current-month', date:new Date(year, month, i+1)})
        }
        //NEXT MONTH
        for (let i = 0; i < 42 - thisMonthNumberOfDays - firstDayOfMonth; i++){
            calendar.push({label:i+1, className:'next-month', date:new Date(nextYear, nextMonth, i+1)});
        }
        let incButtonDisabled = !this.checkIfMonthIsWalkable(year, month, true);
        let decButtonDisabled = !this.checkIfMonthIsWalkable(year, month, false);
        //check if to toggle the calendar
        if (this.state.regularCalendar){
            this.setState({
                calendar: calendar, 
                currentYear: year, 
                currentMonth: month, 
                setFocusTo: -1,
                incButtonDisabled: incButtonDisabled,
                decButtonDisabled: decButtonDisabled,
            }, () => { if(typeof callback === 'function'){callback()}});
        }
        else {
            this.setState({
                calendar: calendar, 
                currentYear: year, 
                currentMonth: month, 
                regularCalendar: true, 
                setFocusTo: -1,
                incButtonDisabled: incButtonDisabled,
                decButtonDisabled: decButtonDisabled,
            }, () => { if(typeof callback === 'function'){callback()}});
        }
    }

    incrementMonth(){
        if (this.state.currentMonth < 11){
            this.createCalendar (this.state.currentYear, this.state.currentMonth+1);
        } else {
            this.createCalendar (this.state.currentYear+1, 0);
        };
    }
      
    decrementMonth(){
        if (this.state.currentMonth > 0){
          this.createCalendar (this.state.currentYear, this.state.currentMonth-1);
        } else this.createCalendar (this.state.currentYear-1, 11);
    }

    incrementYear(){
        let currentYear = this.state.currentYear;
        let incButtonDisabled = !this.checkIfYearIsWalkable(currentYear+1, true);
        let decButtonDisabled = !this.checkIfYearIsWalkable(currentYear+1, false);
        if(currentYear < this.todayYear + 100) {
            this.setState(() => ({
                currentYear: currentYear + 1,
                incButtonDisabled: incButtonDisabled,
                decButtonDisabled: decButtonDisabled,
            }));
        }
    }
      
    decrementYear(){
        let currentYear = this.state.currentYear;
        let incButtonDisabled = !this.checkIfYearIsWalkable(currentYear-1, true);
        let decButtonDisabled = !this.checkIfYearIsWalkable(currentYear-1, false);
        if(currentYear > this.todayYear - 100) {
            this.setState(() => ({
                currentYear: currentYear - 1,
                incButtonDisabled: incButtonDisabled,
                decButtonDisabled: decButtonDisabled,
            }));
        }
    }

    onArrowClick(increment){
        switch(increment) {
            case true:
                if(this.state.regularCalendar) { if(this.checkIfMonthIsWalkable(this.state.currentYear, this.state.currentMonth, true)){this.incrementMonth()}}
                else if(this.checkIfYearIsWalkable(this.state.currentYear, true)){this.incrementYear()}
                break;
            case false:
                if(this.state.regularCalendar) { 
                    if(this.checkIfMonthIsWalkable(this.state.currentYear, this.state.currentMonth, false)){
                        this.decrementMonth();
                        this.setState({setFocusTo: -1});
                    }}
                else if(this.checkIfYearIsWalkable(this.state.currentYear, false)){
                    this.decrementYear();
                    this.setState({setFocusTo: -1});
                };
                break;
        }
    }

    toggleCalendar(callback) {
        let currentYear = this.state.currentYear;
        let currentMonth = this.state.currentMonth;
        let incButtonDisabled = false;
        let decButtonDisabled = false;
        if(this.state.regularCalendar) {
            incButtonDisabled = !this.checkIfYearIsWalkable(currentYear, true);
            decButtonDisabled = !this.checkIfYearIsWalkable(currentYear, false);
        }
        else {
            incButtonDisabled = !this.checkIfMonthIsWalkable(currentYear, currentMonth, true);
            decButtonDisabled = !this.checkIfMonthIsWalkable(currentYear, currentMonth, false);
        }
        this.setState({ 
            regularCalendar: !this.state.regularCalendar, 
            setFocusTo: -1,
            incButtonDisabled: incButtonDisabled,
            decButtonDisabled: decButtonDisabled,
        }, callback);
    }

    monthPickerKeyDownHandler(e) {
        let index = this.state.setFocusTo;
        switch (e.keyCode){
            case 39: // Right Arrow
                if(this.checkIfMonthIsWalkable(this.state.currentYear, index, true)){
                    if (index<11) {this.setState(()=>({setFocusTo: index+1}))}
                    else {
                        let incButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear+1, true);
                        let decButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear+1, false);
                        this.setState({
                            currentYear: this.state.currentYear+1, 
                            currentMonth: 0, 
                            setFocusTo: 0,
                            incButtonDisabled: incButtonDisabled,
                            decButtonDisabled: decButtonDisabled,
                        })
                    }
                }
                break;
            case 37: //Left arrow
                if(this.checkIfMonthIsWalkable(this.state.currentYear, index, false)){
                    if (index>0) {this.setState(()=>({setFocusTo: index-1}))}
                    else {
                        let incButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear-1, true);
                        let decButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear-1, false);
                        this.setState({
                            currentYear: this.state.currentYear-1, 
                            currentMonth: 11, 
                            setFocusTo: 11,
                            incButtonDisabled: incButtonDisabled,
                            decButtonDisabled: decButtonDisabled,
                        })}
                }
                break;
            case 38: //Up Arrow
                if (index>3) {
                    if(this.checkIfMonthIsWalkable(this.state.currentYear, index-4, 5)){
                        this.setState(()=>({setFocusTo: index-4}))}
                    }
                else {
                    if(this.checkIfMonthIsWalkable(this.state.currentYear-1, 11+index-3, 5)){
                        let incButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear-1, true);
                        let decButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear-1, false);
                        this.setState({
                            currentYear: this.state.currentYear-1, 
                            currentMonth: 11+index-3, 
                            setFocusTo: 11+index-3,
                            incButtonDisabled: incButtonDisabled,
                            decButtonDisabled: decButtonDisabled,
                        })
                    }
                }
                e.preventDefault();
                break;
            case 40: //Down Arrow
                if (index<9) {
                    if(this.checkIfMonthIsWalkable(this.state.currentYear, index+4, 5)){
                        this.setState(()=>({setFocusTo: index+4}))
                    }
                }
                else {
                    if(this.checkIfMonthIsWalkable(this.state.currentYear+1, index+3-11, 5)){
                        let incButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear+1, true);
                        let decButtonDisabled = !this.checkIfYearIsWalkable(this.state.currentYear+1, false);
                        this.setState({
                            currentYear: this.state.currentYear+1, 
                            currentMonth: index+3-11, 
                            setFocusTo: index+3-11,
                            incButtonDisabled: incButtonDisabled,
                            decButtonDisabled: decButtonDisabled,
                        })
                    }
                }
                e.preventDefault();
                break;
            default: break;
        }
    }

    calendarKeyDownHandler(e) {
        let index = this.state.setFocusTo;
        if(index > -1){
            let fullDate = this.state.calendar[index].date;
            switch (e.keyCode){
                case 39: // Right Arrow
                    if (!(this.props.maxDate !== null && 
                        this.props.maxDate !== undefined &&
                        fullDate.getFullYear() === this.props.maxDate.getFullYear() &&
                        fullDate.getMonth() === this.props.maxDate.getMonth() &&
                        fullDate.getDate() === this.props.maxDate.getDate()
                    )){
                        // if next date is not max date
                        if (index < 41) {
                            this.setState(()=>({setFocusTo: index+1}));
                        }
                        else {
                            let date = fullDate.getDate();
                            let year = fullDate.getFullYear();
                            let month = fullDate.getMonth();
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
                        fullDate.getFullYear() === this.props.minDate.getFullYear() &&
                        fullDate.getMonth() === this.props.minDate.getMonth() &&
                        fullDate.getDate() === this.props.minDate.getDate()
                    )){
                        // if previous date is not min date
                        if (index > 0) {
                            this.setState(()=>({setFocusTo: index-1}));
                        }
                        else {
                            let date = fullDate.getDate();
                            let year = fullDate.getFullYear();
                            let month = fullDate.getMonth();
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

                case 38: /* Up Arrow */
                    {
                    let year = fullDate.getFullYear();
                    let month = fullDate.getMonth();
                    let date = fullDate.getDate();
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
                    if (this.props.minDate === null || this.props.minDate === undefined || new Date(newDateYear, newDateMonth, newDateDate) >= this.props.minDate){
                        this.createCalendar (newDateYear, newDateMonth);
                        let firstDayOfNewMonth = (new Date(newDateYear, newDateMonth, 1)).getDay();
                        this.setState({setFocusTo: newDateDate + firstDayOfNewMonth - 1});
                    }}
                    e.preventDefault();
                    break;

                case 40: /* Down Arrow */
                    {
                    let year = fullDate.getFullYear();
                    let month = fullDate.getMonth();
                    let date = fullDate.getDate();
                    let lastDayOfMonth = this.amountOfDays(month, year);
                    let newDateYear = year;
                    let newDateMonth = month;
                    let newDateDate = date + 7;
                    if (newDateDate > lastDayOfMonth){
                        if (month > 10) {newDateMonth = 0; newDateYear = year + 1}
                        else {newDateMonth = month + 1; newDateYear = year;}
                        newDateDate = newDateDate - lastDayOfMonth;
                    }
                    if (this.props.maxDate === null || this.props.maxDate === undefined || new Date(newDateYear, newDateMonth, newDateDate) <= this.props.maxDate){
                        this.createCalendar (newDateYear, newDateMonth);
                        let firstDayOfNewMonth = (new Date(newDateYear, newDateMonth, 1)).getDay();
                        if(newDateMonth === month){ this.setState({setFocusTo: date + firstDayOfNewMonth + 6}) }
                        else {this.setState({setFocusTo: newDateDate + firstDayOfNewMonth - 1});}
                    }}
                    e.preventDefault();
                    break;
                default: break;
            }
        } else {e.preventDefault()}
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
            this.setState({ currentDate: val /*, dateWasSet: true */});
        } else {
            this.props.onSelect(val);
        }
    }

    checkIfDisabled(index) {
        if (this.props.minDate !== null && this.props.minDate !== undefined){
            // the MIN date was set
            if(this.state.calendar[index].date < this.props.minDate){
                return true;
            } else return false;
        }
        else {
            if (this.props.maxDate !== null && this.props.maxDate !== undefined) {
                // the MAX date was set
                if(this.state.calendar[index].date > this.props.maxDate){
                    return true;
                } 
                else return false;
            } else return false;
        }
    }

    checkIfMonthIsWalkable(currentYear, currentMonth, next) {
        let month = currentMonth;
        let year = currentYear;
        if(next === true){
            if (currentMonth < 11){ month = month + 1 }
            else {month = 0; year = year + 1}
        } 
        if (next === false){
            if (currentMonth > 0){ month = month - 1 }
            else {month = 11; year = year - 1}
        }
        let monthLastDay = this.amountOfDays(month, year);
        if(
            (this.props.minDate === undefined && new Date(year, month, 1) > this.props.maxDate) || 
            (this.props.maxDate === undefined && new Date(year, month, monthLastDay) < this.props.minDate)
        ){ return false }
        else return true;
    }

    checkIfYearIsWalkable(currentYear, next) {
        let year = currentYear;
        if(next === true){year = year + 1}
        if (next === false){year = year - 1}
        if(
            (this.props.minDate === undefined && new Date(year, 0, 1) > this.props.maxDate) || 
            (this.props.maxDate === undefined && new Date(year, 11, 31) < this.props.minDate)
        ){ return false }
        else return true;
    }

    checkIfActToday(index) {
        let date = this.state.calendar[index].date;
        if(this.actTodayDate === date.getDate() && this.actTodayMonth === date.getMonth() && this.actTodayYear === date.getFullYear()){
            return true;
        } else return false;
    }

    performMultipleTimes(callback) {
        if(this.intervalVariable > 0) {return;}
        callback();
        this.timeoutVariable = setTimeout (() => {
          this.intervalVariable = setInterval (() => {
            callback();
          }, 100);
        }, 300);
    }

    clearTimeoutAndInterval() {
        clearTimeout(this.timeoutVariable);
        clearInterval(this.intervalVariable);
        this.timeoutVariable = 0;
        this.intervalVariable = 0;
    }

    setProp = (propName, propValue, callback) => {
        let newState = this.state;
        newState[propName] = propValue;
        if(callback && typeof callback == 'function') { this.setState({newState}, callback) }
        else this.setState({newState})
    }

    render() {
        const calendar = this.state.calendar;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return (
            <div ref={el => this.datePickerRef = el} className='date-picker position-wrapper'>
                <div 
                    className='drop-down-header'
                    ref={el => this.dropDownHeaderRef = el}
                    tabIndex={0}
                    onClick={() => this.toggle()}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                    style={this.state.isOpen ? {"border":"1px solid #0099cc"} : {}}
                >
                    <input 
                        readOnly 
                        tabIndex='-1'
                        placeholder='12/31/9999' 
                        value={(this.props.value === null || this.props.value === undefined) ? "" : (("0"+(this.props.value.getMonth()+1)).slice(-2)+"/"+("0" + this.props.value.getDate()).slice(-2)+"/"+this.props.value.getFullYear())}
                    />
                    {!(this.state.isOpen || this.props.noClearButton || this.props.value === null || this.props.value === undefined)
                    ?
                    <button 
                        className='arrow-button'
                        onClick={(e) => {
                            this.setState({isOpen: false}); 
                            e.stopPropagation();
                            this.props.onSelect(null);
                        }}
                        onKeyDown={(e) => {
                            if(e.keyCode === 13){
                                e.stopPropagation();
                                this.setState({isOpen: false});
                                this.props.onSelect(null);
                                this.dropDownHeaderRef.focus();
                            }}}
                    > <CloseUpSVG /> </button>
                    :
                    <button 
                        disabled 
                        className={'arrow-button onFocusWithDDH'}
                    >
                        <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                    }
                </div>
                {this.state.isOpen &&
                    <DatePickerDropDown 
                        value={this.props.value}
                        dropDownHeaderRef={this.dropDownHeaderRef}
                        datePickerRef={this.datePickerRef}
                        performMultipleTimes={(callback) => this.performMultipleTimes(callback)}
                        clearTimeoutAndInterval={this.clearTimeoutAndInterval}
                        toggleCalendar={this.toggleCalendar}
                        toggle={this.toggle}
                        onArrowClick={this.onArrowClick}
                        calendarKeyDownHandler={this.calendarKeyDownHandler}
                        onSelect={this.onSelect}
                        createCalendar={this.createCalendar}
                        monthPickerKeyDownHandler={this.monthPickerKeyDownHandler}
                        todayYear={this.todayYear}
                        todayMonth={this.todayMonth}
                        setProp={this.setProp}
                        todayButtonRef={el => this.todayButtonRef = el}
                        regularCalendar={this.state.regularCalendar}
                        currentMonth={this.state.currentMonth}
                        currentYear={this.state.currentYear}
                        monthNames={monthNames}
                        calendar={calendar}
                        setFocusTo={this.state.setFocusTo}
                        checkIfDisabled={this.checkIfDisabled}
                        checkIfActToday={this.checkIfActToday}
                        setSetTodayButtonRef={el => this.setTodayButtonRef = el}
                        actTodayYear={this.actTodayYear}
                        actTodayMonth={this.actTodayMonth}
                        checkIfMonthIsWalkable={this.checkIfMonthIsWalkable}
                        checkIfYearIsWalkable={this.checkIfYearIsWalkable}
                        decButtonDisabled={this.state.decButtonDisabled}
                        incButtonDisabled={this.state.incButtonDisabled}
                    />
                }
            </div>
        );
    }
}

export default DatePicker;