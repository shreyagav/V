import React, { Component } from "react";

class CloseSVG extends React.Component {
  render() {
    return (
      <svg
        style={{ height: "100%" }}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 8 8"
      >
        <polygon
          className="svg"
          points="6.5,0.8 4,3.3 1.5,0.8 0.8,1.5 3.3,4 0.8,6.5 1.5,7.2 4,4.7 6.5,7.2 7.2,6.5 4.7,4 7.2,1.5 "
        />
      </svg>
    );
  }
}

export default CloseSVG;
