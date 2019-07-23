import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { withStore } from '../store';
import { Service } from '../ApiService';
import Loader from '../Loader';

class EventsByType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns:[],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        Service.getEventsByTypeReport().then(
            data => {
                console.log(data)
                var cols = data.columns.map(a => { return { accessor: a.key, Header: a.value }; });
                this.setState({ loading: false, data: data.data, columns: cols });
            });
    }

    render() {
        return (<div>
            {this.state.loading && <Loader/>}
            <h1>Events by Type</h1>
            <ReactTable data={this.state.data} columns={this.state.columns} />
        </div>);
    }

}
export default withStore(EventsByType);