import React, { Component } from "react";

class SearchUpSVG extends React.Component {
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
          d="M23.5,20.3L17.2,14c0,0-0.1-0.1-0.1-0.1c0.8-1.4,1.3-3,1.3-4.7c0-5.1-4.1-9.2-9.2-9.2s-9.2,4.1-9.2,9.2
	c0,5.1,4.1,9.2,9.2,9.2c1.8,0,3.5-0.5,5-1.4c0,0,0,0,0.1,0.1l6.3,6.3c0.8,0.8,2.2,0.8,3.1,0l0,0C24.3,22.5,24.3,21.1,23.5,20.3z
	 M2.5,9.2c0-3.7,3-6.7,6.7-6.7s6.7,3,6.7,6.7c0,3.7-3,6.7-6.7,6.7S2.5,12.9,2.5,9.2z"
        />
      </svg>
    );
  }
}

export default SearchUpSVG;
