import React, { Component } from "react";
import "./TabComponent.css";

class TabComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ul
        className={
          "tab-component" +
          (!this.props.fixedHeight ? " not-shrinkable-font height-auto" : "")
        }
        style={this.props.style}
      >
        {this.props.tabList.map((element, index) => (
          <li
            tabIndex="0"
            key={index}
            className={index === this.props.activeTabIndex ? "selected" : ""}
            onClick={() => this.props.wasSelected(index)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                this.props.wasSelected(index);
              }
            }}
          >
            <p>{element}</p>
          </li>
        ))}
      </ul>
    );
  }
}

export default TabComponent;
