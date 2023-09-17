import React, { Component } from "react";
import ArrowUpSVG from "../../svg/ArrowUpSVG";
import DropDownList from "./SimpleDropDownList";
import "./SimpleDropDown.css";
import DropDownHeader from "./SimpleDropDownHeader";

export class SimpleDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.dropDownRef = null;
    this.toggleList = this.toggleList.bind(this);

    this.unselect = this.unselect.bind(this);
  }

  toggleList() {
    this.setState({ open: !this.state.open });
  }
  unselect(evt, element) {
    this.props.onChange(
      this.props.selectedValues.filter(
        (a) => a != element[this.props.keyProperty],
      ),
    );
  }

  onSelect() {}

  render() {
    var selectedValues = null;
    var allowMultiple =
      typeof this.props.allowMultiple != undefined
        ? this.props.allowMultiple
        : false;
    var adjustedList = this.props.list;
    if (this.props.allowMultiple === true) {
      if (Array.isArray(this.props.selectedValues)) {
        selectedValues = this.props.list.filter((a) =>
          this.props.selectedValues.includes(a[this.props.keyProperty]),
        );
      } else {
        var found = this.props.list.find(
          (a) => a[this.props.keyProperty] === this.props.selectedValues,
        );
        if (found) selectedValues = [found];
        else selectedValues = [];
      }
      adjustedList = this.props.list.slice(0);
      if (this.props.selectedValues) {
        adjustedList.forEach((e) => {
          if (this.props.selectedValues.includes(e[this.props.keyProperty])) {
            e["checked"] = true;
          }
        });
      }
    } else {
      selectedValues = this.props.list.find(
        (a) => a[this.props.keyProperty] === this.props.selectedValues,
      );
    }
    return (
      <div className="drop-down" ref={(el) => (this.dropDownRef = el)}>
        <DropDownHeader
          toggleable={true}
          onKeyDown={this.props.onKeyDown}
          selectedValue={selectedValues}
          open={this.state.open}
          toggle={this.toggleList}
          allowMultiple={allowMultiple}
          keyProperty={this.props.keyProperty}
          textProperty={this.props.textProperty}
          unselect={this.unselect}
        />
        <DropDownList
          ref={(el) => (this.dropDownListRef = el)}
          toggleable={true}
          onKeyDown={this.props.onKeyDown}
          selectedValues={selectedValues}
          list={adjustedList}
          onChange={this.onChange}
          render={this.props.renderListItem}
          open={this.state.open}
          toggle={this.toggleList}
          allowMultiple={allowMultiple}
          textProperty={this.props.textProperty}
          keyProperty={this.props.keyProperty}
        />
      </div>
    );
  }
}
export default SimpleDropDown;
