import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { withStore } from '../store'
import { Service } from '../ApiService'
import Loader from '../Loader'
import DatePicker from '../DatePicker'
import SaveToExcelSVG from '../../svg/SaveToExcelSVG'
import { getFirstDayOfMonth, getLastDayOfMonth } from '../dateFunctions'

class VeteransAttendence extends Component {

    constructor(props) {
        super(props);
        var date = new Date();
        var date2 = new Date(date - 365 * 24 * 3600 * 1000);
        this.state = {
            data: [],
            loading: false,
            range: {
                start: date2,
                end: date
            }
        }
        this.updateData = this.updateData.bind(this);
        //this.dateStartDropDownRef = null;
        //this.dateEndDropDownRef = null;
        this.donwloadExcel = this.donwloadExcel.bind(this);
    }

    updateData() {
        this.setState({ loading: true });
        Service.getVeteransAttendence(this.state.range).then(data => this.setState({ loading: false, data: data }));
    }

    componentDidMount() {
        let today = new Date();
        let lastYearToday = new Date(today.getFullYear()-1, today.getMonth());
        let range = {
            start: getFirstDayOfMonth(lastYearToday),
            end: getLastDayOfMonth(today)
        }
        this.setState({range: range})
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
        return (
        <div>
            <div className='filter-nav-wrapper'>
                <div className='filter-wrapper'>
                    <div className='flex-nowrap align-center'>
                        <span className='mr-05 uppercase-text'>From:</span>
                        <DatePicker
                            value={this.state.range.start}
                            maxDate={this.state.range.end}
                            noClearButton={true}
                            //ref={el => this.dateStartDropDownRef = el}
                            onSelect={value => {
                                var range = this.state.range;
                                range.start = value;
                                this.setState({ range: range });
                                setTimeout(this.updateData, 50);
                            }}
                        />
                    </div>
                    <div className='flex-nowrap align-center'>
                        <span className='mr-05 uppercase-text'>To:</span>
                        <DatePicker
                            value={this.state.range.end}
                            minDate={this.state.range.start}
                            noClearButton={true}
                            //ref={el => this.dateEndDropDownRef = el}
                            onSelect={value => {
                                var range = this.state.range;
                                range.end = value;
                                this.setState({ range: range });
                                setTimeout(this.updateData, 50);
                            }}
                        />
                    </div>
                </div>
                <button className='round-button medium-round-button outline-on-hover' onClick={this.donwloadExcel} >
                    <SaveToExcelSVG />
                    <span>Excel</span>
                </button>
            </div>
            {this.state.loading && <Loader />}
            <h3 className='mr-05 ml-05 mt-2 mb-2 uppercase-text'><strong>Veteran's Attendance</strong> by Date Range</h3>
            {/*    {this.state.loading && <Loader />}
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
                </div><button onClick={this.donwloadExcel}>Excel</button> */}
            <ReactTable data={this.state.data} columns={columns} />
        </div>);
    }

}
export default withStore(VeteransAttendence);