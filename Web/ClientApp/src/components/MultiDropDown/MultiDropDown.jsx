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
                {!this.props.hideHeader && 
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
                        //onDropDownValueChange = {value => this.setState({stateFilter: value})}
                        onDropDownValueChange={this.props.onDropDownValueChange}
                        onKeyDown={this.props.onKeyDown}
                        placeholder={this.props.placeholder}
                        showParameter={this.props.showParameter}
                        toggleable = {this.props.toggleable !== undefined ? this.props.toggleable : (this.props.hideList ? !this.props.hideList : true)}
                    />
                }
                {!this.props.hideList &&
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
                        onKeyDown={this.props.onKeyDown}
                        onDropDownValueChange={(value) => {this.props.onDropDownValueChange(value)}}
                        toggleable = {this.props.toggleable !== undefined ? this.props.toggleable : (this.props.hideHeader ? !this.props.hideHeader : true)}
                        flexibleParent = {this.props.flexibleParent}
                        passFocusForward = {(e) => this.props.passFocusForward(e)}
                        textPropertyRender = {this.props.textPropertyRender}
                    />
                }
            </div>
        )
    }
}
export default createMultiDropDownStore(MultiDropDown);