import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { withStore } from '../store';
import Alert from '../Alert';
import { Service } from '../ApiService';
import Loader from '../Loader';

class MembersReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        Service.getMembersReport().then(members => {
            console.log(members[0]);
            this.setState({ data: members, loading: false })
        });
        Service.getEventsByTypeReport().then(data => { console.log(data)});
    }

    render() {
        var options = { year: 'numeric', month: 'short', day: 'numeric' };
        const columns = [
            { Header: "First Name", accessor: 'firstName', filterable:true },
            { Header: "Last Name", accessor: 'lastName', filterable: true },
            { Header: "User Name", accessor: 'userName', filterable: true },
            { Header: "Gender", accessor: 'gender', filterable: true },
            { Header: "Email", accessor: 'email', filterable: true },
            { Header: "Phone", accessor: 'phone', filterable: true },
            { Header: "Chapter", accessor: 'chapter', filterable: true },
            { Header: "Joined", accessor: 'joined', filterable: true, Cell: props => <span className='number'>{new Date(props.value).toLocaleString('en-US', options)}</span> },
            { Header: "Options", accessor: 'options', filterable: true, Cell: props => <span className='number'>{props.value.map(a=>a+", ")}</span> },
        ]
        return (<div>
            {this.state.loading && <Loader/>}
            <h1>Members report</h1>
            <ReactTable data={this.state.data} columns={columns} />
        </div>);
    }

}
export default withStore(MembersReport);