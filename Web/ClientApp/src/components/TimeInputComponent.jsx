import React, { Component } from 'react';
import ArrowSVG from './buttonsSVG/ArrowSVG';

class TimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
    this.hoursInputRef = null;
    this.minutesInputRef = null;
    this.ampmInputRef = null;
    this.flag = false;
  }

  timeInputLostFocus() {
    this.hoursInputRef.className = 'notActiveInput';
    this.minutesInputRef.className = 'notActiveInput';
    this.ampmInputRef.className = 'notActiveInput';
    this.inputOnFocus = null;
    if(this.props.data.status !== "empty") {
      this.props.onStatusUpdate('hours');
    }
  }

  handleKeyDown(e) {
    //if TAB + SHIFT was pressed for the HOURS input or TAB for AMPM Input
    if ((this.inputOnFocus === this.ampmInputRef && e.keyCode === 9 && !e.shiftKey) || 
        (this.inputOnFocus === this.hoursInputRef && e.keyCode === 9 && e.shiftKey)) {
       this.timeInputLostFocus();
       return;
    }
    if(e.keyCode === 38) { // up arrow
      this.props.onIncrement();
      e.preventDefault();
      return;
    }
    if(e.keyCode === 40) { // down arrow
      this.props.onDecrement();
      e.preventDefault();
      return;
    }
  }

  returnActiveInput(){
    let activeInput = null;
    switch(this.props.data.status) {
      case "hours":
        activeInput = this.hoursInputRef;
        break;
      case "minutes":
        activeInput = this.minutesInputRef;
        break;
      case "ampm":
        activeInput = this.ampmInputRef;
        break;
    }
    return activeInput;
  }

  returnFocusToInput(){
      let activeInput = this.returnActiveInput();
      activeInput.focus();
  }

  setBackground(className){
      let inputOnFocus = this.returnActiveInput();
      inputOnFocus.className = className;
      this.setState(() => ({refresh: true}));
  }

  handleMouseUp() {
    if (this.flag) {
      this.props.onClearTimeoutAndInterval(); 
      this.setBackground('notActiveInput');
      this.returnFocusToInput();
    }
    this.flag = false;
  }
  
  render() {
    return (
      <div className="timeInput boldFont" style={this.props.disableChanges ? {"padding" : "0px 7px 0px 7px"} : {}}>
        <input 
          ref={(element) => {this.hoursInputRef = element}}
          type="number"
          placeholder={'08'}
          value={this.props.data.status !== "empty" ? (('0' + this.props.data.hours).slice(-2)) : ""} 
          onFocus = {() => this.props.onStatusUpdate('hours')}
          onKeyDown = {(e) => this.handleKeyDown(e)}
          onKeyUp = {() => this.props.onClearTimeoutAndInterval()}
          readOnly
          disabled={this.props.disableChanges || this.props.disableButtons}
        />
        <input 
          type="text"
          placeholder={":"}
          value={this.props.data.status !== "empty" ? ":" : ""}
          disabled
        />
        <input 
          ref={(element) => {this.minutesInputRef = element}}
          type="number"
          placeholder={'00'}
          value={this.props.data.status !== "empty" ? (('0' + this.props.data.minutes).slice(-2)) : ""} 
          onFocus = {() => this.props.onStatusUpdate('minutes')}
          onKeyDown = {(e) => this.handleKeyDown(e)}
          onKeyUp = {() => this.props.onClearTimeoutAndInterval()}
          readOnly
          disabled={this.props.disableChanges || this.props.disableButtons}
        />
        <input 
          ref={(element) => {this.ampmInputRef = element}}
          type="text"
          placeholder={'PM'}
          value={this.props.data.status !== "empty" ? (this.props.data.am ? "AM" : "PM"):""} 
          onFocus = {() => this.props.onStatusUpdate('ampm')}
          onKeyDown = {(e) => this.handleKeyDown(e)}
          onKeyUp = {() => this.props.onClearTimeoutAndInterval()}
          readOnly
          disabled={this.props.disableChanges || this.props.disableButtons}
        />
        {this.props.disableChanges &&
          <div></div>
        }
        {!this.props.disableChanges &&
          <div className="upDownButtons">
            <button
              tabIndex='-1'
              disabled={this.props.disableButtons}
              className="flex-container"
              onMouseDown = {() => {this.flag = true; this.setBackground('activeInput'); this.props.onIncrement()}}
              onMouseOut = {() => this.handleMouseUp()}
              onMouseUp = {() => this.handleMouseUp()}
            >
              <ArrowSVG />
            </button>
            <button
              tabIndex='-1'
              disabled={this.props.disableButtons}
              className="flex-container"
              onMouseDown = {() => {this.flag = true; this.setBackground('activeInput'); this.props.onDecrement()}}
              onMouseOut = {() => this.handleMouseUp()}
              onMouseUp = {() => this.handleMouseUp()}
            >
              <ArrowSVG />
            </button>
          </div>
        }
      </div>
    );
  }
}

export default TimeInput;