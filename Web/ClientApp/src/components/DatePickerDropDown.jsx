import React, { Component } from "react";
import ArrowUpSVG from "../svg/ArrowUpSVG";
import "./DatePicker.css";
import TodaySVG from "../svg/TodaySVG";
import CloseUpSVG from "../svg/CloseUpSVG";

class DatePickerDropDown extends Component {
  constructor(props) {
    super(props);
    this.monthButtonRef = null;
    this.calendarUlRef = null;
    this.calendarBodyRef = null;
    this.handleClick = this.handleClick.bind(this);
    this.opensBottom = true;
    this.styleBottom = {
      position: "absolute",
      top: "41px",
      left: "0px",
      right: "0px",
      boxShadow: "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)",
      zIndex: "1072",
      background: "#ffffff",
    };
    this.styleTop = {
      position: "absolute",
      bottom: "41px",
      left: "0px",
      right: "0px",
      boxShadow: "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)",
      zIndex: "1072",
      background: "#ffffff",
    };
  }

  componentWillMount() {
    this.opensBottom = this.checkIfOpensBottom(
      this.props.datePickerRef,
      this.props.dropDownHeaderRef,
    );
    document.addEventListener("mousedown", this.handleClick, false);
  }

  componentDidMount() {
    if (this.calendarUlRef !== null) {
      this.calendarUlRef.focus();
    }
    this.scrollCalendarIntoView();
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  handleClick(e) {
    if (
      !(
        this.calendarBodyRef.contains(e.target) ||
        this.props.datePickerRef.contains(e.target)
      )
    ) {
      this.props.toggle();
    }
  }

  scrollCalendarIntoView() {
    let bottom = this.calendarBodyRef.getBoundingClientRect().bottom;
    let top = this.calendarBodyRef.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;
    if (this.opensBottom && bottom > windowHeight) {
      this.calendarBodyRef.scrollIntoView(false);
    }
    if (!this.opensBottom && top < 0) {
      this.calendarBodyRef.scrollIntoView(true);
    }
  }

  checkIfOpensBottom(parent, header) {
    let windowHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    );
    let headerHeight = header.getBoundingClientRect().height;
    let top = parent.getBoundingClientRect().top;
    let bottom = top + headerHeight;
    let toTop = top - 55;
    let toBottom = windowHeight - bottom;
    let calendarHeight = parent.getBoundingClientRect().width;
    if (toTop > toBottom /*&& toTop >= calendarHeight */) {
      return false;
    } else {
      return true;
    }
  }

  updateFocus() {
    let setFocusTo = this.props.setFocusTo;
    if (this.props.regularCalendar) {
      if (this.props.setFocusTo < 0) {
        let value = this.props.value;
        let selectedDateIndex = -1;
        if (value !== undefined && value !== null && value !== "") {
          selectedDateIndex = this.props.calendar.findIndex((day) => {
            return (
              day.date.getDate() === value.getDate() &&
              day.date.getMonth() === value.getMonth() &&
              day.date.getFullYear() === value.getFullYear()
            );
          });
        }
        let todayIndex = this.props.calendar.findIndex((day) => {
          return day.className.includes("actToday");
        });
        let firstDayIndex = this.props.calendar.findIndex((day) => {
          return day.className.includes("current-month");
        });
        if (
          selectedDateIndex >
          -1 /*&& !this.props.checkIfDisabled(selectedDateIndex)*/
        ) {
          setFocusTo = selectedDateIndex;
          this.props.setProp("setFocusTo", selectedDateIndex);
        } else {
          if (todayIndex > -1 && !this.props.checkIfDisabled(todayIndex)) {
            setFocusTo = todayIndex;
            this.props.setProp("setFocusTo", todayIndex);
          } else {
            if (!this.props.checkIfDisabled(firstDayIndex)) {
              setFocusTo = firstDayIndex;
              this.props.setProp("setFocusTo", firstDayIndex);
            } else {
              if (!this.props.checkIfDisabled(0)) {
                setFocusTo = 0;
                this.props.setProp("setFocusTo", 0);
              }
            }
          }
        }
      }
    } else {
      if (this.props.setFocusTo < 0) {
        let today = new Date();
        if (this.props.currentYear === today.getFullYear()) {
          setFocusTo = today.getMonth();
          this.props.setProp("setFocusTo", today.getMonth());
        } else {
          setFocusTo = 0;
          this.props.setProp("setFocusTo", 0);
        }
      }
    }
    return setFocusTo;
  }

  onTodayButtonClick() {
    this.props.createCalendar(
      this.props.actTodayYear,
      this.props.actTodayMonth,
      () => {
        this.calendarUlRef.focus();
      },
    );
  }

  returnToHeader(e) {
    this.props.toggle();
    e.preventDefault();
    e.stopPropagation();
    this.props.dropDownHeaderRef.focus();
  }

  onMonthButtonClick() {
    this.props.toggleCalendar(() => {
      this.updateFocus();
      if (this.calendarUlRef !== null) {
        this.calendarUlRef.focus();
      }
    });
  }

  render() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <div
        ref={(el) => (this.calendarBodyRef = el)}
        className="flex-nowrap flex-flow-column align-center cw-100 date-picker-drop-down" /*absolute-drop-down*/
        style={this.opensBottom ? this.styleBottom : this.styleTop}
        onKeyDown={(e) => {
          if (e.keyCode === 27) {
            this.props.toggle();
          }
        }}
      >
        <div className="flex-nowrap justify-stretch mb-05 mt-05 align-center">
          <button
            ref={(el) => (this.leftButtonRef = el)}
            className={
              this.props.decButtonDisabled
                ? "arrow-button disabledButton"
                : "arrow-button"
            }
            disabled={this.props.decButtonDisabled}
            onMouseDown={() =>
              this.props.performMultipleTimes(() =>
                this.props.onArrowClick(false),
              )
            }
            onMouseUp={() => this.props.clearTimeoutAndInterval()}
            onMouseOut={() => this.props.clearTimeoutAndInterval()}
            onKeyDown={(e) => {
              switch (e.keyCode) {
                case 13:
                  this.props.performMultipleTimes(() =>
                    this.props.onArrowClick(false),
                  );
                  e.preventDefault();
                  this.leftButtonRef.focus();
                  break;
                case 9:
                  if (e.shiftKey) {
                    this.returnToHeader(e);
                  }
                  break;
                case 27:
                  break;
                default:
                  e.preventDefault();
                  break;
              }
            }}
            onKeyUp={this.props.clearTimeoutAndInterval}
          >
            <ArrowUpSVG />
          </button>
          <button
            ref={(el) => (this.monthButtonRef = el)}
            className="h2 uppercase-text flex11auto align-self-stretch no-outline-button"
            style={{ fontSize: "25px", paddingBottom: "2px" }}
            onClick={() => this.onMonthButtonClick()}
            disabled={this.props.regularCalendar ? false : true}
            onKeyDown={(e) => {
              if (e.keyCode === 13 /* ENTER */) {
                this.onMonthButtonClick();
              }
            }}
          >
            {this.props.regularCalendar &&
              monthNames[this.props.currentMonth] + " "}
            <strong>
              <b>{this.props.currentYear}</b>
            </strong>
          </button>
          <button
            ref={(el) => (this.rightButtonRef = el)}
            className={
              this.props.incButtonDisabled
                ? "arrow-button disabledButton"
                : "arrow-button"
            }
            disabled={this.props.incButtonDisabled}
            onMouseDown={() =>
              this.props.performMultipleTimes(() =>
                this.props.onArrowClick(true),
              )
            }
            onMouseUp={() => this.props.clearTimeoutAndInterval()}
            onMouseOut={() => this.props.clearTimeoutAndInterval()}
            onKeyDown={(e) => {
              switch (e.keyCode) {
                case 13:
                  this.props.performMultipleTimes(() =>
                    this.props.onArrowClick(true),
                  );
                  e.preventDefault();
                  this.rightButtonRef.focus();
                  break;
                case 9:
                  break;
                case 27:
                  break;
                default:
                  e.preventDefault();
                  break;
              }
            }}
            onKeyUp={this.props.clearTimeoutAndInterval}
          >
            <ArrowUpSVG svgClassName="flip180" />
          </button>
        </div>

        {this.props.regularCalendar && (
          <ul className="calendar-grid calendar-header light-grey-text uppercase-text nonselect">
            <li>Su</li>
            <li>Mo</li>
            <li>Tu</li>
            <li>We</li>
            <li>Th</li>
            <li>Fr</li>
            <li>Sa</li>
          </ul>
        )}
        {this.props.regularCalendar && (
          <ul
            ref={(el) => (this.calendarUlRef = el)}
            className="calendar-grid calendar-content dark-grey-text"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                /* ENTER */
                if (this.props.setFocusTo > -1) {
                  let fullDate =
                    this.props.calendar[this.props.setFocusTo].date;
                  this.props.setProp("currentDate", fullDate);
                  this.props.onSelect(fullDate);
                  this.props.toggle();
                  this.props.dropDownHeaderRef.focus();
                }
              } else this.props.calendarKeyDownHandler(e);
            }}
            onFocus={
              () =>
                this.updateFocus() /*{if(this.updateFocus() < 0){this.monthButtonRef.focus(); }}*/
            }
            onBlur={() => this.props.setProp("setFocusTo", -1)}
          >
            {this.props.calendar.map((element, index) => {
              let disabled = this.props.checkIfDisabled(index);
              let actToday = this.props.checkIfActToday(index);
              return (
                <li
                  key={index}
                  className={
                    element.className +
                    (disabled ? " disabled" : "") +
                    (actToday ? " act-today" : "") +
                    (this.props.setFocusTo === index ? " onFocus" : "")
                  }
                  onClick={() => {
                    if (!disabled) {
                      this.props.onSelect(element.date);
                    }
                  }}
                >
                  <div className={element.className}>
                    <strong>{element.label}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {!this.props.regularCalendar && (
          <div className="flex-nowrap justify-center">
            <ul
              ref={(el) => (this.calendarUlRef = el)}
              className="calendar-grid month-calendar-grid calendar-content dark-grey-text"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  /* ENTER */
                  if (this.props.setFocusTo > -1) {
                    this.props.createCalendar(
                      this.props.currentYear,
                      this.props.setFocusTo,
                      () => {
                        this.calendarUlRef.focus();
                      },
                    );
                  }
                } else this.props.monthPickerKeyDownHandler(e);
              }}
              onFocus={() => this.updateFocus()}
              onBlur={() => {
                this.props.setProp("setFocusTo", -1);
              }}
            >
              {monthNames.map((element, index) => (
                <li
                  key={index}
                  onClick={() =>
                    this.props.createCalendar(this.props.currentYear, index)
                  }
                  className={
                    element.className +
                    (this.props.checkIfMonthIsWalkable(
                      this.props.currentYear,
                      index,
                      5,
                    )
                      ? ""
                      : " disabled") +
                    /*(actToday ? " act-today" : "") + */
                    (this.props.setFocusTo === index ? " onFocus" : "")
                  }
                >
                  <div>
                    <span>
                      <strong className="uppercase-text">
                        {element.slice(0, 3)}
                      </strong>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {this.props.checkIfMonthIsWalkable(
          new Date().getFullYear(),
          new Date().getMonth(),
          5,
        ) && (
          <button
            style={{ flexShrink: "0" }}
            className="round-button medium-round-button no-outline-button"
            onClick={() => this.onTodayButtonClick()}
            onKeyDown={(e) => {
              switch (e.keyCode) {
                case 9 /* TAB */:
                  if (!e.shiftKey) {
                    this.returnToHeader(e);
                  }
                  break;
                case 13 /* ENTER */:
                  this.onTodayButtonClick();
                  break;
                default:
                  break;
              }
            }}
            ref={(el) => this.props.setSetTodayButtonRef(el)}
          >
            <span>current month</span>
          </button>
        )}
      </div>
    );
  }
}

export default DatePickerDropDown;
