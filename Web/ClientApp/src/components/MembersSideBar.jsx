import React, { Component } from 'react';
import './Calendar.css'
import { withStore } from './store';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import DatePicker from './DatePicker';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import SearchUpSVG from '../svg/SearchUpSVG';
import VolunteerUpSVG from '../svg/VolunteerUpSVG';
import VeteranUpSVG from '../svg/VeteranUpSVG';

class EventsSideBar extends Component {
    static displayName = EventsSideBar.name;
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dateFrom: null,
            dateTo: null,
            role: '',
            zip: '',
        };
        this.simpleBarWrapperRef = null;
        this.dateStartDropDownRef = null;
        this.dateEndDropDownRef = null;
        this.roleDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){
        document.addEventListener("mousedown", this.handleClick, false);
        this.setFilters();
    }

    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    setFilters() {
        let filters = this.props.filters;
        let initialName = '';
        let initialRole = 0;
        let initialDateFrom = null;
        let initialDateTo = null;
        let initialZip = '';
        filters.splice(0, filters.length);
        filters.push({name: "name", value: initialName});
        filters.push({name: "role", value: initialRole});
        filters.push({name: "dateFrom", value: initialDateFrom});
        filters.push({name: "dateTo", value: initialDateTo});
        filters.push({name: "zip", value: initialZip});

        let initialState = {
            name: initialName, 
            role: initialRole,
            dateFrom: initialDateFrom, 
            dateTo: initialDateTo,
            zip: initialZip
        };
        this.setState(initialState);
        this.props.updateFilters(filters);
    }

    updateFilter(filterName, value) {
        console.log(filterName, value);
        let filters = this.props.filters;
        let element = filters.find(element => element.name === filterName); 
        element.value = value;
        this.props.updateFilters(filters);
    }

    handleClick(e) {
        if(this.roleDropDownRef.state.isOpen && !this.roleDropDownRef.dropDownRef.contains(e.target)) {
            this.roleDropDownRef.toggle();
        }
        if(this.dateStartDropDownRef.state.isOpen && !this.dateStartDropDownRef.datePickerRef.contains(e.target)){
            this.dateStartDropDownRef.toggle();
        }
        if(this.dateEndDropDownRef.state.isOpen && !this.dateEndDropDownRef.datePickerRef.contains(e.target)){
            this.dateEndDropDownRef.toggle();
        }
    }

    render() {
        return (
            <div style={{"height": "100%"}} data-simplebar >
            <div className = 'mt-1 pl-1 pr-1 filters'>
                <div className='flex-nowrap justify-space-between align-end mb-1'>
                    <h3>Filters</h3>
                    <button 
                        className='round-button medium-round-button grey-outline-button pr-05 pl-05'
                        onClick={() => this.setFilters()} 
                    >Clear all</button>
                </div>

                <p>Name:</p>
                <div className='input-button-wrapper'>
                    <input 
                        placeholder='Name'
                        value={this.state.name}
                        onChange={(e) => this.setState({name: e.target.value})}
                        onKeyDown={(e) => {
                            if(e.keyCode === 13) {this.updateFilter("name", this.state.name)}
                        }}
                    />
                    <button onClick={() => this.updateFilter("name", this.state.name)}>
                        <SearchUpSVG />
                    </button>
                </div>
                
                <p>Type:</p>
                <MultiDropDown
                    ref={el => this.roleDropDownRef = el}
                    list={[{name: 'Paddler', img: <VeteranUpSVG />, id:54},{name: 'Staff', img: <VolunteerUpSVG />, id:53}]} 
                    keyProperty='id'
                    textProperty='name'
                    defaultValue={this.state.role}
                    placeholder='Type'
                    onDropDownValueChange = {value => {
                        this.setState({role: value});
                        this.updateFilter("role", value);
                    }}
                />

                <p>DOB From:</p>
                <DatePicker 
                    value={this.state.dateFrom}
                    maxDate={this.state.dateTo}
                    ref={el => this.dateStartDropDownRef = el}
                    onSelect={value => {
                        this.setState({dateFrom: value});
                        this.updateFilter("dateFrom", value);
                    }}
                />

                <p>DOB To:</p>
                <DatePicker 
                    value={this.state.dateTo}
                    minDate={this.state.dateFrom}
                    ref={el => this.dateEndDropDownRef = el}
                    onSelect={value => {
                        this.setState({dateTo: value});
                        this.updateFilter("dateTo", value);
                    }}
                />

                <p>Zip:</p>
                <div className='input-button-wrapper'>
                    <input 
                        placeholder='Zip'
                        value={this.state.zip}
                        onChange={(e) => this.setState({zip: e.target.value})}
                        onKeyDown={(e) => {
                            if(e.keyCode === 13) {this.updateFilter("zip", this.state.zip)}
                        }}
                    />
                    <button onClick={() => this.updateFilter("zip", this.state.zip)}>
                        <SearchUpSVG />
                    </button>
                </div>
            </div>
            </div>
        );
    }
}

export default withStore(EventsSideBar);