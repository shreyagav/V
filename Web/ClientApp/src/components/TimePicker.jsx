import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import './TimePicker.css'
import './DropDown.css'

export class TimePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activated: false,
            hours: 8,
            minutes: 0,
            am: true,
            number: 0,
            isOpen: false,
        };
        this.toggle = this.toggle.bind(this);
        this.dropDownHeaderRef = null;
        this.numberRef = null;
    }

    componentDidUpdate(){
        if (this.state.isOpen){
            this.numberRef.focus();
        }
    }

    toggle(){this.setState({isOpen: !this.state.isOpen});}

    numberIncrement() {
        if (this.state.number < 99) {
            this.setState({number: this.state.number + 1})
        } 
    }

    numberDecrement() {
        if (this.state.number > 0) {
            this.setState({number: this.state.number - 1})
        } 
    }

    hoursIncrement() {
        let hours = this.state.hours;
        if (hours > 11) {
            this.setState({hours: 1})
        } 
        else {
            this.setState({hours: hours + 1})
        }
    }

    minutesIncrement() {
        let hours = this.state.hours;
        let minutes = this.state.minutes;
        if (minutes > 50) {
            minutes = 0;
            if(hours > 11) {
                hours = 1;
            } 
            else {
                hours = hours + 1;
            }
        }  
        else {
            minutes = minutes + 5;
        }
        this.setState({hours: hours, minutes: minutes});
    }

    amPmToggler(){
        this.setState({am: !this.state.am});
    }

    hoursDecrement() {
        let hours = this.state.hours;
        if (hours < 2) {
            this.setState({hours: 12})
        } 
        else {
            this.setState({hours: hours - 1})
        }
    }

    minutesDecrement() {
        let hours = this.state.hours;
        let minutes = this.state.minutes;
        if (minutes < 5) {
            minutes = 55;
            if(hours < 2) {
                hours = 12;
            } 
            else {
                hours = hours - 1;
            }
        }  
        else {
            minutes = minutes - 5;
        }
        this.setState({hours: hours, minutes: minutes});
    }

    performMultipleTimes(callback) {
        if(this.intervalVariable > 0) {return;}
        callback();
        this.timeoutVariable = setTimeout (() => {
          this.intervalVariable = setInterval (() => {
            callback();
          }, 100);
        }, 300);
    }
    
    clearTimeoutAndInterval() {
        clearTimeout(this.timeoutVariable);
        clearInterval(this.intervalVariable);
        this.timeoutVariable = 0;
        this.intervalVariable = 0;
    }

    handleKeyDown(e, callback1, callback2) {
        if(e.keyCode === 27 || e.keyCode === 13) { // ESC
            if(this.state.isOpen){this.dropDownHeaderRef.focus();}
            this.toggle();
            return;
        }
        if(e.keyCode === 9) { // TAB
            if(this.state.isOpen && e.target.className === 'lastTabElement'){
                e.preventDefault();
                this.dropDownHeaderRef.focus();
                this.toggle();
            }
            return;
        }
        if(e.keyCode === 38) { // up arrow
            if (!this.state.activated) {this.setState({activated: true});} 
            this.performMultipleTimes(() => callback1());
            e.preventDefault();
            return;
        }
        if(e.keyCode === 40) { // down arrow
            if (!this.state.activated) {this.setState({activated: true});} 
            this.performMultipleTimes(() => callback2());
            e.preventDefault();
            return;
        }
    }

    headerKeyDownHandler(e){
        switch (e.keyCode){
            case 13: //enter
                this.toggle();
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

    render() { 
        return (
            <div 
                ref={el => this.timeNumberPickerRef = el} 
                className={this.props.timePickerMode ? 'drop-down time-picker position-wrapper' : 'drop-down number-picker position-wrapper'}
            >
                <div 
                    ref={el => this.dropDownHeaderRef = el}
                    tabIndex='0'
                    className='drop-down-header' 
                    onClick={() => this.toggle()}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                    style={this.state.isOpen ? {"border":"1px solid #0099cc"} : {}}
                >
                    <div style={!this.state.activated ? {'fontStyle':'italic', 'fontWeight':'400', 'color':'#999999'} : {}}>
                        {this.props.timePickerMode ?
                            (this.state.activated ? ("0"+this.state.hours).slice(-2) + ':' + ("0"+this.state.minutes).slice(-2) + " " + (this.state.am ? 'AM' : "PM") : "08:00 AM")
                            :
                            (this.state.activated ? this.state.number : "0")
                        }
                    </div>
                    <button disabled className='drop-down-header-button' >
                        <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                </div>
                {this.state.isOpen && this.props.timePickerMode &&
                    <div 
                        className='time-number-picker-drop-down absolute-drop-down'
                        style={{"border":"1px solid #0099cc", "borderTop":"0px solid #666666"}}
                    >
                        <div>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square'
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.hoursIncrement())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip90'}/>
                            </button>
                            <span 
                                tabIndex='0' 
                                ref={el => this.numberRef = el}
                                onKeyDown={(e) => this.handleKeyDown(e, this.hoursIncrement.bind(this), this.hoursDecrement.bind(this))}
                                onKeyUp = {() => this.clearTimeoutAndInterval()}
                            >
                                {("0"+this.state.hours).slice(-2)}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square'
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.hoursDecrement())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip270'}/>
                            </button>
                        </div>
                        <span>:</span>
                        <div>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square' 
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.minutesIncrement())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip90'}/>
                            </button>
                            <span
                                tabIndex='0' 
                                onKeyDown={(e) => this.handleKeyDown(e, this.minutesIncrement.bind(this), this.minutesDecrement.bind(this))}
                                onKeyUp = {() => this.clearTimeoutAndInterval()}
                            >
                                {("0"+this.state.minutes).slice(-2)}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square' 
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.minutesDecrement())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            
                            >
                                <ArrowUpSVG svgClassName={'flip270'}/>
                            </button>
                        </div>
                        <div>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square' 
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.amPmToggler())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip90'}/>
                            </button>
                            <span
                                tabIndex='0' 
                                className='lastTabElement'
                                onKeyDown={(e) => this.handleKeyDown(e, this.amPmToggler.bind(this), this.amPmToggler.bind(this))}
                                onKeyUp = {() => this.clearTimeoutAndInterval()}
                                >
                                {this.state.am ? 'AM' : "PM"}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square' 
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.amPmToggler())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip270'}/>
                            </button>
                        </div>
                    </div>
                }
                {this.state.isOpen && !this.props.timePickerMode &&
                    <div 
                        className='time-number-picker-drop-down absolute-drop-down'
                        style={{"border":"1px solid #0099cc", "borderTop":"0px solid #666666"}}
                    >
                        <div>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square' 
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.numberIncrement())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()} 
                            >
                                <ArrowUpSVG svgClassName={'flip90'}/>
                            </button>
                            <span 
                                ref={el => this.numberRef = el}
                                className='lastTabElement'
                                tabIndex='0' 
                                onKeyDown={(e) => this.handleKeyDown(e, this.numberIncrement.bind(this), this.numberDecrement.bind(this))}
                                onKeyUp = {() => this.clearTimeoutAndInterval()}
                            >
                                {this.state.number}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button arrow-button-25square'
                                onMouseDown={() => {this.setState({activated: true}); this.performMultipleTimes(() => this.numberDecrement())}}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip270'}/>
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default TimePicker;