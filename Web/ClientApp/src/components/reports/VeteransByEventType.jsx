import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { withStore } from '../store';
import { Service } from '../ApiService';
import Loader from '../Loader';
import DatePicker from '../DatePicker';
import SaveToExcelSVG from '../../svg/SaveToExcelSVG'
import { getFirstDayOfMonth, getLastDayOfMonth } from '../dateFunctions'

class EventsByType extends Component {

    constructor(props) {
        super(props);
        var date = new Date(); // ??
        var date2 = new Date(date - 12 * 30 * 24 * 3600 * 1000);  // ????
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
        //this.dateStartDropDownRef = null;
        //this.dateEndDropDownRef = null;
        this.donwloadExcel = this.donwloadExcel.bind(this);
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

    updateData() {
        this.setState({ loading: true });
        Service.getVeteransByEventTypeReport(this.state.range).then(
            data => {
                data.columns.forEach(b => {
                    if (b.key.match(/\d+/) || b.key == 'total') {
                        b.total = 0;
                    }
                })
                data.data.forEach(a => {
                    data.columns.forEach(b => {
                        if (b.key.match(/\d+/) || b.key == 'total') {
                            b.total += a[b.key] ? a[b.key]: 0;
                        }
                    })
                });
                console.log(data.columns);
                var cols = data.columns.map(a => {
                    return {
                        accessor: a.key, Header: (<span style={{ whiteSpace: 'normal' }}>{a.value}: <b>{a.total}</b></span>)
                    };
                });

                this.setState({ loading: false, data: data.data, columns: cols });
            });
    }

    donwloadExcel() {
        this.setState({ loading: true });
        Service.downloadWithPost('/api/Reports/VeteransByEventTypeToExcel', this.state.range).then(blob => {
            Service.throwBlob(blob, 'VeteransByEventType.xlsx');
            this.setState({ loading: false });
        });
    }

    render() {
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
            <h3 className='mr-05 ml-05 mt-2 mb-2 uppercase-text'><strong>Veterans</strong> by Event Type</h3>
            <ReactTable data={this.state.data} columns={this.state.columns} />
        </div>);
    }

}
export default withStore(EventsByType);