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
import CheckBoxSVG from '../../svg/CheckBoxSVG';

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
            siteMembers: [],
            selectAllCheckboxChecked: false,
        };
        this.modalWindowRef = null;
        this.membersDropDownRef = null;
        this.removeMember = this.removeMember.bind(this);
        this.renderFullNameColumn = this.renderFullNameColumn.bind(this);
        this.addNewMember = this.addNewMember.bind(this);
        this.addExistingMember = this.addExistingMember.bind(this);
        this.submitMembersToEvent = this.submitMembersToEvent.bind(this);
    }

    componentDidUpdate(){
        if(this.state.siteMembers.length !== this.state.tempMembers.length && this.state.selectAllCheckboxChecked){
            this.setState({selectAllCheckboxChecked: false});
        }
    }
    submitMembersToEvent() {
        this.setState({ loading: true });
        Service.addEventAttendees(this.state.eventId, this.state.tempMembers)
            .then(data => this.setState({ members: data, tempMembers: [], loading: false, addingExistingMembers: false }));
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
                {this.props.editsPermitted !== false &&
                    <button 
                        className='round-button small-round-button light-grey-outline-button' 
                        style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                        onClick={() => this.removeMember(row)}
                    >
                        <CloseUpSVG />
                    </button>
                }
                {this.props.editsPermitted !== false &&
                    <button 
                        className='round-button small-round-button light-grey-outline-button' 
                        style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                        onClick={() => this.editMember()}
                    >
                        <EditUpSVG />
                    </button>
                }
            </li>
        );
    }

    selectAllCheckboxOnChange() {
        let tempMembers = [];
        if(!this.state.selectAllCheckboxChecked) {
            //select all checkboxes
            this.state.siteMembers.forEach(element => tempMembers.push(element.id));
        }
        this.setState({selectAllCheckboxChecked: !this.state.selectAllCheckboxChecked, tempMembers: tempMembers});
    }

    passFocusForward(e) {
        if(!e.shiftKey) {this.okButtonRef.focus()}
        else {this.selectAllCheckboxRef.focus()}
    }

    textPropertyRender(element, textProperty){
        return <div>
            {(element["firstName"] !== undefined || element["lastName"] !== undefined) && <span className='name'>{element["firstName"] + ' ' + element["lastName"]}</span>}
            {element["email"] !== undefined && <span className="email">{element["email"]}</span>}
        </div>
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
                    headerText='Add members'
                    onClose={() => this.setState({ addingExistingMembers: false })}
                >   
                    <div 
                        tabIndex={0} 
                        className='checkBox-wrapper flex-nowrap align-center mb-1'
                        onClick={() => {this.selectAllCheckboxOnChange()}}
                        onKeyDown={(e) => {
                            if(e.keyCode === 32){
                                //SPACE BAR
                                this.selectAllCheckboxOnChange()
                            }
                        }}
                        ref = {el => this.selectAllCheckboxRef = el}
                    >
                        <label>
                            <input 
                                type="checkbox" 
                                checked={this.state.selectAllCheckboxChecked}
                                disabled
                            />
                            <CheckBoxSVG />
                        </label>
                        <span className="checkbox-text">Select All</span>
                    </div>
                    <div style={{"position": "relative", "height": "100%"}}>
                        <MultiDropDown
                            list={this.state.siteMembers}
                            multiSelect={true}
                            toggleable={false}
                            keyProperty='id'
                            textProperty='email'
                            defaultValue={this.state.tempMembers}
                            placeholder="Select from the list"
                            onDropDownValueChange={value => this.setState({ tempMembers: value })}
                            hideHeader = {true}
                            flexibleParent = {true}
                            passFocusForward = {(e) => this.passFocusForward(e)}
                            textPropertyRender = {(element, textProperty) => this.textPropertyRender(element, textProperty)}
                        />
                        <div className='flex-nowrap justify-center' style={{"marginBottom":"-0.5em", "marginTop":"1em"}}>
                            <button 
                                ref = {el => this.okButtonRef = el}
                                className='medium-static-button static-button' 
                                onClick={this.submitMembersToEvent}
                            >
                                OK
                            </button>
                            <button 
                                ref = {el => this.cancelButtonRef = el}
                                className='medium-static-button static-button default-button'
                                onClick={() => this.setState({ addingExistingMembers: false, tempMembers:[] })}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Alert>}
                {members.length === 0 && 
                    <p className='message-block mb-2'>There are no attendees registered for the event.</p>
                }
                {this.props.editsPermitted !== false &&
                    <div className="flex-wrap align-center justify-center mb-2">
                        <p className='input-label'>ADD ATTENDEES:</p>
                        <span>
                            {/*<button disabled className='big-static-button static-button' onClick={this.addNewMember}>Create New</button>*/}
                            <button className='big-static-button static-button' onClick={this.addExistingMember}>Add Members</button>
                        </span>
                    </div>
                }
                {members.length > 0 && <Table columns={columns} data={members} />}
            </div>
        );
    }
}

export default withStore(EventAttendees)
