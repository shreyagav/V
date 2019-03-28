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
    }

    componentWillMount(){
        document.addEventListener('wheel', this.handleWheel, false);
        window.addEventListener("resize", () => this.setHeight());
    }

    componentDidMount(){
        this.setHeight();
        this.setFocus();
    }

    componentDidUpdate(){
        this.setHeight();
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
        window.removeEventListener("resize", () => this.setHeight());
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
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let bottom = this.setFocusToRef.getBoundingClientRect().bottom;
            if(bottom > windowHeight){
                this.setFocusToRef.scrollIntoView(false);
            }
            this.setFocusToRef.focus({preventScroll: true});
        }
    }

    setHeight(){
        if(this.simpleBarWrapperRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
            let toBottom = windowHeight - top;
            let regularHeight = 45*this.props.store.modifiedList.length;
            let simpleBarHeight = 0;
            if (this.props.toggleable) {simpleBarHeight = (Math.floor((toBottom - 16)/45))*45-1;}
            else {simpleBarHeight = Math.floor(toBottom);}
            if (simpleBarHeight > regularHeight) {simpleBarHeight = regularHeight;}
            this.simpleBarHeight = simpleBarHeight.toString() + 'px';
        }
    }

    handleWheel = (e) => {
        if (!this.simpleBarRef.contains(e.target)) {return;}
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

    toggler(index) {
        let openStateIndex = this.state.openStateIndex;
        if (openStateIndex['_'+index.toString()] === true){
            delete openStateIndex['_'+index.toString()];
        }
        else { 
            openStateIndex['_'+index.toString()]=true;
            this.lastOpenState = index;
        }
        this.setState(()=>({openStateIndex: openStateIndex}));
    }

    setUpRef(el, index){
        if (this.lastOpenState === index) {this.openStateRef = el;}
    }

    keyDownHandler(e, index, innerIndex){
        debugger
        switch (e.keyCode){
            case 13: //ENTER
                this.toggler(index);
                break;
            case 32: //Space
                this.props.store.onCheckBoxChange(index, innerIndex);
                e.preventDefault();
                break;
            case 27://ESC
                this.setState({setFocusToIndex: 0, setFocusToInnerIndex: 0});
                this.props.store.toggle();
                //this.dropDownHeader.focus();
                break;
            case 38: //Up Arrow
                //debugger
                e.preventDefault();
                if(innerIndex > -1) {
                    // IT IS CHAPTER
                    if(innerIndex > 0) {
                        // NOT FIRST CHAPTER
                        this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: (innerIndex-1)}));
                        return;
                    }
                    else {
                        // FIRST CHAPTER
                        this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                        return;
                    }
                }
                else {
                    // IT IS STATE
                    if(this.state.openStateIndex["_"+(index-1).toString()] === true){
                        //previous state is open
                        this.setState(() => ({setFocusToIndex: (index-1), setFocusToInnerIndex: this.props.store.modifiedList[index-1].chapters.length-1}));
                        return;
                    }
                    else{
                        //previous state is closed
                        this.setState(() => ({setFocusToIndex: (index-1), setFocusToInnerIndex: -1}));
                        return;
                    }
                }
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(this.state.openStateIndex["_"+index.toString()] === true){
                    // STATE OPEN
                    if (innerIndex > -1){ 
                        if (innerIndex < this.props.store.modifiedList[index].chapters.length-1){ 
                            // NOT LAST CHAPTER
                            this.setState({setFocusToInnerIndex: this.state.setFocusToInnerIndex+1});
                        }
                        else {
                            if (index < this.props.store.modifiedList.length-1) {
                                //NOT LAST STATE
                                this.setState({setFocusToIndex: this.state.setFocusToIndex+1});
                            }
                        }
                    }
                    else(this.setState({setFocusToInnerIndex: 0}));
                }
                else {
                    if (index < this.props.store.modifiedList.length-1) {
                        //NOT LAST STATE
                        this.setState({setFocusToIndex: this.state.setFocusToIndex+1});
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
            <div 
                ref={el => this.simpleBarWrapperRef=el} 
                style={this.props.toggleable && this.props.store.isOpen ? {"border":"1px solid #0099cc", "borderTop":"0px solid #666666"} : {}}
            >
            <SimpleBar style={this.props.toggleable && !this.props.store.isOpen ? {"display":"none"} : {'height':this.simpleBarHeight}}>
            <ul className='drop-down-list' ref={el => this.simpleBarRef=el} style={{'height':this.simpleBarHeight}}>
                {this.props.store.modifiedList.map((element, index) =>
                {
                    let isOpen = (this.state.openStateIndex["_"+index.toString()] === true);
                    return(
                    <li 
                        key={index} 
                        className={isOpen ? 'openChapter' : ''} 
                    >
                        <div
                            ref={el => {if(index === this.state.setFocusToIndex){this.setFocusToRef = el}}}
                            tabIndex='0'
                            onKeyDown = {(e) => this.keyDownHandler(e, index, -1)}
                        >
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={element.state.checked} 
                                    onChange={() => this.props.store.onCheckBoxChange(index, -1)} /* */
                                    /* onKeyDown = {(e) => this.keyDownHandler(e, index, -1)}  */
                                />
                                <CheckBoxSVG />
                            </label>
                            <button 
                                onClick={() => this.toggler(index)}
                                /* onKeyDown = {(e) => this.keyDownHandler(e, index, -1)} */
                            >
                                <span>{element.state.name}</span>
                                <ArrowUpSVG svgClassName={isOpen ? 'flip90' : 'flip270'}/>
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
                                            ref={el => {if(innerIndex === this.state.setFocusToInnerIndex){this.setFocusToRef = el}}}
                                            tabIndex='0'
                                            onKeyDown = {(e) => {this.keyDownHandler(e, index, innerIndex);}}
                                        >
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={el.checked} 
                                                onChange={() => this.props.store.onCheckBoxChange(index, innerIndex)}
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
        )
    }
}
export default withDropDownStore(DropDownList);