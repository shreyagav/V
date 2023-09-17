import React, { Component } from "react";
import MultiDropDown from "./MultiDropDown/MultiDropDown";
import { withStore } from "./store";
import { Service } from "./ApiService";
import Table from "./Table";
import { Link } from "react-router-dom";
import Loader from "./Loader";

class NewEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      filters: {
        dateFrom: "",
      },
      loading: false,
    };
    this.chaptersDropDownRef = null;
  }

  componentWillMount() {
    let filters = this.props.filters;
    filters.push({ name: "chapters", value: [] });
    this.props.updateFilters(filters);
  }

  updateList(props) {
    this.setState({ loading: true });
    let actualFilters = {};
    props.filters.forEach((a) => {
      if (Array.isArray(a.value) && a.value.length > 0) {
        actualFilters[a.name] = a.value;
      } else if (typeof a.value == "string" && a.value != "") {
        actualFilters[a.name] = a.value;
      } else if (a.value instanceof Date && !isNaN(a.value.valueOf())) {
        actualFilters[a.name] = a.value.toISOString().slice(0, 10);
      } else if (typeof a.value == "object" && a.value != null) {
        if (a.value.activated) {
          actualFilters[a.name] = a.value;
        }
      } else if (typeof a.value == "number" && a.value != 0) {
        actualFilters[a.name] = a.value;
      }
    });
    Service.getEventsList(actualFilters).then((json) => {
      this.setState({ events: json, loading: false });
    });
  }

  componentWillReceiveProps(props) {
    let temp = JSON.stringify(props.filters);
    if (temp != this.filtersStr) {
      this.filtersStr = temp;
      this.updateList(props);
    }
  }

  componentDidMount() {
    var component = this;
    this.filtersStr = JSON.stringify(this.props.filters);
    this.updateList(this.props);
  }

  renderColumnName(value, row, index, col) {
    return (
      <li
        key={index}
        className={
          col.className ? "table-content " + col.className : "table-content"
        }
        style={{ alignItems: "stretch" }}
      >
        <span style={{ backgroundColor: row["color"] }}></span>
        <Link to={"/event-view/" + row["id"]}>
          <span className="display-flex flex-flow-column flex-nowrap justify-left blue-link link">
            <span style={{ fontSize: "1.1em" }}>{value}</span>
            <span className="chapter">{row["chapter"]}</span>
          </span>
        </Link>
      </li>
    );
  }

  renderColumnTime(value, row, index, col) {
    let newValue = value.split(" ");
    return (
      <li
        key={index}
        className={
          col.className ? "table-content " + col.className : "table-content"
        }
      >
        <span className="table-mini-header">{col.title + ": "}</span>
        <div className="flex-wrap aligh-bottom">
          <span>
            {newValue[0]}
            <small style={{ fontSize: "0.85em" }}>{newValue[1]}</small>
          </span>
          <span style={{ paddingRight: "0.25em", paddingLeft: "0.25em" }}>
            {"-"}
          </span>
          <span>
            {newValue[3]}
            <small style={{ fontSize: "0.85em" }}>{newValue[4]}</small>
          </span>
        </div>
      </li>
    );
  }

  /*
    updateFilter(filterName, value) {
        let filters = this.props.filters;
        let element = filters.find(element => element.name === filterName);
        element.value = value;
        this.props.updateFilters(filters);
    }*/

  render() {
    /*const chapterFilter = this.props.filters.find(element => {
            if (element.name === 'chapters') { return element }
        })*/
    const eventsList = this.state.events;
    const columns = [
      {
        title: "Title",
        accesor: "name",
        className: "borders-when-display-block",
        render: this.renderColumnName,
      },
      { title: "Date", accesor: "date" },
      {
        title: "Time",
        accesor: "time",
        columnMinWidth: "6em",
        render: this.renderColumnTime,
      },
      {
        title: "Type",
        accesor: "type",
        columnMinWidth: "5em",
        className: "word-break",
      },
      { title: "Status", accesor: "status", className: "small-bold" },
    ];
    return (
      <div className="inner-pages-wrapper ipw-1000">
        {this.state.loading && <Loader />}
        <div className="flex-wrap align-center justify-space-between w-100 mb-2">
          <h1 className="uppercase-text">
            <strong>Events </strong>
          </h1>
          <a className="big-static-button static-button" href="/new-event">
            <p>ADD NEW EVENT</p>
          </a>
        </div>
        {/*<div className="label-input-wrapper mb-1">
                    <p>CHAPTER:</p>
                    <MultiDropDown
                        ref={el => this.chaptersDropDownRef = el}
                        list={this.props.store.chapterList}
                        multiSelect={true}
                        keyProperty='id'
                        textProperty='state'
                        expandBy='chapters'
                        expandedTextProperty='name'
                        expandedKeyProperty='id'
                        expandedMultiSelect={true}
                        defaultValue={chapterFilter ? chapterFilter.value : []}
                        placeholder='National'
                        onDropDownValueChange={value => this.updateFilter("chapters", value)}
                    />
                </div>*/}
        {eventsList.length === 1000 && (
          <span style={{ color: "red" }}>
            Refine your search to get less then 1000 events.
          </span>
        )}
        {eventsList.length === 0 && (
          <p className="message-block mt-2">
            There are no events for selected chapters.
          </p>
        )}
        {eventsList.length > 0 && (
          <Table
            columns={columns}
            data={eventsList}
            className={"break-at-500"}
            addHeadersForNarrowScreen={true}
          />
        )}
      </div>
    );
  }
}

export default withStore(NewEvents);
