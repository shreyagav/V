import React, { Component } from "react";
import ArrowUpSVG from "../svg/ArrowUpSVG";
import "./TimePicker.css";
import "./MultiDropDown/MultiDropDown.css";
import CloseUpSVG from "../svg/CloseUpSVG";
import TimePickerDropDown from "./TimePickerDropDown";

export class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.timeDefaultValue = {
      activated: false,
      hours: 8,
      minutes: 0,
      am: true,
    };
    this.numberDefaultValue = {
      activated: false,
      number: 0,
    };
    this.toggle = this.toggle.bind(this);
    this.dropDownHeaderRef = null;
    this.numberRef = null;
    this.lastInputTouchedRef = null;
    this.hoursRef = null;
    this.minutesRef = null;
    this.amPmRef = null;
    this.dropDownWrapperRef = null;

    this.performMultipleTimes = this.performMultipleTimes.bind(this);
    this.clearTimeoutAndInterval = this.clearTimeoutAndInterval.bind(this);
    this.hoursIncrement = this.hoursIncrement.bind(this);
    this.hoursDecrement = this.hoursDecrement.bind(this);
    this.minutesIncrement = this.minutesIncrement.bind(this);
    this.minutesDecrement = this.minutesDecrement.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.amPmToggler = this.amPmToggler.bind(this);
    this.numberIncrement = this.numberIncrement.bind(this);
    this.numberDecrement = this.numberDecrement.bind(this);
    this.toggle = this.toggle.bind(this);
    this.activate = this.activate.bind(this);
  }

  componentDidUpdate() {
    if (this.state.isOpen) {
      if (this.numberRef !== null) {
        this.numberRef.focus();
      } else {
        if (this.lastInputTouchedRef !== null) {
          let me = this;
          setTimeout(() => {
            me.lastInputTouchedRef.focus();
          }, 10);
        } else {
          if (this.hoursRef !== null) {
            let me = this;
            setTimeout(() => {
              me.hoursRef.focus();
            }, 100);
          }
        }
      }
    }
  }

  toggle() {
    if (this.state.isOpen) {
      this.lastInputTouchedRef = null;
      this.dropDownHeaderRef.focus();
    }
    this.setState({ isOpen: !this.state.isOpen });
  }

  numberIncrement() {
    if (this.props.value.number < 99) {
      this.props.onChange({
        number: this.props.value.number + 1,
        activated: true,
      });
    }
  }

  numberDecrement() {
    if (this.props.value.number > 0) {
      this.props.onChange({
        number: this.props.value.number - 1,
        activated: true,
      });
    }
  }

  hoursIncrement() {
    let hours = this.props.value.hours;
    this.lastInputTouchedRef = this.hoursRef;
    if (hours > 11) {
      hours = 1;
    } else {
      hours = hours + 1;
    }
    this.props.onChange({
      hours: hours,
      minutes: this.props.value.minutes,
      am: this.props.value.am,
      activated: true,
    });
  }

  minutesIncrement() {
    this.lastInputTouchedRef = this.minutesRef;
    let hours = this.props.value.hours;
    let minutes = this.props.value.minutes;
    if (minutes > 50) {
      minutes = 0;
      if (hours > 11) {
        hours = 1;
      } else {
        hours = hours + 1;
      }
    } else {
      minutes = minutes + 5;
    }
    this.props.onChange({
      hours: hours,
      minutes: minutes,
      am: this.props.value.am,
      activated: true,
    });
  }

  amPmToggler() {
    this.lastInputTouchedRef = this.amPmRef;
    this.props.onChange({
      hours: this.props.value.hours,
      minutes: this.props.value.minutes,
      am: !this.props.value.am,
      activated: true,
    });
  }

  hoursDecrement() {
    let hours = this.props.value.hours;
    this.lastInputTouchedRef = this.hoursRef;
    if (hours < 2) {
      hours = 12;
    } else {
      hours = hours - 1;
    }
    this.props.onChange({
      hours: hours,
      minutes: this.props.value.minutes,
      am: this.props.value.am,
      activated: true,
    });
  }

  minutesDecrement() {
    this.lastInputTouchedRef = this.minutesRef;
    let hours = this.props.value.hours;
    let minutes = this.props.value.minutes;
    if (minutes < 5) {
      minutes = 55;
      if (hours < 2) {
        hours = 12;
      } else {
        hours = hours - 1;
      }
    } else {
      minutes = minutes - 5;
    }
    this.props.onChange({
      hours: hours,
      minutes: minutes,
      am: this.props.value.am,
      activated: true,
    });
  }

  performMultipleTimes(callback) {
    if (this.intervalVariable > 0) {
      return;
    }
    callback();
    this.timeoutVariable = setTimeout(() => {
      this.intervalVariable = setInterval(() => {
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
    if (e.keyCode === 13) {
      // Enter
      if (this.state.isOpen && !this.state.activated) {
        if (this.props.timePickerMode) {
          this.props.onChange({
            hours: this.props.value.hours,
            minutes: this.props.value.minutes,
            am: this.props.value.am,
            activated: true,
          });
        } else {
          this.props.onChange({
            number: this.props.value.number,
            activated: true,
          });
        }
        this.dropDownHeaderRef.focus();
      }
      this.toggle();
      return;
    }
    if (e.keyCode === 27) {
      // ESC
      if (this.state.isOpen) {
        this.dropDownHeaderRef.focus();
      }
      this.toggle();
      return;
    }
    if (e.keyCode === 9) {
      // TAB
      if (
        (this.state.isOpen && e.target.className === "lastTabElement") ||
        (this.state.isOpen && e.shiftKey)
      ) {
        e.preventDefault();
        this.dropDownHeaderRef.focus();
        this.toggle();
      }
      return;
    }
    if (e.keyCode === 38) {
      // up arrow
      if (!this.props.value.activated) {
        this.props.onChange({
          hours: this.props.value.hours,
          minutes: this.props.value.minutes,
          am: this.props.value.am,
          activated: true,
        });
      }
      this.performMultipleTimes(() => callback1());
      e.preventDefault();
      return;
    }
    if (e.keyCode === 40) {
      // down arrow
      if (!this.props.value.activated) {
        this.props.onChange({
          hours: this.props.value.hours,
          minutes: this.props.value.minutes,
          am: this.props.value.am,
          activated: true,
        });
      }
      this.performMultipleTimes(() => callback2());
      e.preventDefault();
      return;
    }
  }

  headerKeyDownHandler(e) {
    switch (e.keyCode) {
      case 13: //enter
        this.toggle();
        this.dropDownHeaderRef.focus();
        break;
      case 27: //ESC
        if (this.state.isOpen) {
          this.toggle();
          this.dropDownHeaderRef.focus();
        }
        break;
      case 38: //Up Arrow
        e.preventDefault();
        if (!this.state.isOpen) {
          this.toggle();
        }
        break;
      case 40: //Down Arrow
        e.preventDefault();
        if (!this.state.isOpen) {
          this.toggle();
        }
        break;
      default:
        break;
    }
  }

  clearButtonOnClick(e) {
    if (this.props.timePickerMode) {
      this.props.onChange(this.timeDefaultValue);
    } else {
      this.props.onChange(this.numberDefaultValue);
    }
    this.lastInputTouchedRef = null;
    e.stopPropagation();
    this.dropDownHeaderRef.focus();
  }

  clearButtonKeyHandler(e) {
    if (e.keyCode === 13) {
      /* enter */
      this.clearButtonOnClick(e);
    } else {
      if (e.keyCode !== 9) {
        /* not TAB */
        e.preventDefault();
      }
    }
  }

  activate() {
    let time = this.props.value;
    this.props.onChange({
      hours: time.hours,
      minutes: time.minutes,
      am: time.am,
      activated: true,
    });
  }

  render() {
    return (
      <div
        ref={(el) => (this.timeNumberPickerRef = el)}
        className={
          this.props.timePickerMode
            ? "drop-down time-picker position-wrapper"
            : "drop-down number-picker position-wrapper"
        }
      >
        <div
          className="drop-down-header"
          ref={(el) => (this.dropDownHeaderRef = el)}
          tabIndex="0"
          onClick={() => this.toggle()}
          onKeyDown={(e) => this.headerKeyDownHandler(e)}
          style={this.state.isOpen ? { border: "1px solid #0099cc" } : {}}
        >
          <input
            readOnly
            tabIndex="-1"
            placeholder={this.props.timePickerMode ? "08:00 AM" : "0"}
            value={
              this.props.timePickerMode
                ? this.props.value.activated
                  ? ("0" + this.props.value.hours).slice(-2) +
                    ":" +
                    ("0" + this.props.value.minutes).slice(-2) +
                    " " +
                    (this.props.value.am ? "AM" : "PM")
                  : ""
                : this.props.value.activated
                ? this.props.value.number
                : ""
            }
          />
          {this.props.value.activated && !this.state.isOpen ? (
            <button
              className="arrow-button"
              onClick={(e) => this.clearButtonOnClick(e)}
              onKeyDown={(e) => this.clearButtonKeyHandler(e)}
            >
              <CloseUpSVG />
            </button>
          ) : (
            <button disabled className={"arrow-button onFocusWithDDH"}>
              <ArrowUpSVG
                svgClassName={this.state.isOpen ? "flip90" : "flip270"}
              />
            </button>
          )}
        </div>
        <div ref={(el) => (this.dropDownWrapperRef = el)}>
          {this.state.isOpen && (
            <TimePickerDropDown
              data={this.props.state}
              properties={this.props}
              activate={this.activate}
              performMultipleTimes={this.performMultipleTimes}
              clearTimeoutAndInterval={this.clearTimeoutAndInterval}
              timeNumberPickerRef={this.timeNumberPickerRef}
              dropDownWrapperRef={this.dropDownWrapperRef}
              setHoursRef={(el) => (this.hoursRef = el)}
              setAmPmRef={(el) => (this.amPmRef = el)}
              setMinutesRef={(el) => (this.minutesRef = el)}
              handleKeyDown={this.handleKeyDown}
              hoursIncrement={this.hoursIncrement}
              hoursDecrement={this.hoursDecrement}
              minutesIncrement={this.minutesIncrement}
              minutesDecrement={this.minutesDecrement}
              amPmToggler={this.amPmToggler}
              numberIncrement={this.numberIncrement}
              numberDecrement={this.numberDecrement}
              setNumberRef={(el) => (this.numberRef = el)}
              toggle={this.toggle}
            />
          )}
        </div>
        {/*this.state.isOpen && this.props.timePickerMode &&
                    <div 
                        className='time-number-picker-drop-down absolute-drop-down'
                        style={{"border":"1px solid #0099cc"}}
                    >
                        <div>
                            <button 
                                tabIndex='-1'
                                className='arrow-button'
                                onMouseDown={() => this.performMultipleTimes(() => this.hoursIncrement())}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip90'}/>
                            </button>
                            <span 
                                tabIndex='0' 
                                ref={el => this.hoursRef = el}
                                onKeyDown={(e) => this.handleKeyDown(e, this.hoursIncrement.bind(this), this.hoursDecrement.bind(this))}
                                onKeyUp = {() => this.clearTimeoutAndInterval()}
                            >
                                {("0" + this.props.value.hours).slice(-2)}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button'
                                onMouseDown={() => this.performMultipleTimes(() => this.hoursDecrement())}
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
                                className='arrow-button' 
                                onMouseDown={() => this.performMultipleTimes(() => this.minutesIncrement())}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip90'}/>
                            </button>
                            <span
                                tabIndex='0' 
                                ref={el => this.minutesRef = el}
                                onKeyDown={(e) => this.handleKeyDown(e, this.minutesIncrement.bind(this), this.minutesDecrement.bind(this))}
                                onKeyUp = {() => this.clearTimeoutAndInterval()}
                            >
                                {("0"+this.props.value.minutes).slice(-2)}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button' 
                                onMouseDown={() => this.performMultipleTimes(() => this.minutesDecrement())}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            
                            >
                                <ArrowUpSVG svgClassName={'flip270'}/>
                            </button>
                        </div>
                        <div>
                            <button 
                                tabIndex='-1'
                                className='arrow-button' 
                                onMouseDown={() => this.performMultipleTimes(() => this.amPmToggler())}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip90'}/>
                            </button>
                            <span
                                tabIndex='0' 
                                ref={el => this.amPmRef = el}
                                className='lastTabElement'
                                onKeyDown={(e) => this.handleKeyDown(e, this.amPmToggler.bind(this), this.amPmToggler.bind(this))}
                                onKeyUp = {() => this.clearTimeoutAndInterval()}
                                >
                                {this.props.value.am ? 'AM' : "PM"}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button' 
                                onMouseDown={() => this.performMultipleTimes(() => this.amPmToggler())}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip270'}/>
                            </button>
                        </div>
                    </div>
                */}
        {/*this.state.isOpen && !this.props.timePickerMode &&
                    <div className='time-number-picker-drop-down absolute-drop-down'>
                        <div>
                            <button 
                                tabIndex='-1'
                                className='arrow-button' 
                                onMouseDown={() => this.performMultipleTimes(() => this.numberIncrement())}
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
                                {this.props.value.number}
                            </span>
                            <button 
                                tabIndex='-1'
                                className='arrow-button'
                                onMouseDown={() => this.performMultipleTimes(() => this.numberDecrement())}
                                onMouseUp={() => this.clearTimeoutAndInterval()}
                                onMouseOut={() => this.clearTimeoutAndInterval()}
                            >
                                <ArrowUpSVG svgClassName={'flip270'}/>
                            </button>
                        </div>
                    </div>
                */}
      </div>
    );
  }
}

export default TimePicker;
