import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import './TimePicker.css'
import './MultiDropDown/MultiDropDown.css'
import CloseUpSVG from '../svg/CloseUpSVG';

export class TimePickerDropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
        this.styleBottom = {"position": "absolute", "top": "41px", "left": "0px", "right": "0px", "boxShadow": "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)", "zIndex": "1072", "background": "#ffffff", "border":"1px solid #0099cc"};
        this.styleTop = {"position": "absolute", "top": "-102px", "left": "0px", "right": "0px", "boxShadow": "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)", "zIndex": "1072", "background": "#ffffff", "border":"1px solid #0099cc"};
    }

    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
    }

    componentWillUnmount(){
        document.removeEventListener("mousedown", this.handleClick, false);
    }

    handleClick(e) {
        if(!(this.props.timeNumberPickerRef.contains(e.target))){ this.props.toggle() }
    }

    checkIfOpensBottom(element){
        let windowHeight = window.innerHeight;
        let bottom = element.getBoundingClientRect().top + 103;
        if(bottom > windowHeight){ return false }
        else { return true }
    }

    render() { 
        if (this.props.properties.timePickerMode) {
        return (
            <div className='time-number-picker-drop-down absolute-drop-down' style={this.checkIfOpensBottom(this.props.dropDownWrapperRef) ? this.styleBottom : this.styleTop}>
                <div>
                    <button 
                        tabIndex='-1'
                        className='arrow-button'
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.hoursIncrement())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()}
                    >
                        <ArrowUpSVG svgClassName={'flip90'}/>
                    </button>
                    <span 
                        tabIndex='0' 
                        ref={el => this.props.setHoursRef(el)}
                        onKeyDown={(e) => this.props.handleKeyDown(e, () => this.props.hoursIncrement(), () => this.props.hoursDecrement())}
                        onKeyUp = {() => this.props.clearTimeoutAndInterval()}
                        onClick = {() => this.props.activate()}
                    >
                        {("0" + this.props.properties.value.hours).slice(-2)}
                    </span>
                    <button 
                        tabIndex='-1'
                        className='arrow-button'
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.hoursDecrement())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()}
                    >
                        <ArrowUpSVG svgClassName={'flip270'}/>
                    </button>
                </div>
                <span>:</span>
                <div>
                    <button 
                        tabIndex='-1'
                        className='arrow-button' 
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.minutesIncrement())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()}
                    >
                        <ArrowUpSVG svgClassName={'flip90'}/>
                    </button>
                    <span
                        tabIndex='0' 
                        ref={el => this.props.setMinutesRef(el)}
                        onKeyDown={(e) => this.props.handleKeyDown(e, () => this.props.minutesIncrement(), () => this.props.minutesDecrement())}
                        onKeyUp = {() => this.props.clearTimeoutAndInterval()}
                        onClick = {() => this.props.activate()}
                    >
                        {("0"+this.props.properties.value.minutes).slice(-2)}
                    </span>
                    <button 
                        tabIndex='-1'
                        className='arrow-button' 
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.minutesDecrement())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()}
                    >
                        <ArrowUpSVG svgClassName={'flip270'}/>
                    </button>
                </div>
                <div>
                    <button 
                        tabIndex='-1'
                        className='arrow-button' 
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.amPmToggler())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()}
                    >
                        <ArrowUpSVG svgClassName={'flip90'}/>
                    </button>
                    <span
                        tabIndex='0' 
                        ref={el => this.props.setAmPmRef(el)}
                        className='lastTabElement'
                        onKeyDown={(e) => this.props.handleKeyDown(e, () => this.props.amPmToggler(), () => this.props.amPmToggler())}
                        onKeyUp = {() => this.props.clearTimeoutAndInterval()}
                        onClick = {() => this.props.activate()}
                    >
                        {this.props.properties.value.am ? 'AM' : "PM"}
                    </span>
                    <button 
                        tabIndex='-1'
                        className='arrow-button' 
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.amPmToggler())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()}
                    >
                        <ArrowUpSVG svgClassName={'flip270'}/>
                    </button>
                </div>
            </div>
        )}
        if(!this.props.properties.timePickerMode){
            return (
                <div className='time-number-picker-drop-down absolute-drop-down'>
                    <button 
                        tabIndex='-1'
                        className='arrow-button' 
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.numberIncrement())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()} 
                    >
                        <ArrowUpSVG svgClassName={'flip90'}/>
                    </button>
                    <span 
                        ref={el => this.props.setNumberRef(el)}
                        className='lastTabElement'
                        tabIndex='0' 
                        onKeyDown={(e) => this.props.handleKeyDown(e, () => this.props.numberIncrement(), () => this.props.numberDecrement())}
                        onKeyUp = {() => this.props.clearTimeoutAndInterval()}
                    >
                        {this.props.properties.value.number}
                    </span>
                    <button 
                        tabIndex='-1'
                        className='arrow-button'
                        onMouseDown={() => this.props.performMultipleTimes(() => this.props.numberDecrement())}
                        onMouseUp={() => this.props.clearTimeoutAndInterval()}
                        onMouseOut={() => this.props.clearTimeoutAndInterval()}
                    >
                        <ArrowUpSVG svgClassName={'flip270'}/>
                    </button>
                </div>
            )
        }
    }
}

export default TimePickerDropDown;