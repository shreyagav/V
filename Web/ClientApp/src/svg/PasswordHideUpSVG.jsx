import React, { Component } from "react";

class PasswordHideUpSVG extends React.Component {
  render() {
    return (
      <svg
        className={"svg-container " + this.props.svgClassName}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 24 24"
      >
        <path
          className="svg"
          d="M0.4,12.6c-0.2-0.3-0.3-0.8,0-1.1c2.4-3.9,7-6.4,11.9-6.4c0,0,0,0,0,0c0.7,0,1.5,0.1,2.2,0.2l-1.8,1.8
	c-0.1,0-0.2,0-0.4,0c0,0,0,0,0,0C8.3,7.1,4.5,9,2.4,12c0.8,1,1.8,1.9,2.8,2.6l-1.4,1.4C2.5,15.1,1.4,14,0.4,12.6z M23.7,12.6
	c-2.3,3.8-6.3,6.1-10.8,6.3c-0.2,0-0.4,0-0.6,0c-1.6,0-3.2-0.3-4.8-0.9l-5.3,5.4c-0.2,0.2-0.5,0.3-0.7,0.3c-0.3,0-0.5-0.1-0.7-0.3
	c-0.4-0.4-0.4-1,0-1.4L21.8,0.6c0.4-0.4,1-0.4,1.4,0c0.4,0.4,0.4,1,0,1.4l-4.7,4.7c2,1.1,3.8,2.7,5.1,4.8
	C23.9,11.8,23.9,12.2,23.7,12.6z M21.7,12c-1.2-1.7-2.7-3-4.5-3.8l-2.1,2.1c0.3,0.5,0.4,1.1,0.4,1.7c0,1.9-1.6,3.5-3.5,3.5
	c-0.6,0-1.1-0.2-1.6-0.4L9,16.4c1.2,0.3,2.4,0.5,3.7,0.4C16.4,16.7,19.7,14.9,21.7,12z"
        />
      </svg>
    );
  }
}

export default PasswordHideUpSVG;
