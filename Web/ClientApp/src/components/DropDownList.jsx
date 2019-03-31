import React, { Component } from 'react';
import CheckBoxSVG from '../svg/CheckBoxSVG';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import { withDropDownStore } from './DropDownStore';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class DropDownList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openStateIndex: [],
            setFocusToIndex: 0,
            setFocusToInnerIndex:0,
        };
        this.lastOpenState = null;
        this.simpleBarRef = null;
        this.simpleBarWrapperRef = null;
        this.simpleBarHeight = '100%';
        this.openStateRef = null;
        this.setFocusToRef = null;
        this.simpleList = false;

        this.setHeight = this.setHeight.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.className = '';
        this.style = {};
    }

    componentWillMount(){
        document.addEventListener('wheel', this.handleWheel, false);
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
    }

    componentWillUnmount(){
        document.removeEventListener('wheel', this.handleWheel, false);
        window.removeEventListener("resize", this.setHeight);
    }

    setFocus(){
        if(this.setFocusToRef !== null){
            var list = this.simpleBarRef;
            var parentTop = list.parentElement.getBoundingClientRect().top;
            var top = list.getBoundingClientRect().top;
            var elem = this.setFocusToRef;
            var elemTop = elem.getBoundingClientRect().top;
            if(parentTop>elemTop){
                this.simpleBarRef.parentElement.scrollTop = elemTop - top;
            }
            //let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let bottom = this.setFocusToRef.getBoundingClientRect().bottom;
            let parentBottom = list.parentElement.getBoundingClientRect().bottom;
            if(bottom > parentBottom){
                this.setFocusToRef.scrollIntoView(false);
            }
            this.setFocusToRef.focus({preventScroll: true});
        }
    }

    setHeight(){
        if(this.simpleBarWrapperRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let dropDownHeaderHeight = 0;
            if(this.props.dropDownStore.dropDownHeaderRef !== null){
                dropDownHeaderHeight = this.props.dropDownStore.dropDownHeaderRef.getBoundingClientRect().height;
            }
            let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
            let bottom = top + dropDownHeaderHeight;
            let toTop = top - 56 - dropDownHeaderHeight; /* 56 - NAVBAR HEIGHT */
            let toBottom = windowHeight - bottom + dropDownHeaderHeight;
            let regularHeight = 45*this.props.dropDownStore.modifiedList.length;
            let simpleBarHeight = 0;
            if (this.props.toggleable) {
                if (toTop > toBottom){
                    //* OPENS UP *//
                    //simpleBarHeight = (Math.floor(toTop/45))*45-1;
                    simpleBarHeight = Math.floor(toTop);
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = simpleBarHeight.toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    this.style = {"height":this.simpleBarHeight, "bottom":(dropDownHeaderHeight+1).toString()+'px', "borderBottom":"0px solid #666666"};
                }
                else {
                    /* OPENS DOWN */
                    //simpleBarHeight = (Math.floor(toBottom/45))*45-1;
                    simpleBarHeight = Math.floor(toBottom);
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = simpleBarHeight.toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    this.style = {"height":this.simpleBarHeight, "top": "1px", "borderTop":"0px solid #666666"};
                }
                //simpleBarHeight = (Math.floor((toBottom - 16)/45))*45-1;
            }
            else {
                simpleBarHeight = Math.floor(toBottom);
                if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                this.simpleBarHeight = simpleBarHeight.toString() + 'px';
                this.style = {"height":this.simpleBarHeight};
            }
        }
    }

    handleWheel = (e) => {
        if (!this.simpleBarRef.contains(e.target)) {
            if (this.props.dropDownStore.isOpen) {this.props.dropDownStore.toggle();}
            return;
        }
        var cancelScrollEvent = function(e){
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

    toggler(index, multiLevelList) {
        if(multiLevelList){
            let openStateIndex = this.state.openStateIndex;
            if (openStateIndex['_'+index.toString()] === true){
                delete openStateIndex['_'+index.toString()];
                this.setState(()=>({openStateIndex: openStateIndex, setFocusToInnerIndex: -1}));
            }
            else { 
                openStateIndex['_'+index.toString()]=true;
                this.setState(()=>({openStateIndex: openStateIndex, setFocusToInnerIndex: 0}));
                this.lastOpenState = index;
            }
        }
        this.setState({setFocusToIndex: index, setFocusToInnerIndex: -1});
    }

    setUpRef(el, index){
        if (this.lastOpenState === index) {this.openStateRef = el;}
    }

    keyDownHandler(e, index, innerIndex, multiLevelList, element){
        switch (e.keyCode){
            case 13: //ENTER
                if(multiLevelList){this.toggler(index, multiLevelList);}
                else{
                    this.props.dropDownStore.set("value", element);
                    this.props.dropDownStore.toggle();
                }
                break;
            case 32: //Space
                this.props.dropDownStore.onCheckBoxChange(index, innerIndex);
                e.preventDefault();
                break;
            case 27://ESC
                this.setState({setFocusToIndex: 0, setFocusToInnerIndex: 0});
                this.props.dropDownStore.toggle();
                //this.dropDownHeader.focus();
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(innerIndex > -1) {
                    // IT IS CHAPTER
                    if(innerIndex > 0) {
                        // NOT FIRST CHAPTER
                        this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: (innerIndex-1)}));
                    }
                    else {
                        // FIRST CHAPTER
                        this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                    }
                }
                else {
                    // IT IS STATE
                    if(this.state.openStateIndex["_"+(index-1).toString()] === true){
                        //previous state is open
                        this.setState(() => ({setFocusToIndex: (index-1), setFocusToInnerIndex: this.props.dropDownStore.modifiedList[index-1].chapters.length-1}));
                    }
                    else{
                        //previous state is closed
                        this.setState(() => ({setFocusToIndex: (index-1), setFocusToInnerIndex: -1}));
                    }
                }
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(this.state.openStateIndex["_"+index.toString()] === true){
                    // STATE IS OPEN
                    if (innerIndex > -1){
                        // IT IS CHAPTER
                        if (innerIndex < this.props.dropDownStore.modifiedList[index].chapters.length-1){ 
                            // NOT LAST CHAPTER
                            this.setState({setFocusToIndex: index, setFocusToInnerIndex: innerIndex+1});
                        }
                        else {
                            // LAST CHAPTER
                            if (index < this.props.dropDownStore.modifiedList.length-1) {
                                //NOT LAST STATE
                                this.setState({setFocusToIndex: index+1, setFocusToInnerIndex: -1});
                            }
                        }
                    }
                    else {
                        // IT IS STATE 
                        this.setState({setFocusToIndex: index, setFocusToInnerIndex: 0});
                    }
                }
                else {
                    // STATE IS CLOSED
                    if (index < this.props.dropDownStore.modifiedList.length-1) {
                        //NOT LAST STATE
                        this.setState({setFocusToIndex: index+1, setFocusToInnerIndex: -1});
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
                style={this.props.dropDownStore.isOpen || !this.props.toggleable ? this.style : {"display":"none"}}
            >
                <SimpleBar >
                <ul className='drop-down-list' 
                    ref={el => this.simpleBarRef=el} 
                    style={{'height':this.simpleBarHeight}}
                >
                    {this.props.dropDownStore.modifiedList.map((element, index) =>
                    {   
                        let isOpen = (this.state.openStateIndex["_"+index.toString()] === true);
                        let multiLeveElement = element.hasOwnProperty("state");
                        return(
                        <li 
                            key={index} 
                            className={isOpen ? 'openChapter' : ''} 
                        >
                            <div
                                ref={el => {if(index === this.state.setFocusToIndex){this.setFocusToRef = el}}}
                                tabIndex='0'
                                onKeyDown = {(e) => this.keyDownHandler(e, index, -1, multiLeveElement, element)}
                            >
                                {multiLeveElement &&
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={element.state.checked} 
                                            onChange={() => {this.props.dropDownStore.onCheckBoxChange(index, -1); this.setState({setFocusToIndex: index, setFocusToInnerIndex: -1})}} /* */
                                        />
                                        <CheckBoxSVG />
                                    </label>
                                }
                                <button 
                                    style={multiLeveElement ? {"justifyContent":"space-between"}:{}}
                                    onClick={() => {
                                        if (multiLeveElement) {
                                            this.toggler(index, true)
                                        }
                                        else {
                                            this.props.dropDownStore.set("value", element);
                                            this.props.dropDownStore.toggle();
                                        }
                                    }}
                                >   
                                    {element.color !== undefined && 
                                        <span className='colorIndicator' style={{"backgroundColor":element.color, "marginRight":"0.5rem"}}></span>
                                    }
                                    <span>{multiLeveElement ? element.state.name : element.name}</span>
                                    {multiLeveElement && <ArrowUpSVG svgClassName={isOpen ? 'flip90' : 'flip270'}/>}
                                </button>
                            </div>
                            {isOpen && 
                                <ul className='drop-down-list' ref={(el) => this.setUpRef(el,index)}>
                                    {element.chapters.map((el, innerIndex) =>
                                        <li 
                                            key={el.name} 
                                            className='openChapter'
                                        >
                                            <div
                                                ref={el => {if(index === this.state.setFocusToIndex && innerIndex === this.state.setFocusToInnerIndex){this.setFocusToRef = el}}}
                                                tabIndex='0'
                                                onKeyDown = {(e) => {this.keyDownHandler(e, index, innerIndex, true, element);}}
                                            >
                                            <label>
                                                <input 
                                                    type="checkbox" 
                                                    checked={el.checked} 
                                                    onChange={() => {this.props.dropDownStore.onCheckBoxChange(index, innerIndex); this.setState({setFocusToIndex: index, setFocusToInnerIndex: -1});}}
                                                />
                                                <CheckBoxSVG />
                                            </label>
                                            <span>{el.name}</span>
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
export default withDropDownStore(DropDownList);