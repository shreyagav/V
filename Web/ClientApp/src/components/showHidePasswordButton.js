import React from "react";
import PasswordShowUpSVG from "../svg/PasswordShowUpSVG";
import PasswordHideUpSVG from "../svg/PasswordHideUpSVG";

const showHidePasswordButton = (props) => {
  return (
    <button onClick={props.onClick}>
      <PasswordShowUpSVG
        svgClassName={props.show === true ? "display-flex" : "display-none"}
      />
      <PasswordHideUpSVG
        svgClassName={props.show === false ? "display-flex" : "display-none"}
      />
    </button>
  );
};

export default showHidePasswordButton;
