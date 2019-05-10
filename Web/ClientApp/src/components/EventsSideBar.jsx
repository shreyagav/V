import React, { Component } from 'react';
import './Calendar.css'
import { withStore } from './store';
import DropDown from './DropDown'
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
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
            timeFrom: '',
            timeTo: '',
            typeOfEvent: '',
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
        this.setFilters();
    }
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    setFilters() {
        let filters = [];
        filters.push({name: "title", value: ''});
        filters.push({name: "dateFrom", value: null});
        filters.push({name: "dateTo", value: null});
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

    updateTitle(){
        let filters = this.props.filters;
        let element = filters.find(element => element.name === "title"); 
        element.value = this.state.title;
        this.props.updateFilters(filters);
    }

    render() {
        return (
            <div style={{"height": "100%"}} data-simplebar >
            <div className = 'mt-1 pl-1 pr-1 filters'>
                <p>Event Title:</p>
                <div className='input-button-wrapper'>
                    <input 
                        placeholder='Event Title'
                        value={this.state.title}
                        onChange={(e) => this.setState({title: e.target.value})}
                        onKeyDown={(e) => {
                            if(e.keyCode === 13) {this.updateTitle()}
                        }}
                    />
                    <button onClick={() => this.updateTitle()}>
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
                        let filters = this.props.filters;
                        let element = filters.find(element => element.name === "dateFrom"); 
                        element.value = value;
                        this.props.updateFilters(filters);
                    }}
                />

                <p>To:</p>
                <DatePicker 
                    value={this.state.dateTo}
                    minDate={this.state.dateFrom}
                    ref={el => this.dateEndDropDownRef = el}
                    onSelect={value => {
                        this.setState({dateTo: value});
                        let filters = this.props.filters;
                        let element = filters.find(element => element.name === "dateTo"); 
                        element.value = value;
                        this.props.updateFilters(filters);
                    }}
                />

                <p>Start Time:</p>
                <TimePicker 
                    ref={el => this.timeFromDropDownRef = el}
                    timePickerMode={true} time={{hours:8,minutes:0,am:true}}
                />
                <p>End Time:</p>
                <TimePicker 
                    ref={el => this.timeToDropDownRef = el}
                    timePickerMode={true} time={{hours:8,minutes:0,am:true}}
                />
                <p>Type of event:</p>
                <DropDown
                    ref={el => this.typeOfEventDropDownRef = el}
                    list={[{name: 'Pool Session'}, {name: 'Flat or White Water Session'}, {name: 'National Event'}, {name: 'Regional Event'}, {name: 'Chapter Planning Party'}]} 
                    defaultValue={{name: 'Pool Session'}}
                />
                <p>Status:</p>
                <DropDown
                    ref={el => this.statusDropDownRef = el}
                    list={[{name: 'Draft'}, {name: 'Published'}, {name: 'Closed'}, {name: 'Deleted'}, {name: 'Cancelled'}]} 
                    defaultValue={{name: 'Published'}}
                />
                <p>Color:</p>
                <DropDown
                    ref={el => this.colorDropDownRef = el}
                    list={this.props.store.colorList} 
                    defaultValue={{name: 'Gray', color: '#666666'}}
                />
            </div>
            </div>
        );
    }
}

export default withStore(EventsSideBar);