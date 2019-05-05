//import { Route, Router, history } from 'react-router';
import { Route, Router, BrowserRouter, Switch } from 'react-router-dom';
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG';
import EditUpSVG from '../../svg/EditUpSVG';
import Table from '../Table';
import VolunteerUpSVG from '../../svg/VolunteerUpSVG';
import VeteranUpSVG from '../../svg/VeteranUpSVG';
import Loader from '../Loader';

class EventAttendees extends Component {
    static displayName = EventAttendees.name;

    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId,
            members: [],
            loadData: false
        };
        this.removeMember = this.removeMember.bind(this);
    }
    componentDidMount() {
        var component = this;
        this.setState({ loadData: true });
        fetch('/Members.json')
            .then(function (data) { return data.json(); })
            .then(function (jjson) {
                component.setState({ members: jjson});
            })
            .then(function () {
                setTimeout(() => component.setState({loadData: false}), 1500)
            });
    }

    removeMember() {
        alert("remove this member");
    }

    editMember() {
        alert("edit this member");
    }

    renderFullNameColumn(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span style={{"flex":"0 0 auto","height":"1.2rem"}}>
                    {row['role'] === 'VET' ? <VeteranUpSVG /> : <VolunteerUpSVG />}
                </span>
                <span style={{"flex":"1 1 auto"}} className="big-bold">{row['firstName'] + ' ' + row['lastName']}</span>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.removeMember()}
                >
                    <CloseUpSVG />
                </button>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.editMember()}
                >
                    <EditUpSVG />
                </button>
            </li>
        );
    }

    render() {
        const members = this.state.members;
        const columns=[
            {title:"Attendee", accesor:"name", className:"borders-when-display-block", render: this.renderFullNameColumn},
            {title:"Phone", accesor:"phone"},
            {title:"Email", accesor:"email", className:'word-break'}
        ];
        if (this.state.loadData) {
            return (
                <Loader />
            )
        }
        else 
        return (
            <div style={{ "width": "100%", "maxWidth": "600px" }}>
                <div className="flex-wrap align-center justify-center mt-2 mb-2">
                    <p className='input-label'>ADD ATTENDEES:</p>
                    <span>
                        <button disabled className='big-static-button static-button' >Create New</button>
                        <button disabled className='big-static-button static-button' >Add Member</button>
                    </span>
                </div>
                <Table columns={columns} data={members} />
            </div>
        );
    }
}

export default withStore(EventAttendees)
