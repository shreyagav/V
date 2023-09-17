import React, { Component } from "react";

export default class ComingSoon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="flex-nowrap flex-flow-column justify-center align-center pr-1 pl-1">
        <h1 className="uppercase-text mb-2">
          Coming<strong> SOON</strong>
        </h1>
      </div>
    );
  }
}
