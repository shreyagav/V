import React, { Component } from "react";
import CheckBoxSVG from "../svg/CheckBoxSVG";

class CheckBox extends Component {
  render() {
    return (
      <div
        tabIndex={0}
        style={this.props.style}
        /*className = {this.props.className ? this.props.className + ' checkBox-wrapper' : 'checkBox-wrapper'} */
        className={
          this.props.className
            ? this.props.className + " checkBox-wrapper"
            : "checkBox-wrapper"
        }
        onClick={this.props.onClick}
        onKeyDown={(e) => {
          /* SPACE BAR */ if (e.keyCode === 32) {
            this.props.onClick();
            e.preventDefault();
          }
        }}
      >
        <label>
          <input type="checkbox" disabled checked={this.props.checked} />
          <CheckBoxSVG />
        </label>
        <span
          className={this.props.labelClassName}
          style={this.props.labelStyle}
        >
          {this.props.labelText}
        </span>
      </div>
    );
  }
}

export default CheckBox;
