import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { withStore } from '../store';
import { Service } from '../ApiService';
import Loader from '../Loader';
import DatePicker from '../DatePicker';

class VeteransBySite extends Component {

    constructor(props) {
        var date = new Date();
        var date2 = new Date(date - 12 * 30 * 24 * 3600 * 1000);
        super(props);
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
        Service.getVeteransBySiteReport(this.state.range).then(data => this.setState({ loading: false, data: data }));
    }

    componentDidMount() {
        this.updateData();
    }
    donwloadExcel() {
        this.setState({ loading: true });
        Service.downloadWithPost('/api/Reports/VeteransBySiteToExcel', this.state.range).then(blob => {
            Service.throwBlob(blob);
            this.setState({ loading: false });
        });
    }

    render() {
        const columns = [
            { Header: "Chapter", accessor: 'name', filterable: true },
            { Header: "Unique", accessor: 'unique', filterable: false },
            { Header: "Attendance", accessor: 'attendance', filterable: false }
        ]
        return (<div>
            {this.state.loading && <Loader/>}
            <h1>Veterans by Site</h1>
            <span>Date From:</span>
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
            <ReactTable data={this.state.data} columns={columns} />
        </div>);
    }

}
export default withStore(VeteransBySite);