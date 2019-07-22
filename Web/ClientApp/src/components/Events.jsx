import React, { Component } from 'react';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';
import { Link } from 'react-router-dom';

class NewEvents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            filters: {
                dateFrom: '',
            }
        };
        this.chaptersDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        document.addEventListener("mousedown", this.handleClick, false);
        let filters = this.props.filters;
        filters.push({ name: "chapters", value: [] });
        this.props.updateFilters(filters);
    }
    componentWillUnmount() { document.removeEventListener("mousedown", this.handleClick, false); }

    updateList(props) {
        let actualFilters = {};
        props.filters.forEach(a => {
            if (Array.isArray(a.value) && a.value.length > 0) {
                actualFilters[a.name] = a.value;
            } else if (typeof (a.value) == "string" && a.value != "") {
                actualFilters[a.name] = a.value;
            } else if (a.value instanceof Date && !isNaN(a.value.valueOf())) {
                actualFilters[a.name] = a.value.toISOString().slice(0, 10);
            } else if (typeof (a.value) == "object" && a.value != null) {
                if (a.value.activated) {
                    actualFilters[a.name] = a.value;
                }
            }
        });
        console.log(actualFilters);
        Service.getEventsList(actualFilters).then(json => { this.setState({ events: json }); });
    }

    componentWillReceiveProps(props) {
        let temp = JSON.stringify(props.filters);
        if (temp != this.filtersStr) {
            console.log("update");
            this.filtersStr = temp;
            this.updateList(props);
        }
    }

    componentDidMount() {
        var component = this;
        this.filtersStr = JSON.stringify(this.props.filters);
        this.updateList(this.props);
    }

    handleClick(e) {
        if (this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.dropDownRef.contains(e.target)) {
            this.chaptersDropDownRef.toggle();
        }
    }

    renderColumnName(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{ "alignItems": "stretch" }}>
                <span style={{ 'backgroundColor': row['color'] }}></span>
                <Link to={"/event-view/" + row["id"]}>
                    <span className="display-flex flex-flow-column flex-nowrap justify-left blue-link link">
                        <span style={{ "fontSize": "1.1em" }}>{value}</span>
                        <span className='chapter'>{row['chapter']}</span>
                    </span>
                </Link>
            </li>
        );
    }

    updateFilter(filterName, value) {
        let filters = this.props.filters;
        let element = filters.find(element => element.name === filterName);
        element.value = value;
        this.props.updateFilters(filters);
    }

    render() {
        const chapterFilter = this.props.filters.find(element => {
            if (element.name === 'chapters') { return element }
        })
        const eventsList = this.state.events;
        const columns = [
            { title: "Title", accesor: "name", className: "borders-when-display-block", render: this.renderColumnName },
            { title: "Date", accesor: "date" },
            { title: "Time", accesor: "time", columnMinWidth: '6em' },
            { title: "Type of event", accesor: "type", columnMinWidth: '5em', className: 'word-break' },
            { title: "Status", accesor: "status", className: "small-bold" }
        ];
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 mediaMin500-pl-pr-025' style={{ "maxWidth": "900px" }}>
                <div className="flex-wrap align-center justify-space-between w-100 mb-2 mediaMax500-pl-pr-025">
                    <h1 className='uppercase-text'><strong>Events </strong></h1>
                    <a className='big-static-button static-button' href="/new-event"><p>ADD NEW EVENT</p></a>
                </div>
                <div className="label-input-wrapper mediaMax500-pl-pr-025">
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
                </div>
                {eventsList.length > 0 &&
                    <Table columns={columns} data={eventsList} className={"break-at-700"} addHeadersForNarrowScreen={true} />
                }
                {eventsList.length === 0 && 
                    <p className='message-block mt-2'>There are no events for selected chapters.</p>
                }
            </div>
        );
    }
}

export default withStore(NewEvents);