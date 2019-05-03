import React, { Component } from 'react';
import MultiDropDownList from './MultiDropDown/MultiDropDownList';
import './Calendar.css'
import { createMultiDropDownStore } from './MultiDropDown/MultiDropDownStore';

class CalendarSidebar extends Component {
    static displayName = CalendarSidebar.name;
    
    constructor(props) {
        super(props);
        //this.state = {};
    }
    onDropDownValueChange(value) {
        console.log(value)
    }
    render() {
        console.log(this.state);
        console.log(this.props);
        return (
        <div>
            <div style={{"paddingRight": '0.9rem', "paddingLeft": '0.9rem'}}>
                <button className='big-blue-button mt-1'>National Event Calendar</button>
                <h4>Event calendar By Regions and chapters:</h4>
            </div>
                <MultiDropDownList list={this.props.store.chapterList}
                    multiSelect={true}
                    keyProperty="id"
                    textProperty="state"
                    expandBy="chapters"
                    expandedMultiSelect={true}
                    expandedTextProperty="name"
                    expandedKeyProperty="id"
                    defaultValue={[]}
                    toggleable={false}
                    onDropDownValueChange={this.onDropDownValueChange}/>
        </div>
        );
    }
}

export default createMultiDropDownStore(CalendarSidebar);