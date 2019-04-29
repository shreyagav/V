import React, { Component } from 'react';
import MultiDropDownList from './MultiDropDownList';
import { createMultiDropDownStore } from './MultiDropDownStore';
import './MultiDropDown.css'
import MultiDropDownHeader from './MultiDropDownHeader';

class MultiDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.dropDownRef = null;
    }

    render() {
        return (
            <div className='drop-down' ref={el => this.dropDownRef = el}>
                <MultiDropDownHeader 
                    list={this.props.list}
                    multiSelect={this.props.multiSelect}
                    keyProperty={this.props.keyProperty}
                    textProperty={this.props.textProperty}
                    expandBy={this.props.expandBy}
                    expandedMultiSelect={this.props.expandedMultiSelect}
                    expandedTextProperty={this.props.expandedTextProperty}
                    expandedKeyProperty={this.props.expandedKeyProperty}
                    defaultValue={this.props.defaultValue}
                    onDropDownValueChange = {value => this.setState({stateFilter: value})}
                    toggleable = {true}
                    onKeyDown={this.props.onKeyDown}
                    placeholder={this.props.placeholder}
                    showParameter={this.props.showParameter}
                />
                <MultiDropDownList
                    ref={el => this.dropDownListRef = el}
                    list={this.props.list}
                    multiSelect={this.props.multiSelect}
                    keyProperty={this.props.keyProperty}
                    textProperty={this.props.textProperty}
                    expandBy={this.props.expandBy}
                    expandedMultiSelect={this.props.expandedMultiSelect}
                    expandedTextProperty={this.props.expandedTextProperty}
                    expandedKeyProperty={this.props.expandedKeyProperty}
                    defaultValue={this.props.defaultValue}
                    toggleable = {true}
                    onKeyDown={this.props.onKeyDown}
                    onDropDownValueChange={this.props.onDropDownValueChange}
                />
            </div>
        )
    }
}
export default createMultiDropDownStore(MultiDropDown);