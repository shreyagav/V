import React, { Component } from "react";
import CloseUpSVG from "../svg/CloseUpSVG";
import CheckBoxSVG from "../svg/CheckBoxSVG";
import "./Alert.css";
import ExclamationSVG from "../svg/ExclamationSVG";

class Message extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={
          (this.props.mode ? this.props.mode + " " : "") +
          (this.props.propsClass ? this.props.propsClass + " " : "") +
          "message-body"
        }
      >
        {this.props.mode === "error" && (
          <div className="modal-img-wrapper mr-05">
            <CloseUpSVG />
          </div>
        )}
        {this.props.mode === "warning" && (
          <div className="modal-img-wrapper mr-05">
            <ExclamationSVG />
          </div>
        )}
        {this.props.mode === "success" && (
          <div className="modal-img-wrapper mr-05">
            <CheckBoxSVG />
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}

export default Message;
