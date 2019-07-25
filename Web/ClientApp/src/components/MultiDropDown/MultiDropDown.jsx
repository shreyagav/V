import React, { Component } from 'react';
import './MultiDropDown.css'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { combineReducers } from 'redux';
import CloseSVG from '../../svg/CloseSVG';
import ArrowUpSVG from '../../svg/ArrowUpSVG';
import MultiDropDownList from './MultiDropDownList';

class MultiDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.simpleBarWrapperRef = null; //?
        this.dropDownHeaderRef = null;
        this.dropDownRef = null;
        this.toggleable = true;
    }

    componentWillMount() {
        // check if toggleable
        if (this.props.hideHeader || this.props.hideList) { this.toggleable = false }
        else {
            if (this.props.toggleable) { this.toggleable = this.props.toggleable }
            else this.toggleable = true;
        }
    }

    /*
    headerClickHandler(e) {
        debugger
        if (e.target === this.headerRef && !this.props.disabled) {
            this.toggle();
        }
    } */

    headerKeyDownHandler(e, element){
        switch (e.keyCode){
            case 13: //enter
                if(e.target.className === 'unselectButton'){this.unselect(e, element);}
                if(e.target.className === 'drop-down-header'){this.toggle();}
                this.dropDownHeaderRef.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.toggle();
                    this.dropDownHeaderRef.focus();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.toggle();}
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.toggle();}
                break;
            default: break;
        }
    }

    createList() {
        let headerList = [];
        if (!this.props.expandBy) { 
            if(this.props.multiSelect){ // one level multiselect
                this.props.defaultValue.forEach(value => {
                    headerList.push({"parentElement": this.props.list.find(el => value === el[this.props.textProperty])});
                })
            }
            else { // one level 1 value
                let tempElement = this.props.list.find(element => this.props.defaultValue === element[this.props.keyProperty]);
                if (tempElement){
                    headerList.push({"parentElement": tempElement});
                }
            }
        }
        else { // two levels multiselect
            if(this.props.expandedMultiSelect && this.props.defaultValue.length > 0){
                this.props.list.forEach(element => {
                    let thereAreSomeChecked = false;
                    let theyAllAreChecked = true;
                    let tempHeaderList = [];
                    element[this.props.expandBy].forEach( innerElement => {
                        let checked = this.props.defaultValue.indexOf(innerElement[this.props.expandedKeyProperty]);
                        if ( checked < 0) { theyAllAreChecked = false; }
                        else { 
                            tempHeaderList.push({
                                "childElement": innerElement,
                                "parentElement": element
                            });
                            thereAreSomeChecked = true; 
                        }
                    })
                    if (theyAllAreChecked) {
                        headerList.push({
                            "parentElement": element
                        });
                    }
                    else {
                        if (thereAreSomeChecked) {
                            headerList = headerList.concat(tempHeaderList);
                        }
                    }
                })
            }
            else { // two level one value
                let parentElement;
                let childElement;
                let findChild = (list) => {
                    childElement = list[this.props.expandBy].find(element => element[this.props.expandedKeyProperty] === this.props.defaultValue);
                    if(childElement !== undefined){ return true }
                    return false;
                }
                parentElement = this.props.list.find(listElement => findChild(listElement));
                if (parentElement && childElement){
                    headerList.push({
                        "childElement": childElement,
                        "parentElement": parentElement
                    });
                }
            }
        }
        return headerList;
    }

    unselect = (e, element) => {
        let index = this.props.list.indexOf(element.parentElement);
        let innerIndex = -1;
        if(element.childElement){innerIndex = element.parentElement[this.props.expandBy].indexOf(element.childElement)}
        this.checkBoxChange(index, innerIndex);
        e.stopPropagation();
    }

    checkBoxChange = (index, innerIndex) => {
        let value = this.props.defaultValue;
        let element = this.props.list[index];
        if (this.props.multiSelect /*&& innerIndex < 0 */) {
            if (this.props.expandedMultiSelect){
                if (innerIndex < 0) { // 1st level check box was checked
                    let allAreSelected = true;
                    let someAreSelected = false;
                    element[this.props.expandBy].forEach(element => {
                        if( this.props.defaultValue.indexOf(element[this.props.expandedKeyProperty]) > -1 ){
                            someAreSelected = true;
                        } else {allAreSelected = false}
                    })
                    if (allAreSelected || someAreSelected) { //delete all inner elements
                        element[this.props.expandBy].forEach(element => value = this.arrayRemove(value, element[this.props.expandedKeyProperty]))
                    }
                    else { //add all inner elements
                        element[this.props.expandBy].forEach(element => value.push(element[this.props.expandedKeyProperty]));
                    }
                } 
                else { // 2nd level check box was checked
                    let innerElement = element[this.props.expandBy][innerIndex];
                    if( this.props.defaultValue.indexOf(innerElement[this.props.expandedKeyProperty]) > -1 ){
                        value = this.arrayRemove(value, innerElement[this.props.expandedKeyProperty]);
                    } else value.push(innerElement[this.props.expandedKeyProperty]);
                }
            }
            else {
                if( this.props.defaultValue.indexOf(element[this.props.keyProperty]) > -1 ){
                    value = this.arrayRemove(value, element[this.props.keyProperty]) 
                }
                else value.push(element[this.props.keyProperty])
            }
        }
        this.props.onDropDownValueChange(value);
    }

    arrayRemove = (arr, value) => {
        return arr.filter(element => {
            return element !== value;
        });
    }

    toggle = () => {
        if(!this.props.disabled){
            if (this.state.isOpen) {
                this.setState(() => ({isOpen: !this.state.isOpen, openStateIndex: []}));
                //this.dropDownHeaderRef.focus();
            }
            else {this.setState(() => ({isOpen: !this.state.isOpen}));}
        }
    }

    render() {
        const setStyle = () => {
            if (this.toggleable === true){
                if(this.state.isOpen){return {"border":"1px solid #0099cc"}}
            }
            else{
                return {
                    "border":"0px solid #0099cc",
                    "margin": "-0.25rem",
                    "paddingTop": "1rem",
                    "paddingBottom": "1rem",
                    "cursor": "auto"
                }
            }
        }
        let style = setStyle();
        const list = this.createList();
        return (
            <div className='drop-down' ref={el => this.dropDownRef = el}>
                {!this.props.hideHeader && 
                    <div
                    ref={el => this.dropDownHeaderRef = el}
                    tabIndex={this.toggleable ? '0':'-1'} 
                    className='drop-down-header'
                    style={style}
                    onClick={() => this.toggle()}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                >
                    <ul 
                        ref={e => this.headerRef = e} 
                        onClick={() => this.toggle()}
                        className={(this.props.multiSelect || this.props.expandedMultiSelect) ? "multi-level-list" : "simple-list"}
                    >
                            {list.length > 0 && list.map((element, index) => {
                                let targetElement;
                                if(element.childElement !== undefined){targetElement = element.childElement}
                                else {targetElement = element.parentElement}
                                return <li key={index}>
                                    {targetElement.color && 
                                        <span 
                                            className='colorIndicator'
                                            style={{"backgroundColor": targetElement.color, "marginRight":"0.5rem"}}>
                                        </span>
                                    }
                                    {targetElement.img && <span className='drop-down-icon'>{targetElement.img}</span>}
                                    <span>{
                                        element.childElement 
                                        ? 
                                        element.childElement[this.props.expandedTextProperty] + ', ' + element.parentElement[this.props.textProperty]
                                        :
                                        element.parentElement[this.props.textProperty]
                                    }</span>
                                    {(this.props.multiSelect || this.props.expandedMultiSelect) &&
                                        <button className='unselectButton'
                                            onClick={(e) => this.unselect(e, element)}
                                            onKeyDown={(e) => this.headerKeyDownHandler(e, element)}
                                        >
                                            <CloseSVG />
                                        </button>
                                    }
                                </li>
                                }
                            )}
                            {list.length === 0 &&
                                <li className={(this.props.multiSelect || this.props.expandedMultiSelect)? 'inverted' :'placeholder'}>
                                    <span>{this.props.placeholder}</span>
                                </li>
                            }
                    </ul>
                    {this.toggleable &&
                        <button disabled className='arrow-button' >
                            <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                        </button>
                    }
                </div>
                }
                <div 
                    ref={el => {
                        this.simpleBarWrapperRef = el;
                        if(!this.state.simpleBarWrapperRef){
                            this.setState({simpleBarWrapperRef:el})
                        }
                    }}
                    style={{"position":"relative"}} 
                    /*tabIndex = {0}*/
                >
                    {this.state.simpleBarWrapperRef && (!this.toggleable || (this.toggleable && this.state.isOpen)) && !this.props.hideList &&
                        <MultiDropDownList
                            //General props
                            list = {this.props.list}
                            toggleable = {this.toggleable}
                            multiSelect={this.props.multiSelect}
                            keyProperty={this.props.keyProperty}
                            textProperty={this.props.textProperty}
                            expandBy={this.props.expandBy}
                            expandedTextProperty={this.props.expandedTextProperty}
                            expandedKeyProperty={this.props.expandedKeyProperty}
                            expandedMultiSelect={this.props.expandedMultiSelect}
                            defaultValue={this.props.defaultValue}
                            placeholder={this.props.placeholder}
                            onDropDownValueChange = {value => this.props.onDropDownValueChange(value)}
                            hideList = {this.props.hideList}
                            substractHeight = {this.props.substractHeight}
                            passFocusForward = {this.props.passFocusForward}
                            textPropertyRender = {this.props.textPropertyRender}
                            // New Props from Drop Down
                            checkBoxChange = {this.checkBoxChange}
                            dropDownHeaderRef = {this.dropDownHeaderRef}
                            simpleBarWrapperRef = {this.simpleBarWrapperRef}
                            toggle = {this.toggle}
                            isOpen = {this.state.isOpen}
                        />
                    }
                </div>
            </div>
        )
    }
}
export default MultiDropDown;