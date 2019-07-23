import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ReportsList extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='flex-nowrap flex-flow-column justify-center align-center pr-1 pl-1' >
                <h1 className='uppercase-text mb-2'>Reports</h1>
                <ul>
                    <li><Link to="/Report/Members">Members report</Link></li>
                    <li><Link to="/Report/EventsByType">Events by Type</Link></li>
                    <li><Link to="/Report/VeteransBySite">Veterans by Chapter</Link></li>
                </ul>
            </div>
        );
    }
}