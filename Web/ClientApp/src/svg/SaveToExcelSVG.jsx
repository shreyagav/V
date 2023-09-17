import React, { Component } from "react";

class SaveToExcelSVG extends React.Component {
  render() {
    return (
      <svg
        className={
          "svg-container" + this.props.svgClassName
            ? " " + this.props.svgClassName
            : ""
        }
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 16 16"
      >
        <path
          className="svg"
          style={{ fill: "#666666" }}
          d="M8.6,3c0,0.4-0.4,0.8-0.8,0.8S7,3.4,7,3s0.4-0.8,0.8-0.8S8.6,2.5,8.6,3z M11.2,3c0,0.4-0.4,0.8-0.8,0.8
                        S9.6,3.4,9.6,3s0.4-0.8,0.8-0.8S11.2,2.5,11.2,3z M13.7,3c0,0.4-0.4,0.8-0.8,0.8c-0.4,0-0.8-0.4-0.8-0.8s0.4-0.8,0.8-0.8
                        C13.4,2.2,13.7,2.5,13.7,3z M15.5,0h-4.3H2.6C2.3,0,2,0.2,2,0.5v2.7c0,0.3,0.2,0.5,0.5,0.5s0.5-0.2,0.5-0.5V1.1h8.1h3.7v3.7v8.1
                        h-2.2c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h2.7c0.3,0,0.5-0.2,0.5-0.5V4.8V0.5C16,0.2,15.8,0,15.5,0z"
        />
        <path
          className="svg"
          style={{ fill: "#08743B" }}
          d="M0,4.4V16h11.6V4.4H0z M7,13.1l-1.3-1.7l-1.3,1.7H2.6l2.2-3l-2-2.7h2l1,1.3l1-1.3h2l-2,2.7l2.2,3H7z"
        />
      </svg>
    );
  }
}

export default SaveToExcelSVG;
