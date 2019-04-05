import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import DropDownList from './DropDownList';
import { createDropDownStore } from './DropDownStore';
import './DropDown.css'
import DropDownHeader from './DropDownHeader';

class DropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.dropDownRef = null;
    }

    render() {
        return (
            <div className='drop-down' ref={el => this.dropDownRef = el}>
                <DropDownHeader 
                    toggleable = {true}
                    onKeyDown={this.props.onKeyDown}
                    defaultValue={this.props.defaultValue}
                />
                <DropDownList
                    ref={el => this.dropDownListRef = el}
                    toggleable = {true}
                    onKeyDown={this.props.onKeyDown}
                    list={this.props.list}
                />
            </div>
        )
    }
}
export default createDropDownStore(DropDown);