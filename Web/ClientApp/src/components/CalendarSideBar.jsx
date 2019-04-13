import React, { Component } from 'react';
import DropDownList from './DropDownList';
import './Calendar.css'
import { withDropDownStore } from './DropDownStore';

class CalendarSidebar extends Component {
    static displayName = CalendarSidebar.name;
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
        <div>
            <div style={{"paddingRight": '0.9rem', "paddingLeft": '0.9rem'}}>
                <button className='big-blue-button mt-1'>National Event Calendar</button>
                <h4>Event calendar By Regions and chapters:</h4>
            </div>
            <DropDownList list={this.props.chapterList} />
        </div>
        );
    }
}

export default withDropDownStore(CalendarSidebar);