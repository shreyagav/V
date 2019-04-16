import React, { Component } from 'react';
import './Calendar.css'
import { withStore } from './store';
import DropDown from './DropDown'
import DatePicker from './DatePicker';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import TimePicker from './TimePicker';

class EventsSideBar extends Component {
    static displayName = EventsSideBar.name;
    
    constructor(props) {
        super(props);
        this.state = {};
        this.simpleBarWrapperRef = null;
    }

    
    componentWillUpdate(){
        this.setHeight();
    }

    componentDidMount(){
        this.setHeight();
    }

    setHeight(){
        if(this.simpleBarWrapperRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
            this.simpleBarHeight = Math.floor(windowHeight - top);
            this.style = {"height":this.simpleBarHeight};
        }
    }

    render() {
        return (
            <div className = 'mt-1 pl-1 pr-1' ref={el => this.simpleBarWrapperRef=el} style={{"position":"relative"}}>
            <div style={this.style}>
            <SimpleBar>
            <div className = 'filters'>
                <p>Event Title:</p>
                <input type='text' placeholder=''></input>
                <p>Date:</p>
                <DatePicker
                    ref={el => this.dateDropDownRef = el}
                />
                <p>Start Time:</p>
                <TimePicker 
                    ref={el => this.timeFromDropDownRef = el}
                    timePickerMode={true}
                />
                <p>End Time:</p>
                <TimePicker 
                    ref={el => this.timeToDropDownRef = el}
                    timePickerMode={true}
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
            </SimpleBar>
            </div>
            </div>
        );
    }
}

export default withStore(EventsSideBar);