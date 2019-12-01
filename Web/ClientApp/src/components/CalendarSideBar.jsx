import React, { Component } from 'react';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import './Calendar.css'

class CalendarSidebar extends Component {
    static displayName = CalendarSidebar.name;
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
        <div style={{"position": "relative", "height": "100%"}}>
            <div className='flex-nowrap justify-space-between align-center pl-05 pr-1 mb-1' style={{'marginTop':'0.75rem'}}>
                <h3>Filter</h3>
                {this.props.chapterFilter.length > 0 && 
                    <button 
                        ref={el => this.nationalEventButton = el}
                        className='round-button medium-round-button grey-outline-button pr-05 pl-05'
                        onClick = {this.props.clearChapterFilter}
                    >Clear filters</button>
                }
            </div>
            <MultiDropDown 
                list={this.props.store.chapterList.filter(a=>!a.deleted)}
                toggleable = {false}
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
        </div>
        );
    }
}

export default CalendarSidebar;