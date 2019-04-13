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
            <ul>
                <li>filter 1</li>
                <li>filter 1</li>
                <li>filter 1</li>
                <li>filter 1</li>
            </ul>
        </div>
        );
    }
}

export default withDropDownStore(CalendarSidebar);