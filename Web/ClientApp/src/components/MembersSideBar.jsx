import React, { Component } from "react";
import "./Calendar.css";
import { withStore } from "./store";
import MultiDropDown from "./MultiDropDown/MultiDropDown";
import DatePicker from "./DatePicker";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import VolunteerUpSVG from "../svg/VolunteerUpSVG";
import PaddlerUpSVG from "../svg/PaddlerUpSVG";
import SearchInput from "./SearchInput";
import CaregiverUpSVG from "../svg/CaregiverUpSVG";
import CheckBox from "./CheckBox";

class EventsSideBar extends Component {
  static displayName = EventsSideBar.name;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      dateFrom: null,
      dateTo: null,
      role: "",
      zip: "",
      active: true,
    };
    this.simpleBarWrapperRef = null;
    this.dateStartDropDownRef = null;
    this.dateEndDropDownRef = null;
    this.roleDropDownRef = null;
    this.timeoutVar = null;

    this.onTextFilterChange = this.onTextFilterChange.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentWillMount() {
    this.setFilters();
  }

  componentDidMount() {
    //let today = new Date();
    //let state = this.state;
    //state.dateFrom = new Date(today.getFullYear()-60, today.getMonth());
    //state.dateTo = new Date(today.getFullYear()-20, today.getMonth());
    //this.setState({state});
  }

  setFilters(clear = false) {
    let today = new Date();
    let filters = this.props.filters;
    let initialName = clear ? "" : this.props.memberFilter.name;
    let initialRole = clear ? "" : this.props.memberFilter.role;
    let initialDateFrom = clear ? null : this.props.memberFilter.dateFrom;
    let initialDateTo = clear ? null : this.props.memberFilter.dateTo;
    let initialZip = clear ? "" : this.props.memberFilter.zip;
    let initialActive = clear ? true : this.props.memberFilter.active;
    let initialChapters = clear ? [] : this.props.memberFilter.chapter;

    filters.splice(0, filters.length);
    filters.push({ name: "name", value: initialName });
    filters.push({ name: "role", value: initialRole });
    filters.push({ name: "dateFrom", value: initialDateFrom });
    filters.push({ name: "dateTo", value: initialDateTo });
    filters.push({ name: "zip", value: initialZip });
    filters.push({ name: "active", value: initialActive });
    filters.push({ name: "chapters", value: initialChapters });

    let initialState = {
      name: initialName,
      role: initialRole,
      dateFrom: initialDateFrom,
      dateTo: initialDateTo,
      zip: initialZip,
      active: initialActive,
    };
    this.setState(initialState);
    this.props.updateFilters(filters);

    if (clear) {
      this.props.clearMemberFilter();
    }
  }

  updateFilter(filterName, value) {
    let filters = this.props.filters;
    let element = filters.find((element) => element.name === filterName);
    element.value = value;
    this.props.updateFilters(filters);

    let clean = {
      name: filters[0].value,
      role: filters[1].value,
      dateFrom: filters[2].value,
      dateTo: filters[3].value,
      zip: filters[4].value,
      active: filters[5].value,
      chapter: this.props.memberFilter.chapter,
    };
    if (filterName == "chapters") {
      clean.chapter = value;
    }
    this.props.onMemberChange(clean);
  }

  onTextFilterChange(filter, value) {
    clearTimeout(this.timeoutVar);
    let newState = this.state;
    newState[filter] = value;
    this.setState({ newState }, () => {
      this.timeoutVar = setTimeout(() => {
        this.updateFilter(filter, value);
      }, 500);
    });
  }

  render() {
    return (
      <div style={{ height: "100%" }} data-simplebar>
        <div className="mt-1 pl-1 pr-1 filters">
          <div className="flex-nowrap justify-space-between align-end mb-1">
            <h3>Filters</h3>
            <button
              className="round-button medium-round-button grey-outline-button pr-05 pl-05"
              onClick={() => this.setFilters(true)}
            >
              Clear Filters
            </button>
          </div>

          <p>Search:</p>
          <SearchInput
            placeholder="Search"
            /*wrapperClassName = 'm-1'*/
            value={this.state.name}
            onValueChange={(value) => this.onTextFilterChange("name", value)}
            onClearValueButtonClick={() => this.onTextFilterChange("name", "")}
          />
          <span>(search by first OR last name only OR email)</span>
          <CheckBox
            style={{ marginTop: "0.6rem" }}
            onClick={() => {
              this.onTextFilterChange("active", !this.state.active);
            }}
            checked={this.state.active}
            labelClassName="uppercase-text bold-text"
            labelText="Active"
          />
          <p>Chapters:</p>
          <MultiDropDown
            ref={(el) => (this.chaptersDropDownRef = el)}
            list={this.props.store.chapterList}
            multiSelect={true}
            keyProperty="id"
            textProperty="state"
            expandBy="chapters"
            expandedTextProperty="name"
            expandedKeyProperty="id"
            expandedMultiSelect={true}
            defaultValue={
              this.props.memberFilter.chapter
                ? this.props.memberFilter.chapter
                : []
            }
            placeholder="National"
            onDropDownValueChange={(value) =>
              this.updateFilter("chapters", value)
            }
          />

          <p>Type:</p>
          <MultiDropDown
            ref={(el) => (this.roleDropDownRef = el)}
            list={[
              { name: "Veteran", img: <VolunteerUpSVG />, id: 53 },
              { name: "Civilian", img: <PaddlerUpSVG />, id: 54 },
              {
                name: "Veteran Family/Caregiver",
                img: <CaregiverUpSVG />,
                id: 55,
              } /*TODO: icon for veteran family*/,
            ]}
            keyProperty="id"
            textProperty="name"
            defaultValue={this.state.role}
            placeholder="Type"
            onDropDownValueChange={(value) => {
              this.setState({ role: value });
              this.updateFilter("role", value);
            }}
          />

          <p>DOB From:</p>
          <DatePicker
            value={this.state.dateFrom}
            maxDate={this.state.dateTo}
            ref={(el) => (this.dateStartDropDownRef = el)}
            noClearButton={true}
            onSelect={(value) => {
              this.setState({ dateFrom: value });
              this.updateFilter("dateFrom", value);
            }}
          />

          <p>DOB To:</p>
          <DatePicker
            value={this.state.dateTo}
            minDate={this.state.dateFrom}
            ref={(el) => (this.dateEndDropDownRef = el)}
            noClearButton={true}
            onSelect={(value) => {
              this.setState({ dateTo: value });
              this.updateFilter("dateTo", value);
            }}
          />

          <p>Zip:</p>
          <SearchInput
            placeholder="Zip"
            value={this.state.zip}
            onValueChange={(value) => {
              if (/^\d{1,5}(?:[-\s]\d{0,4})?$/.test(value)) {
                this.onTextFilterChange("zip", value);
              }
            }}
            onClearValueButtonClick={() => this.onTextFilterChange("zip", "")}
          />
        </div>
      </div>
    );
  }
}

export default withStore(EventsSideBar);
