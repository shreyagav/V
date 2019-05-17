import React, { Component } from 'react';
import MultiDropDownList from './MultiDropDown/MultiDropDownList';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import './Calendar.css'
import { withMultiDropDownStore } from './MultiDropDown/MultiDropDownStore';

class CalendarSidebar extends Component {
    static displayName = CalendarSidebar.name;
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
        <div style={{"position": "relative", "height": "100%"}}>
            <div style={{"paddingRight": '0.9rem', "paddingLeft": '0.9rem'}}>
                <button className='big-blue-button mt-1' onClick = {this.props.clearChapterFilter} >National Event Calendar</button>
                <h4>Event calendar By Regions and chapters:</h4>
            </div>
            <MultiDropDown 
                list={this.props.store.chapterList}
                multiSelect={true}
                keyProperty='id'
                textProperty='state'
                expandBy='chapters'
                expandedTextProperty='name'
                expandedKeyProperty='id'
                expandedMultiSelect={true}
                defaultValue={this.props.chapterFilter}
                placeholder='National'
                onDropDownValueChange = {this.props.onSideBarDropDownValueChange}
                hideHeader = {true}
                hideList = {false}
            />
            {/*<MultiDropDownList list={this.props.chapterList} />*/}
        </div>
        );
    }
}

export default withMultiDropDownStore(CalendarSidebar);