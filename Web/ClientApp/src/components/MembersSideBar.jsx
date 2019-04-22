import React, { Component } from 'react';
import './Calendar.css'
import { withStore } from './store';
import DropDown from './DropDown'
import DatePicker from './DatePicker';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import SearchUpSVG from '../svg/SearchUpSVG';

class EventsSideBar extends Component {
    static displayName = EventsSideBar.name;
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dateStart: '',
            dateEnd: '',
            role: '',
            zip: '',
        };
        this.simpleBarWrapperRef = null;
        this.dateStartDropDownRef = null;
        this.dateEndDropDownRef = null;
        this.roleDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    handleClick(e) {
        if(this.roleDropDownRef.state.isOpen && !this.roleDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
            this.roleDropDownRef.state.toggle();
        }
        if(this.dateStartDropDownRef.state.isOpen && !this.dateStartDropDownRef.datePickerRef.contains(e.target)){
            this.dateStartDropDownRef.toggle();
        }
        if(this.dateEndDropDownRef.state.isOpen && !this.dateEndDropDownRef.datePickerRef.contains(e.target)){
            this.dateEndDropDownRef.toggle();
        }
    }

    onNameChange(value) {this.setState({name: value});}

    keyDownOnNameInputHandler(e){
        if(e.keyCode === 13) {
            // ENTER WAS PRESSED
            this.searchByName();
        }
    }

    searchByName() {alert(this.state.name);}

    onZipChange(value) {this.setState({zip: value});}

    keyDownOnZipInputHandler(e){
        if(e.keyCode === 13) {
            // ENTER WAS PRESSED
            this.searchByZip();
        }
    }

    searchByZip() {alert(this.state.zip);}

    render() {
        return (
            <div style={{"height": "100%"}} data-simplebar >
            <div className = 'mt-1 pl-1 pr-1 filters'>
                <p>Name:</p>
                <div className='input-button-wrapper'>
                    <input 
                        placeholder='Name'
                        value={this.state.title}
                        onChange={(e) => this.onNameChange(e.target.value)}
                        onKeyDown={(e) => this.keyDownOnNameInputHandler(e)}
                    />
                    <button onClick={() => this.searchByName()}>
                        <SearchUpSVG />
                    </button>
                </div>
                <p>Role:</p>
                <DropDown
                    ref={el => this.roleDropDownRef = el}
                    list={[{name: 'Veteran'},{name: 'Volunteer'}]} 
                    defaultValue={{name: 'Veteran'}}
                />
                <p>DOB From:</p>
                <DatePicker
                    ref={el => this.dateStartDropDownRef = el}
                />
                <p>DOB To:</p>
                <DatePicker
                    ref={el => this.dateEndDropDownRef = el}
                />
                <p>Zip:</p>
                <div className='input-button-wrapper'>
                    <input 
                        placeholder='Zip'
                        value={this.state.zip}
                        onChange={(e) => this.onZipChange(e.target.value)}
                        onKeyDown={(e) => this.keyDownOnZipInputHandler(e)}
                    />
                    <button onClick={() => this.searchByZip()}>
                        <SearchUpSVG />
                    </button>
                </div>
            </div>
            </div>
        );
    }
}

export default withStore(EventsSideBar);