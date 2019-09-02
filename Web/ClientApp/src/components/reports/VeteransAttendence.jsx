import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { withStore } from '../store';
import { Service } from '../ApiService';
import Loader from '../Loader';
import DatePicker from '../DatePicker';

class VeteransAttendence extends Component {

    constructor(props) {
        super(props);
        var date = new Date();
        var date2 = new Date(date - 12 * 30 * 24 * 3600 * 1000);
        this.state = {
            data: [],
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
        Service.getVeteransAttendence(this.state.range).then(data => this.setState({ loading: false, data: data }));
    }

    componentDidMount() {
        this.updateData();
    }
    donwloadExcel() {
        this.setState({ loading: true });
        Service.downloadWithPost('/api/Reports/VeteransAttandanceToExcel', this.state.range).then(blob => {
            Service.throwBlob(blob, 'VeteransAttandance.xlsx');
            this.setState({ loading: false });
        });
    }
    render() {
        const columns = [
            { Header: "First Name", accessor: 'firstName', filterable: true },
            { Header: "Last Name", accessor: 'lastName', filterable: true },
            { Header: "Chapter", accessor: 'chapter', filterable: true },
            { Header: "Address", accessor: 'address', filterable: true },
            { Header: "Zip", accessor: 'zip', filterable: true },
            { Header: "Events Attended", accessor: 'count', filterable: true }
        ]
        return (<div>
            {this.state.loading && <Loader />}
            <h1>Veteran's Attendance by Date Range</h1>
            <span>Date From:</span>
            <div style={{ display: "inline-block", width:"300px" }}>
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
            <ReactTable data={this.state.data} columns={columns} />
        </div>);
    }

}
export default withStore(VeteransAttendence);