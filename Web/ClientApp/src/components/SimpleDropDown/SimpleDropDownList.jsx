import React, { Component } from "react";
import CheckBoxSVG from "../../svg/CheckBoxSVG";
import ArrowUpSVG from "../../svg/ArrowUpSVG";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

export class DropDownList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openStateIndex: [],
      setFocusToIndex: 0,
      setFocusToInnerIndex: 0,
    };
    this.lastOpenState = null;
    this.simpleBarRef = null;
    this.simpleBarWrapperRef = null;
    this.simpleBarHeight = "100%";
    this.opensDown = true;
    this.openStateRef = null;
    this.setFocusToRef = null;
    this.simpleList = false;

    this.setHeight = this.setHeight.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.className = "";
    this.style = {};
    this.checkBoxSelected = this.checkBoxSelected.bind(this);
    this.onSelectSingle = this.onSelectSingle.bind(this);
  }
  onSelectSingle(element) {
    this.props.selectedValues = element[this.props.keyProperty];
  }
  componentWillMount() {
    document.addEventListener("wheel", this.handleWheel, { passive: false });
    window.addEventListener("resize", this.setHeight);
  }

  componentWillUpdate() {
    this.setHeight();
  }

  componentDidMount() {
    this.setHeight();
    this.setFocus();
  }

  componentDidUpdate() {
    this.setFocus();
    /*scroll last openned object into view */
    if (this.openStateRef !== null) {
      var elem = this.openStateRef;
      var elemBottom = elem.getBoundingClientRect().bottom;
      let windowHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      );
      if (elemBottom > windowHeight) {
        elem.scrollIntoView(false);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.handleWheel, { passive: false });
    window.removeEventListener("resize", this.setHeight);
  }

  setFocus() {
    if (this.setFocusToRef !== null) {
      var list = this.simpleBarRef;
      var parentTop = list.parentElement.getBoundingClientRect().top;
      //var top = list.getBoundingClientRect().top;
      var elem = this.setFocusToRef;
      var elemTop = elem.getBoundingClientRect().top;
      var elemBottom = elem.getBoundingClientRect().bottom;
      var parentBottom = list.parentElement.getBoundingClientRect().bottom;
      if (parentTop > elemTop) {
        list.parentElement.scrollTop =
          list.parentElement.scrollTop - (parentTop - elemTop);
      }
      if (elemBottom > parentBottom) {
        list.parentElement.scrollTop =
          elemBottom - parentBottom + list.parentElement.scrollTop;
      }
      elem.focus({ preventScroll: true });
    }
  }

  setHeight() {
    if (this.simpleBarWrapperRef !== null) {
      let windowHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      );
      let dropDownHeaderHeight = 0;
      if (this.props.dropDownHeaderRef) {
        dropDownHeaderHeight =
          this.props.dropDownHeaderRef.getBoundingClientRect().height;
      }
      let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
      let bottom = top + dropDownHeaderHeight;
      let toTop = top - 56 - dropDownHeaderHeight; /* 56 - NAVBAR HEIGHT */
      let toBottom = windowHeight - bottom + dropDownHeaderHeight;
      let regularHeight = 45 * this.props.list.length;
      let simpleBarHeight = 0;
      if (this.props.toggleable) {
        if (toTop > toBottom) {
          //* OPENS UP *//
          this.opensDown = false;
          //simpleBarHeight = Math.floor(toTop);
          simpleBarHeight = Math.floor(toTop / 45) * 45 - 1;
          if (simpleBarHeight > regularHeight && regularHeight > 0) {
            simpleBarHeight = regularHeight;
          }
          this.simpleBarHeight = simpleBarHeight.toString() + "px";
          this.className = "drop-down-list-wrapper";
          this.style = {
            height: this.simpleBarHeight,
            bottom: dropDownHeaderHeight.toString() + "px",
            marginBottom: "-1px",
            boxShadow:
              "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)",
          };
        } else {
          /* OPENS DOWN */
          this.opensDown = true;
          //simpleBarHeight = Math.floor(toBottom);
          simpleBarHeight = Math.floor(toBottom / 45) * 45 - 1;
          if (simpleBarHeight > regularHeight && regularHeight > 0) {
            simpleBarHeight = regularHeight;
          }
          this.simpleBarHeight = simpleBarHeight.toString() + "px";
          this.className = "drop-down-list-wrapper";
          this.style = {
            height: this.simpleBarHeight,
            top: "0px",
            marginTop: "-1px",
            boxShadow:
              "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)",
          };
        }
        //simpleBarHeight = (Math.floor((toBottom - 16)/45))*45-1;
      } else {
        simpleBarHeight = Math.floor(toBottom);
        if (simpleBarHeight > regularHeight && regularHeight > 0) {
          simpleBarHeight = regularHeight;
        }
        this.simpleBarHeight = simpleBarHeight.toString() + "px";
        this.style = { height: this.simpleBarHeight };
      }
    }
  }

  checkBoxSelected(index, innerIndex) {
    /*this.props.dropDownStore.onCheckBoxChange(index, innerIndex);
        if (this.props.onSelectionChanged) {
            var list = this.props.dropDownStore.modifiedList;
            if (list && list.length && list.length > 0) {
                let multiLeveElement = list[0].hasOwnProperty("state");
                if (multiLeveElement) {
                    var temp = [];
                    list.forEach(a => {
                           temp = temp.concat(a.chapters.filter(b => b.checked));
                    });
                    this.props.onSelectionChanged(temp);    
                } else {
                    this.props.onSelectionChanged(list.filter(a=>a.checked));    
                }
            }
        }*/
  }

  handleWheel = (e) => {
    if (this.simpleBarRef === null || !this.simpleBarRef.contains(e.target)) {
      if (this.props.dropDownStore.isOpen) {
        this.props.dropDownStore.toggle();
      }
      return;
    }
    var cancelScrollEvent = function (e) {
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
    } else {
      if (!isDeltaPositive && -wheelDelta > scrollTop) {
        elem.scrollTop = 0;
        return cancelScrollEvent(e);
      }
    }
  };

  toggler(index, multiLevelList) {
    if (multiLevelList) {
      let openStateIndex = this.state.openStateIndex;
      if (openStateIndex["_" + index.toString()] === true) {
        delete openStateIndex["_" + index.toString()];
        this.setState(() => ({
          openStateIndex: openStateIndex,
          setFocusToInnerIndex: -1,
        }));
      } else {
        openStateIndex["_" + index.toString()] = true;
        this.setState(() => ({
          openStateIndex: openStateIndex,
          setFocusToInnerIndex: 0,
        }));
        this.lastOpenState = index;
      }
    }
    this.setState({ setFocusToIndex: index, setFocusToInnerIndex: -1 });
  }

  setUpRef(el, index) {
    if (this.lastOpenState === index) {
      this.openStateRef = el;
    }
  }

  keyDownHandler(e, index, innerIndex, multiLevelList, element) {
    switch (e.keyCode) {
      case 13: //ENTER
        if (multiLevelList) {
          this.toggler(index, multiLevelList);
        } else {
          this.props.dropDownStore.set("value", element);
          this.setState({ setFocusToIndex: 0 });
          this.props.dropDownStore.toggle();
        }
        break;
      case 32: //Space
        this.checkBoxSelected(index, innerIndex);
        e.preventDefault();
        break;
      case 27: //ESC
        this.setState({
          setFocusToIndex: 0,
          setFocusToInnerIndex: 0,
          setFocusToInnerIndex: -1,
        });
        this.props.dropDownStore.toggle();
        //this.dropDownHeader.focus();
        break;
      case 38: //Up Arrow
        //debugger
        e.preventDefault();
        if (innerIndex > -1) {
          // IT IS CHAPTER
          if (innerIndex > 0) {
            // NOT FIRST CHAPTER
            this.setState(() => ({
              setFocusToIndex: index,
              setFocusToInnerIndex: innerIndex - 1,
            }));
          } else {
            // FIRST CHAPTER
            this.setState(() => ({
              setFocusToIndex: index,
              setFocusToInnerIndex: -1,
            }));
          }
        } else {
          // IT IS STATE
          if (
            this.state.openStateIndex["_" + (index - 1).toString()] === true
          ) {
            //previous state is open
            this.setState(() => ({
              setFocusToIndex: index - 1,
              setFocusToInnerIndex:
                this.props.dropDownStore.modifiedList[index - 1].chapters
                  .length - 1,
            }));
          } else {
            //previous state is closed
            this.setState(() => ({
              setFocusToIndex: index - 1,
              setFocusToInnerIndex: -1,
            }));
          }
        }
        break;
      case 40: //Down Arrow
        e.preventDefault();
        if (this.state.openStateIndex["_" + index.toString()] === true) {
          // STATE IS OPEN
          if (innerIndex > -1) {
            // IT IS CHAPTER
            if (
              innerIndex <
              this.props.dropDownStore.modifiedList[index].chapters.length - 1
            ) {
              // NOT LAST CHAPTER
              this.setState({
                setFocusToIndex: index,
                setFocusToInnerIndex: innerIndex + 1,
              });
            } else {
              // LAST CHAPTER
              if (index < this.props.dropDownStore.modifiedList.length - 1) {
                //NOT LAST STATE
                this.setState({
                  setFocusToIndex: index + 1,
                  setFocusToInnerIndex: -1,
                });
              }
            }
          } else {
            // IT IS STATE
            this.setState({ setFocusToIndex: index, setFocusToInnerIndex: 0 });
          }
        } else {
          // STATE IS CLOSED
          if (index < this.props.dropDownStore.modifiedList.length - 1) {
            //NOT LAST STATE
            this.setState({
              setFocusToIndex: index + 1,
              setFocusToInnerIndex: -1,
            });
          }
        }
        break;
      case 9: // TAB
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div
        ref={(el) => (this.simpleBarWrapperRef = el)}
        style={{ position: "relative" }}
      >
        <div
          className={this.className}
          style={
            this.props.open || !this.props.toggleable
              ? this.style
              : { display: "none" }
          }
        >
          <SimpleBar>
            <ul
              className="drop-down-list"
              ref={(el) => (this.simpleBarRef = el)}
              style={{ height: this.simpleBarHeight }}
            >
              {this.props.list.map((element, index) => {
                let isOpen =
                  this.state.openStateIndex["_" + index.toString()] === true;
                let multiLeveElement = element.hasOwnProperty("state");
                return (
                  <li key={index} className={isOpen ? "openChapter" : ""}>
                    <div
                      ref={(el) => {
                        if (index === this.state.setFocusToIndex) {
                          this.setFocusToRef = el;
                        }
                      }}
                      tabIndex="0"
                      onKeyDown={(e) =>
                        this.keyDownHandler(
                          e,
                          index,
                          -1,
                          multiLeveElement,
                          element,
                        )
                      }
                    >
                      {this.props.allowMultiple && (
                        <label>
                          <input
                            type="checkbox"
                            /*checked={element.state.checked}*/
                            checked={element.checked}
                            onChange={() => {
                              this.checkBoxSelected(index, -1, element);
                              this.setState({
                                setFocusToIndex: index,
                                setFocusToInnerIndex: -1,
                              });
                            }} /* */
                          />
                          <CheckBoxSVG />
                        </label>
                      )}
                      <button
                        onClick={() => {
                          if (this.props.allowMultiple) {
                            this.toggler(index, true);
                          } else {
                            this.props.toggle();
                            this.onSelectSingle(element);
                          }
                        }}
                      >
                        {" "}
                        {this.props.renderItem ? (
                          this.props.renderItem(
                            element,
                            this.props.keyProperty,
                            this.props.textProperty,
                          )
                        ) : (
                          <span>{element[this.props.textProperty]}</span>
                        )}
                        {multiLeveElement && (
                          <ArrowUpSVG
                            svgClassName={isOpen ? "flip90" : "flip270"}
                          />
                        )}
                      </button>
                    </div>
                    {isOpen && (
                      <ul
                        className="drop-down-list"
                        ref={(el) => this.setUpRef(el, index)}
                      >
                        {element.chapters.map((el, innerIndex) => (
                          <li key={el.name} className="openChapter">
                            <div
                              ref={(el) => {
                                if (
                                  index === this.state.setFocusToIndex &&
                                  innerIndex === this.state.setFocusToInnerIndex
                                ) {
                                  this.setFocusToRef = el;
                                }
                              }}
                              tabIndex="0"
                              onKeyDown={(e) => {
                                this.keyDownHandler(
                                  e,
                                  index,
                                  innerIndex,
                                  true,
                                  element,
                                );
                              }}
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  checked={el.checked}
                                  onChange={() => {
                                    this.checkBoxSelected(
                                      index,
                                      innerIndex,
                                      el,
                                    );
                                    this.setState({
                                      setFocusToIndex: index,
                                      setFocusToInnerIndex: -1,
                                    });
                                  }}
                                />
                                <CheckBoxSVG />
                              </label>
                              <span>{el.name}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </SimpleBar>
        </div>
      </div>
    );
  }
}
export default DropDownList;
