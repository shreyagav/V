import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { withStore } from '../store';
import { Service } from '../ApiService';
import Loader from '../Loader';

class VeteransBySite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        Service.getVeteransBySiteReport().then(data => this.setState({ loading: false, data: data }));
    }

    render() {
        const columns = [
            { Header: "Chapter", accessor: 'name', filterable: true },
            { Header: "Count", accessor: 'count', filterable: false },
            { Header: "Attendance", accessor: 'attendance', filterable: false }
        ]
        return (<div>
            {this.state.loading && <Loader/>}
            <h1>Veterans by Site</h1>
            <ReactTable data={this.state.data} columns={columns} />
        </div>);
    }

}
export default withStore(VeteransBySite);