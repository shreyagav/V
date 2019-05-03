import React, { Component } from 'react';
import CheckBoxSVG from '../../svg/CheckBoxSVG';
import ArrowUpSVG from '../../svg/ArrowUpSVG';
import { withMultiDropDownStore } from './MultiDropDownStore';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { combineReducers } from 'redux';
import CheckBoxSquareSVG from '../../svg/CheckBoxSquareSVG';

class MultiDropDownList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {       };

        this.lastOpenState = null;
        this.simpleBarRef = null;
        this.simpleBarWrapperRef = null;
        this.simpleBarHeight = '100%';
        this.opensDown = true;
        this.openStateRef = null;
        this.setFocusToRef = null;
        this.simpleList = false;

        this.setHeight = this.setHeight.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.className = '';
        this.style = {
            dropDownHeaderHeight: 0,
        };
        this.checkBoxSelected = this.checkBoxSelected.bind(this);
    }

    componentWillMount(){
        document.addEventListener('wheel', this.handleWheel, {passive : false});
        window.addEventListener("resize", this.setHeight);
    }

    componentWillUpdate(){
        this.setHeight();
    }

    componentDidMount(){
        this.setHeight();
        this.setFocus();
    }

    componentDidUpdate(){
        this.setFocus();
        /*scroll last openned object into view */
        if(this.openStateRef !== null){
            var elem = this.openStateRef;
            var elemBottom = elem.getBoundingClientRect().bottom;
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if(elemBottom > windowHeight){
                elem.scrollIntoView(false);
            }
        }
        this.setHeight();
    }

    componentWillUnmount(){
        document.removeEventListener('wheel', this.handleWheel, {passive : false});
        window.removeEventListener("resize", this.setHeight);
    }

    setFocus(){
        if(this.setFocusToRef !== null){
            var list = this.simpleBarRef;
            var parentTop = list.parentElement.getBoundingClientRect().top;
            //var top = list.getBoundingClientRect().top;
            var elem = this.setFocusToRef;
            var elemTop = elem.getBoundingClientRect().top;
            var elemBottom = elem.getBoundingClientRect().bottom;
            var parentBottom = list.parentElement.getBoundingClientRect().bottom;
            if(parentTop > elemTop){
                list.parentElement.scrollTop = list.parentElement.scrollTop - (parentTop - elemTop);
            }
            if(elemBottom > parentBottom){
                list.parentElement.scrollTop = elemBottom - parentBottom + list.parentElement.scrollTop;
            }
            elem.focus({preventScroll: true});
        }
    }

    setHeight(){
        if(this.simpleBarWrapperRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let dropDownHeaderHeight = 0;
            if(this.props.multiDropDownStore.dropDownHeaderRef !== null){
                dropDownHeaderHeight = this.props.multiDropDownStore.dropDownHeaderRef.getBoundingClientRect().height;
                if (dropDownHeaderHeight !== this.state.dropDownHeaderHeight){
                    this.setState({dropDownHeaderHeight: dropDownHeaderHeight});
                }
            }
            let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
            let bottom = top + dropDownHeaderHeight;
            let toTop = top - 56 - dropDownHeaderHeight; /* 56 - NAVBAR HEIGHT */
            let toBottom = windowHeight - bottom + dropDownHeaderHeight;
            let coeff = 0;
            let openStateIndex = Object.keys(this.props.multiDropDownStore.openStateIndex);
            openStateIndex.forEach(element => {  
                let ind = parseInt(element.slice(1));
                coeff = coeff + this.props.multiDropDownStore.modifiedList[ind][this.props.multiDropDownStore.expandBy].length;
            })
            let regularHeight = 45*(this.props.multiDropDownStore.modifiedList.length + coeff);
            let simpleBarHeight = 0;
            if (this.props.toggleable) {
                if (toTop > toBottom){
                    //* OPENS UP *//
                    this.opensDown = false;
                    //simpleBarHeight = Math.floor(toTop);
                    simpleBarHeight = (Math.floor(toTop/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    this.style = {"height":this.simpleBarHeight, "bottom":(dropDownHeaderHeight).toString()+'px', "marginBottom":"-1px", "boxShadow": "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                }
                else {
                    /* OPENS DOWN */
                    this.opensDown = true;
                    //simpleBarHeight = Math.floor(toBottom);
                    simpleBarHeight = (Math.floor(toBottom/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    this.style = {"height":this.simpleBarHeight, "top": "0px", "marginTop":"-1px", "boxShadow": "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                }
                //simpleBarHeight = (Math.floor((toBottom - 16)/45))*45-1;
            }
            else {
                simpleBarHeight = Math.floor(toBottom);
                if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                this.style = {"height":this.simpleBarHeight};
            }
        }
    }

    checkBoxSelected(index, innerIndex) {
        this.props.multiDropDownStore.onCheckBoxChange(index, innerIndex);
        if (this.props.onSelectionChanged) {
            var list = this.props.multiDropDownStore.modifiedList;
            if (list && list.length && list.length > 0) {
                if (this.props.expandBy) {
                    var temp = [];
                    list.forEach(a => {
                           temp = temp.concat(a.chapters.filter(b => b.checked));
                    });
                    this.props.onSelectionChanged(temp);
                } else {
                    this.props.onSelectionChanged(list.filter(a=>a.checked));
                }
            }
        }
    }

    handleWheel = (e) => {
        if (this.simpleBarRef === null || !(this.simpleBarRef.contains(e.target))) {
            if (this.props.multiDropDownStore.isOpen) {
                this.props.multiDropDownStore.toggle();
            }
            return;
        }
        var cancelScrollEvent = function(e){
            //debugger
            e.stopImmediatePropagation();
            e.preventDefault();
            e.returnValue = false;
            return false;
        };
        this.hoverAllowed = true;
        var elem = this.simpleBarRef;
        var wheelDelta = e.deltaY;
        var height = elem.clientHeight;
        var scrollHeight = elem.scrollHeight;
        var parentTop = this.simpleBarRef.parentElement.getBoundingClientRect().top;
        var top = this.simpleBarRef.getBoundingClientRect().top;
        var scrollTop = parentTop - top;
        var isDeltaPositive = wheelDelta > 0;
        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            elem.scrollTop = scrollHeight;
            return cancelScrollEvent(e);
        }
        else {
            if (!isDeltaPositive && -wheelDelta > scrollTop) {
                elem.scrollTop = 0;
                return cancelScrollEvent(e);
            }
        }
    }

    setUpRef(el, index){
        if (this.lastOpenState === index) {this.openStateRef = el;}
    }

    keyDownHandler(e, index, innerIndex, element){
        switch (e.keyCode){
            case 13: //ENTER
                if(this.props.expandBy){
                    // 2 layer element
                    if(innerIndex > -1){
                        // 2 layer element has been pressed
                        if(!this.props.multiDropDownStore.expandedMultiselect){
                            this.props.multiDropDownStore.set("value", element[this.props.multiDropDownStore.expandedKeyProperty]);
                            this.props.onDropDownValueChange(element[this.props.multiDropDownStore.expandedKeyProperty]);
                            this.props.multiDropDownStore.toggle();//
                        }
                    }
                    else {
                        // 1st layer element has been pressed
                        this.props.multiDropDownStore.toggler(index);
                    }
                }
                else{
                    this.props.multiDropDownStore.set("value", element[this.props.multiDropDownStore.keyProperty]);
                    this.props.onDropDownValueChange(element[this.props.multiDropDownStore.keyProperty]);
                    this.props.multiDropDownStore.set("setFocusToIndex", 0);
                    this.props.multiDropDownStore.toggle();
                }
                break;
            case 32: //Space
                this.checkBoxSelected(index, innerIndex);
                e.preventDefault();
                break;
            case 27://ESC
                this.props.multiDropDownStore.set("setFocusToIndex", 0);
                this.props.multiDropDownStore.set("setFocusToInnerIndex", -1);
                this.props.multiDropDownStore.set("openStateIndex", []);
                this.props.multiDropDownStore.toggle();
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(innerIndex > -1) {
                    // IT IS CHAPTER
                    if(innerIndex > 0) {
                        // NOT FIRST CHAPTER
                        this.props.multiDropDownStore.set("setFocusToIndex", index);
                        this.props.multiDropDownStore.set("setFocusToInnerIndex", (innerIndex-1));
                    }
                    else {
                        // FIRST CHAPTER
                        this.props.multiDropDownStore.set("setFocusToIndex", index);
                        this.props.multiDropDownStore.set("setFocusToInnerIndex", -1);
                        
                    }
                }
                else {
                    // IT IS STATE
                    if(this.props.multiDropDownStore.openStateIndex["_"+(index-1).toString()] === true){
                        //previous state is open
                        this.props.multiDropDownStore.set("setFocusToIndex", (index-1));
                        this.props.multiDropDownStore.set("setFocusToInnerIndex", this.props.multiDropDownStore.modifiedList[index-1].chapters.length-1);
                    }
                    else{
                        //previous state is closed
                        this.props.multiDropDownStore.set("setFocusToIndex", (index-1));
                        this.props.multiDropDownStore.set("setFocusToInnerIndex", -1);
                    }
                }
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(this.props.multiDropDownStore.openStateIndex["_"+index.toString()] === true){
                    // STATE IS OPEN
                    if (innerIndex > -1){
                        // IT IS CHAPTER
                        if (innerIndex < this.props.multiDropDownStore.modifiedList[index].chapters.length-1){ 
                            // NOT LAST CHAPTER
                            this.props.multiDropDownStore.set("setFocusToIndex", index);
                            this.props.multiDropDownStore.set("setFocusToInnerIndex", innerIndex+1);
                        }
                        else {
                            // LAST CHAPTER
                            if (index < this.props.multiDropDownStore.modifiedList.length-1) {
                                //NOT LAST STATE
                                this.props.multiDropDownStore.set("setFocusToIndex", index+1);
                                this.props.multiDropDownStore.set("setFocusToInnerIndex", -1);
                            }
                        }
                    }
                    else {
                        // IT IS STATE 
                        this.props.multiDropDownStore.set("setFocusToIndex", index);
                        this.props.multiDropDownStore.set("setFocusToInnerIndex", 0);
                    }
                }
                else {
                    // STATE IS CLOSED
                    if (index < this.props.multiDropDownStore.modifiedList.length-1) {
                        //NOT LAST STATE
                        this.props.multiDropDownStore.set("setFocusToIndex", index+1);
                        this.props.multiDropDownStore.set("setFocusToInnerIndex", -1);
                    }
                }
                break;
            case 9: // TAB
                e.preventDefault();
                break;
            default: break;
        }
    }

    render() {
        return (
            <div ref={el => this.simpleBarWrapperRef=el} style={{"position":"relative"}}>
            <div
                className={this.className}
                style={this.props.multiDropDownStore.isOpen || !this.props.toggleable ? this.style : {"display":"none"}}
            >
                <SimpleBar>
                <ul className='drop-down-list' 
                    ref={el => this.simpleBarRef=el} 
                    style={{'height':this.simpleBarHeight}}
                >
                    {this.props.multiDropDownStore.modifiedList.map((element, index) =>
                    {   
                        let isOpen = (this.props.multiDropDownStore.openStateIndex["_"+index.toString()] === true);
                        return(
                        <li key={index} className={isOpen ? 'openChapter' : ''}>
                            <div
                                ref={el => {if(index === this.props.multiDropDownStore.setFocusToIndex){this.setFocusToRef = el}}}
                                tabIndex='0'
                                onKeyDown = {(e) => this.keyDownHandler(e, index, -1, element)}
                            >
                                {this.props.multiSelect &&
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={(element.checked === true || element.checked === 1 || element.checked === 0) ? true : false}
                                            onChange={() => {
                                                this.checkBoxSelected(index, -1); 
                                                this.props.multiDropDownStore.set("setFocusToIndex", index);
                                                this.props.multiDropDownStore.set("setFocusToInnerIndex", -1);
                                            }} 
                                        />
                                        {(element.checked === true || element.checked === 1 || element.checked === -1) ? <CheckBoxSVG /> : <CheckBoxSquareSVG />}
                                    </label>
                                }
                                <button 
                                    onClick={() => {
                                        if (this.props.expandBy) {
                                            this.props.multiDropDownStore.toggler(index, true)
                                        }
                                        else {
                                            this.props.multiDropDownStore.set("value", element[this.props.multiDropDownStore.keyProperty]);
                                            this.props.onDropDownValueChange(element[this.props.multiDropDownStore.keyProperty]);
                                            this.props.multiDropDownStore.toggle();
                                        }
                                    }}
                                >
                                    {element.color !== undefined && <span className='colorIndicator' style={{"backgroundColor":element.color, "marginRight":"0.5rem"}}></span>}
                                    {element.img && <span className='drop-down-icon'>{element.img}</span>}
                                    <span>{element[this.props.textProperty]}</span>
                                    {this.props.expandBy && <ArrowUpSVG svgClassName={isOpen ? 'flip90' : 'flip270'}/>}
                                </button>
                            </div>
                            {isOpen && 
                                <ul className='drop-down-list' ref={(el) => this.setUpRef(el,index)}>
                                    {element[this.props.expandBy].map((el, innerIndex) =>
                                        <li 
                                            key={innerIndex} 
                                            className='openChapter'
                                        >
                                            <div
                                                ref={el => {if(index === this.props.multiDropDownStore.setFocusToIndex && innerIndex === this.props.multiDropDownStore.setFocusToInnerIndex){this.setFocusToRef = el}}}
                                                tabIndex='0'
                                                onKeyDown = {(e) => {this.keyDownHandler(e, index, innerIndex, el);}}
                                            >
                                                {this.props.expandedMultiSelect && 
                                                    <label>
                                                        <input 
                                                            type="checkbox" 
                                                                checked={el.checked}
                                                                onChange={() => { 
                                                                    this.checkBoxSelected(index, innerIndex);
                                                                    this.props.multiDropDownStore.set("setFocusToIndex", index);
                                                                    this.props.multiDropDownStore.set("setFocusToInnerIndex", -1);
                                                                }}
                                                        />
                                                        <CheckBoxSVG />
                                                    </label>
                                                }
                                                <button 
                                                    onClick={() => {
                                                        this.props.multiDropDownStore.set("value", el[this.props.multiDropDownStore.expandedKeyProperty]);
                                                        this.props.onDropDownValueChange(el[this.props.multiDropDownStore.expandedKeyProperty]);
                                                        this.props.multiDropDownStore.toggle();
                                                    }}
                                                >
                                                    {el.color !== undefined && <span className='colorIndicator' style={{"backgroundColor":el.color, "marginRight":"0.5rem"}}></span>}
                                                    {el.img && <span className='drop-down-icon'>{el.img}</span>}
                                                    <span>{el[this.props.expandedTextProperty]}</span>
                                                </button>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            }
                        </li>)}
                    )}
                </ul>
                </SimpleBar>
            </div>
            </div>
        )
    }
}
export default withMultiDropDownStore(MultiDropDownList);