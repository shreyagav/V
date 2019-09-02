import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { withStore } from '../store';
import { Service } from '../ApiService';
import Loader from '../Loader';
import DatePicker from '../DatePicker';

class EventsByType extends Component {

    constructor(props) {
        super(props);
        var date = new Date();
        var date2 = new Date(date - 12 * 30 * 24 * 3600 * 1000);
        this.state = {
            data: [],
            columns:[],
            loading: false,
            range: {
                start: date2,
                end: date
            }
        }
        this.updateData = this.updateData.bind(this);
        this.dateStartDropDownRef = null;
        this.dateEndDropDownRef = null;
        this.donwloadExcel = this.donwloadExcel.bind(this);
    }
    updateData() {
        this.setState({ loading: true });
        Service.getEventsByTypeReport(this.state.range).then(
            data => {
                var cols = data.columns.map(a => { return { accessor: a.key, Header: a.value }; });
                this.setState({ loading: false, data: data.data, columns: cols });
            });
    }

    componentDidMount() {
        this.updateData();
    }
    donwloadExcel() {
        this.setState({ loading: true });
        Service.downloadWithPost('/api/Reports/EventsByTypeToExcel', this.state.range).then(blob => {
            Service.throwBlob(blob, 'EventsByType.xlsx');
            this.setState({ loading: false });
        });
    }

    render() {
        return (<div>
            {this.state.loading && <Loader />}
            <h1>Events by Type</h1><span>Date From:</span>
            <div style={{ display: "inline-block", width: "300px" }}>
                <DatePicker
                    value={this.state.range.start}
                    maxDate={this.state.range.end}
                    ref={el => this.dateStartDropDownRef = el}
                    onSelect={value => {
                        var range = this.state.range;
                        range.start = value;
                        this.setState({ range: range });
                        setTimeout(this.updateData, 50);
                    }}
                />
            </div>
            <span>Date To:</span>
            <div style={{ display: "inline-block", width: "300px" }}>
                <DatePicker
                    value={this.state.range.end}
                    minDate={this.state.range.start}
                    ref={el => this.dateEndDropDownRef = el}
                    onSelect={value => {
                        var range = this.state.range;
                        range.end = value;
                        this.setState({ range: range });
                        setTimeout(this.updateData, 50);
                    }}
                />
            </div><button onClick={this.donwloadExcel}>Excel</button>
            <ReactTable data={this.state.data} columns={this.state.columns} />
        </div>);
    }

}
export default withStore(EventsByType);