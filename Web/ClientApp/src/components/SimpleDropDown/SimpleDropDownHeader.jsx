import React, { Component } from "react";
import ArrowUpSVG from "../../svg/ArrowUpSVG";
import CloseSVG from "../../svg/CloseSVG";

class DropDownHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.headerRef = null;
    this.dropDownHeaderRef = null;
  }

  headerClickHandler(e) {
    if (e.target === this.headerRef) {
      this.props.toggle();
    }
  }

  headerKeyDownHandler(e, element) {
    switch (e.keyCode) {
      case 13: //enter
        if (e.target.className === "unselectButton") {
          this.props.dropDownStore.unselect(e, element);
        }
        if (e.target.className === "drop-down-header") {
          this.props.dropDownStore.toggle();
        }
        this.dropDownHeaderRef.focus();
        break;
      case 27: //ESC
        if (this.state.isOpen) {
          this.props.dropDownStore.toggle();
          this.dropDownHeaderRef.focus();
        }
        break;
      case 38: //Up Arrow
        e.preventDefault();
        if (!this.state.isOpen) {
          this.props.dropDownStore.toggle();
        }
        break;
      case 40: //Down Arrow
        e.preventDefault();
        if (!this.state.isOpen) {
          this.props.dropDownStore.toggle();
        }
        break;
      default:
        break;
    }
  }

  render() {
    let style = {};
    if (this.props.toggleable) {
      if (this.props.open) {
        style = { border: "1px solid #0099cc" };
      }
    } else {
      style = { border: "0px solid" };
    }
    return (
      <div
        ref={(el) => (this.dropDownHeaderRef = el)}
        tabIndex={this.props.toggleable ? "0" : "-1"}
        className="drop-down-header"
        style={style}
        onClick={() => this.props.toggle()}
        onKeyDown={(e) => this.headerKeyDownHandler(e)}
      >
        <ul
          ref={(e) => (this.headerRef = e)}
          onClick={(e) => this.headerClickHandler(e)}
          className={
            this.props.allowMultiple ? "multi-level-list" : "simple-list"
          }
        >
          {Array.isArray(this.props.selectedValue) &&
            this.props.selectedValue.map((element) => (
              <li key={element[this.props.keyProperty]}>
                {this.props.renderSelectedItem ? (
                  this.props.renderSelectedItem(
                    element,
                    this.props.keyProperty,
                    this.props.textProperty,
                  )
                ) : (
                  <span>{element[this.props.textProperty]}</span>
                )}
                <button
                  className="unselectButton"
                  onClick={(e) => this.props.unselect(e, element)}
                  onKeyDown={(e) => this.headerKeyDownHandler(e, element)}
                >
                  <CloseSVG />
                </button>
              </li>
            ))}

          {typeof this.props.selectedValue == "object" &&
            !Array.isArray(this.props.selectedValue) && (
              <li className={this.props.allowMultiple ? "inverted" : ""}>
                {this.props.renderSelectedItem ? (
                  this.props.renderSelectedItem(
                    this.props.selectedValue,
                    this.props.keyProperty,
                    this.props.textProperty,
                  )
                ) : (
                  <span>
                    {this.props.selectedValue[this.props.textProperty]}
                  </span>
                )}
              </li>
            )}
        </ul>
        {this.props.toggleable && (
          <button disabled className="arrow-button">
            <ArrowUpSVG svgClassName={this.props.open ? "flip90" : "flip270"} />
          </button>
        )}
      </div>
    );
  }
}
export default DropDownHeader;
