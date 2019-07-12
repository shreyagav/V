import React, { Component } from 'react';
import './Calendar.css'
import { withStore } from './store';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import SearchUpSVG from '../svg/SearchUpSVG';

class EventsSideBar extends Component {
    static displayName = EventsSideBar.name;
    
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            dateFrom: null,
            dateTo: null,
            timeFrom: {},
            timeTo: {},
            typeOfEvent: -1,
            status: '',
            color: '',
        };
        this.simpleBarWrapperRef = null;
        this.dateStartDropDownRef = null;
        this.dateEndDropDownRef = null;
        this.timeFromDropDownRef = null;
        this.timeToDropDownRef = null;
        this.typeOfEventDropDownRef = null;
        this.statusDropDownRef = null;
        this.colorDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){
        document.addEventListener("mousedown", this.handleClick, false);
        document.addEventListener('wheel', this.handleWheel, {passive : false});
        this.setFilters();
    }
    componentWillUnmount(){
        document.removeEventListener("mousedown", this.handleClick, false);
        document.removeEventListener('wheel', this.handleWheel, {passive : false});
    }

    handleWheel = (e) => {
        if (this.simpleBarRef === null || !(this.simpleBarRef.contains(e.target))) {return;}
        var cancelScrollEvent = function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            e.returnValue = false;
            return false;
        };
        var elem = this.simpleBarRef;
        var wheelDelta = e.deltaY;
        var height = elem.clientHeight;
        var scrollHeight = elem.scrollHeight;
        var parent = elem.parentElement;
        var parentTop = parent.getBoundingClientRect().top;
        var top = elem.getBoundingClientRect().top;
        var scrollTop = parentTop - top;
        var isDeltaPositive = wheelDelta > 0;
        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            parent.scrollTop = scrollHeight;
            return cancelScrollEvent(e);
        }
        else {
            if (!isDeltaPositive && -wheelDelta > scrollTop) {
                parent.scrollTop = 0;
                return cancelScrollEvent(e);
            }
        }
    }

    setFilters() {
        let filters = this.props.filters;
        let datefrom = new Date();
        datefrom.setDate(1);
        let dateto = new Date();
        dateto.setMonth(dateto.getMonth() + 1);
        dateto.setDate(1);
        let initialTitle = '';
        let initialDateFrom = datefrom;
        let initialDateTo = dateto;
        let initialTimeFrom = {activated: false, hours: 8, minutes: 0, am: true};
        let initialTimeTo = {activated: false, hours: 8, minutes: 0, am: true};
        let initialTypeOfEvent = '';
        let initialStatus = '';
        let initialColor = '';
        filters.splice(0, filters.length);
        filters.push({name: "title", value: initialTitle});
        filters.push({name: "dateFrom", value: initialDateFrom});
        filters.push({name: "dateTo", value: initialDateTo});
        filters.push({name: "timeFrom", value: initialTimeFrom});
        filters.push({name: "timeTo", value: initialTimeTo});
        filters.push({name: "typeOfEvent", value: initialTypeOfEvent});
        filters.push({name: "status", value: initialStatus});
        filters.push({ name: "color", value: initialColor });
        filters.push({ name: "chapters", value: [] });

        let initialState = {
            title: initialTitle, 
            dateFrom: initialDateFrom, 
            dateTo: initialDateTo, 
            timeFrom: initialTimeFrom, 
            timeTo: initialTimeTo,
            typeOfEvent: initialTypeOfEvent,
            status: initialStatus,
            color: initialColor
        };
        this.setState(initialState);
        this.props.updateFilters(filters);
    }

    handleClick(e) {
        if(this.colorDropDownRef.state.isOpen && !this.colorDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
            this.colorDropDownRef.state.toggle();
        }
        if(this.statusDropDownRef.state.isOpen && !this.statusDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
            this.statusDropDownRef.state.toggle();
        }
        if(this.typeOfEventDropDownRef.state.isOpen && !this.typeOfEventDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
            this.typeOfEventDropDownRef.state.toggle();
        }
        if(this.timeFromDropDownRef.state.isOpen && !this.timeFromDropDownRef.timeNumberPickerRef.contains(e.target)){
            this.timeFromDropDownRef.toggle();
        }
        if(this.timeToDropDownRef.state.isOpen && !this.timeToDropDownRef.timeNumberPickerRef.contains(e.target)){
            this.timeToDropDownRef.toggle();
        }
        if(this.dateStartDropDownRef.state.isOpen && !this.dateStartDropDownRef.datePickerRef.contains(e.target)){
            this.dateStartDropDownRef.toggle();
        }
        if(this.dateEndDropDownRef.state.isOpen && !this.dateEndDropDownRef.datePickerRef.contains(e.target)){
            this.dateEndDropDownRef.toggle();
        }
    }

    updateFilter(filterName, value){
        let filters = this.props.filters;
        let element = filters.find(element => element.name === filterName); 
        element.value = value;
        this.props.updateFilters(filters);
    }

    render() {
        return (
            <div style={{"height": "100%"}} data-simplebar >
                <div ref={el => this.simpleBarRef = el} className = 'mt-1 pl-1 pr-1 filters'>
                    <div className='flex-nowrap justify-space-between align-end mb-1'>
                        <h3>Filters</h3>
                        <button 
                            className='round-button medium-round-button grey-outline-button pr-05 pl-05'
                            onClick={() => this.setFilters()} 
                        >Clear all</button>
                    </div>
                    <p>Event Title:</p>
                    <div className='input-button-wrapper'>
                        <input 
                            placeholder='Event Title'
                            value={this.state.title}
                            onChange={(e) => this.setState({title: e.target.value})}
                            onKeyDown={(e) => {
                                if(e.keyCode === 13) {this.updateFilter("title", this.state.title)}
                            }}
                        />
                        <button onClick={() => this.updateFilter("title", this.state.title)}>
                            <SearchUpSVG />
                        </button>
                    </div>

                    <p>From:</p>
                    <DatePicker 
                        value={this.state.dateFrom}
                        maxDate={this.state.dateTo}
                        ref={el => this.dateStartDropDownRef = el}
                        onSelect={value => {
                            this.setState({dateFrom: value});
                            this.updateFilter("dateFrom", value);
                        }}
                    />

                    <p>To:</p>
                    <DatePicker 
                        value={this.state.dateTo}
                        minDate={this.state.dateFrom}
                        ref={el => this.dateEndDropDownRef = el}
                        onSelect={value => {
                            this.setState({dateTo: value});
                            this.updateFilter("dateTo", value);
                        }}
                    />

                    <p>Start Time:</p>
                    <TimePicker 
                        ref={el => this.timeFromDropDownRef = el}
                        timePickerMode={true} 
                        value={this.state.timeFrom}
                        onChange = {value => {
                            this.setState({timeFrom: value});
                            this.updateFilter("timeFrom", value);
                        }}
                    />
                    <p>End Time:</p>
                    <TimePicker 
                        ref={el => this.timeToDropDownRef = el}
                        timePickerMode={true} 
                        value={this.state.timeTo}
                        onChange = {value => {
                            this.setState({timeTo: value});
                            this.updateFilter("timeTo", value);
                        }}
                    />

                    <p>Type of event:</p>
                    <MultiDropDown
                        ref={el => this.typeOfEventDropDownRef = el}
                        list={[{name: 'Pool Session', typeID: 0}, {name: 'Flat or White Water Session', typeID: 1}, {name: 'National Event', typeID: 2}, {name: 'Regional Event', typeID: 3}, {name: 'Chapter Planning Party', typeID: 4}]}
                        keyProperty='typeID'
                        textProperty='name'
                        defaultValue={this.state.typeOfEvent}
                        placeholder='Type of Event'
                        onDropDownValueChange = {value => {
                            this.setState({typeOfEvent: value});
                            this.updateFilter("typeOfEvent", value);
                        }}
                    />

                    <p>Status:</p>
                    <MultiDropDown
                        ref={el => this.statusDropDownRef = el}
                        list={[{name: 'Draft'}, {name: 'Published'}, {name: 'Closed'}, {name: 'Deleted'}, {name: 'Canceled'}]} 
                        keyProperty='name'
                        textProperty='name'
                        defaultValue={this.state.status}
                        placeholder='Status'
                        onDropDownValueChange = {value => {
                            this.setState({status: value});
                            this.updateFilter("status", value);
                        }}
                    />

                    <p>Color:</p>
                    <MultiDropDown
                        ref={el => this.colorDropDownRef = el}
                        list={this.props.store.colorList} 
                        keyProperty='color'
                        textProperty='name'
                        defaultValue={this.state.color}
                        placeholder='Color'
                        onDropDownValueChange = {value => {
                            this.setState({color: value});
                            this.updateFilter("color", value);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withStore(EventsSideBar);