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
import { Service } from '../ApiService';
import Alert from '../Alert';
import MultiDropDown from '../MultiDropDown/MultiDropDown';

class EventAttendees extends Component {
    static displayName = EventAttendees.name;

    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId,
            members: props.attendees,
            loading: false,
            addingExistingMembers: false,
            tempMembers:[],
            siteMembers: []
        };
        this.modalWindowRef = null;
        this.membersDropDownRef = null;
        this.removeMember = this.removeMember.bind(this);
        this.renderFullNameColumn = this.renderFullNameColumn.bind(this);
        this.addNewMember = this.addNewMember.bind(this);
        this.addExistingMember = this.addExistingMember.bind(this);
        
    }
    addNewMember() {

    }
    addExistingMember() {
        this.setState({ loading: true });
        Service.getSiteMembers(this.state.eventId)
            .then(data => { this.setState({ siteMembers: data, loading: false, addingExistingMembers: true }) });
    }
    removeMember(member) {
        var me = this;
        this.setState({ loading: true })
        Service.removeEventAttendee(this.state.eventId, member)
            .then(data => {
                setTimeout(() => {
                    me.setState({ members: data, loading: false });
                }, 1000);
            });
    }

    editMember() {
        alert("edit this member");
    }

    renderFullNameColumn(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span style={{"flex":"0 0 auto","height":"1.2rem"}}>
                    {row['memberTypeId'] === '1' ? <VeteranUpSVG /> : <VolunteerUpSVG />}
                </span>
                <span style={{"flex":"1 1 auto"}} className="big-bold">{row['firstName'] + ' ' + row['lastName']}</span>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.removeMember(row)}
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

        return (
            <div style={{ "width": "100%", "maxWidth": "600px" }}>
                {this.state.loading && <Loader />}
                {this.state.addingExistingMembers &&
                <Alert
                    ref = {el => this.modalWindowRef = el}
                    headerText='Add existing members'
                    onClose={() => this.setState({ addingExistingMembers: false })}
                    showOkCancelButtons = {true}
                    onOkButtonClick={() => this.setState({ addingExistingMembers: false })}
                    onCancelButtonClick={() => this.setState({ addingExistingMembers: false })}
                >
                    <div style={{"position": "relative", "height": "100%"}}>
                        <MultiDropDown
                            list={this.state.siteMembers}
                            multiSelect={true}
                            toggleable={false}
                            keyProperty='id'
                            textProperty='email'
                            defaultValue={this.state.tempMembers}
                            placeholder="Select members"
                            onDropDownValueChange={value => this.setState({ tempMembers: value })}
                            flexibleParentHeight = {this.modalWindowRef}
                        />
                    </div>
                </Alert>}
                <div className="flex-wrap align-center justify-center mt-2 mb-2">
                    <p className='input-label'>ADD ATTENDEES:</p>
                    <span>
                        <button disabled className='big-static-button static-button' onClick={this.addNewMember}>Create New</button>
                        <button className='big-static-button static-button' onClick={this.addExistingMember}>Add Member</button>
                    </span>
                </div>
                <Table columns={columns} data={members} />
            </div>
        );
    }
}

export default withStore(EventAttendees)
