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
import FixedWrapper from '../FixedWrapper';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import CheckBoxSVG from '../../svg/CheckBoxSVG';
import SearchUpSVG from '../../svg/SearchUpSVG';
import CheckBox from '../CheckBox';

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
            filteredList:[],
            selectAllCheckboxChecked: false,
            activeMembersOnlyChecked: true,
            selectedMembersOnlyChecked: false,
            attendeeFilter: '',
        };
        this.substractHeightElRef = null;
        this.modalWindowRef = null;
        this.membersDropDownRef = null;
        this.filterTimeout = null;
        this.removeMember = this.removeMember.bind(this);
        this.renderFullNameColumn = this.renderFullNameColumn.bind(this);
        this.addNewMember = this.addNewMember.bind(this);
        this.addExistingMember = this.addExistingMember.bind(this);
        this.submitMembersToEvent = this.submitMembersToEvent.bind(this);
        this.filterMemberList = this.filterMemberList.bind(this);
    }

    componentWillMount(){
        this.createFilteredListWithTimeOut();
    }

    submitMembersToEvent() {
        this.setState({ loading: true });
        Service.addEventAttendees(this.state.eventId, this.state.tempMembers)
            .then(data => this.setState({ members: data, tempMembers: [], loading: false, addingExistingMembers: false, attendeeFilter: '' }));
    }

    addNewMember() {}

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

    createFilteredListWithTimeOut(){
        this.timeoutVar = setTimeout(() => {this.filterMemberList(this.state.siteMembers, this.state.attendeeFilter)}, 150);
    }

    filterMemberList = (list, filter) => {
        /* check if element meets criteria */
        let checkIfElementMeetsCriteria = (el, filterList) => {
            let meetsCriteria = true;
            filterList.forEach(elFilter => {
                if (!(el.firstName.toLowerCase().includes(elFilter) || el.lastName.toLowerCase().includes(elFilter) || el.email.toLowerCase().includes(elFilter) || el.phone.toLowerCase().includes(elFilter))){
                    meetsCriteria = false;
                }
            })
            return meetsCriteria;
        }
        /* remove all " " at the beginning and double ' ' inside the filter expression if they are there */
        filter = filter.replace(/\,+/g, ' ');
        filter = filter.toLowerCase().replace(/\s+/g, ' ');
        /* create an array of filters*/
        let filterList = [];
        if (filter !== '') { filterList = filter.split(" ")} 
        else filterList = filter;
        /* filter */
        let filteredList = [];
        list.forEach(element => {
            if(((filterList.length > 0 && checkIfElementMeetsCriteria(element, filterList)) || filterList === '') &&
                (this.state.activeMembersOnlyChecked === false || (this.state.activeMembersOnlyChecked === true && element.active === true)) &&
                (this.state.selectedMembersOnlyChecked === false || (
                    this.state.selectedMembersOnlyChecked === true && this.state.tempMembers.indexOf(element.id) > -1))
            ){filteredList.push(element)}
        })
        this.setState({filteredList: filteredList})
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

    passFocusForward(e) {   // ?????????????
        if(!e.shiftKey) {this.okButtonRef.focus()}
        else {this.selectAllCheckboxRef.focus()}
    }

    textPropertyRender(element, textProperty){
        return <div>
            {(element["firstName"] !== undefined || element["lastName"] !== undefined) && <span className='name'>{element["firstName"] + ' ' + element["lastName"]}</span>}
            {element["email"] !== undefined && <span className="email">{element["email"]}</span>}
        </div>
    }

    onAddExistingMembersWindowClose() {
        this.setState({ addingExistingMembers: false, attendeeFilter: ''})
    }

    render() {
        const members = this.state.members;
        const columns=[
            {title:"Attendee", accesor:"name", className:"borders-when-display-block", render: this.renderFullNameColumn},
            {title:"Phone", accesor:"phone"},
            {title:"Email", accesor:"email", className:'word-break'}
        ];
        this.filteredList = this.state.filteredList;
        console.log("TEMP MEMBERS");
        console.log(this.state.tempMembers);
        console.log("SITE MEMBERS");
        console.log(this.state.siteMembers);
        return (
            <div style={{ "width": "100%", "maxWidth": "600px" }}>
                {this.state.loading && <Loader />}
                {this.state.addingExistingMembers &&
                    <FixedWrapper maxWidth={"600px"}>
                        <h2 className='m-1 mr-05 ml-05'>Add Members</h2>
                        <div className='input-button-wrapper mb-1 mr-05 ml-05'>
                            <input 
                                style={{"paddingLeft":"2.5rem"}}
                                placeholder='Search members'
                                value={this.state.attendeeFilter}
                                onChange={(e) => {
                                    clearTimeout(this.timeoutVar);
                                    this.setState({
                                        attendeeFilter: e.target.value,
                                        //selectAllCheckboxChecked: false,
                                        //tempMembers: [],
                                    }, this.createFilteredListWithTimeOut());
                                }}
                            />
                            <SearchUpSVG svgClassName='icon'/>
                            <button onClick={() => this.setState({attendeeFilter: ''})}>
                                <CloseUpSVG />
                            </button>
                        </div>
                        <div className='flex-wrap justify-space-between align-center mr-05 ml-05'>
                            <CheckBox 
                                className='mr-1 mb-1 ml-025' 
                                onClick={() => {
                                    clearTimeout(this.timeoutVar); // ????
                                    let members = [];
                                    if(!this.state.selectAllCheckboxChecked) {
                                        this.state.filteredList.forEach(element => {members.push(element.id)})
                                    }
                                    this.setState({
                                        tempMembers: members, 
                                        selectAllCheckboxChecked: !this.state.selectAllCheckboxChecked
                                    }, this.createFilteredListWithTimeOut());
                                }}
                                checked={this.state.selectAllCheckboxChecked}
                                labelStyle={{"fontSize":"0.9rem"}}
                                labelText={<span>Select All<strong>{" "+ this.filteredList.length.toString()}</strong></span>}
                            />
                            <div className='flex-wrap justify-left'>
                                <CheckBox 
                                    className='mr-1 mb-1 ml-025' 
                                    onClick={() => {
                                        clearTimeout(this.timeoutVar);
                                        this.setState({
                                            activeMembersOnlyChecked: !this.state.activeMembersOnlyChecked,
                                            selectAllCheckboxChecked: false,
                                            //tempMembers: [],
                                        }, this.createFilteredListWithTimeOut())
                                    }}
                                    checked={this.state.activeMembersOnlyChecked}
                                    labelStyle={{"fontSize":"0.9rem"}}
                                    labelText='Active Members Only'
                                />
                                <CheckBox
                                    className='mb-1 ml-025'
                                    onClick={() => {
                                        clearTimeout(this.timeoutVar);
                                        this.setState({
                                            selectedMembersOnlyChecked: !this.state.selectedMembersOnlyChecked
                                        }, this.createFilteredListWithTimeOut())
                                    }}
                                    checked={this.state.selectedMembersOnlyChecked}
                                    labelStyle={{"fontSize":"0.9rem"}}
                                    labelText={<span>Selected Only<strong>{" "+ this.state.tempMembers.length.toString()}</strong></span>}
                                />
                            </div>
                        </div>
                        {this.filteredList.length === 0 && <p className='message-block mb-2 mt-2'>There are no members that meet this criteria.</p>}
                        {this.filteredList.length > 0 &&
                            <MultiDropDown
                                list={this.filteredList}
                                multiSelect={true}
                                toggleable={false}
                                keyProperty='id'
                                textProperty='email'
                                defaultValue={this.state.tempMembers}
                                placeholder="Select from the list"
                                onDropDownValueChange={value => this.setState({ tempMembers: value })}
                                hideHeader = {true}
                                substractHeight = {80}
                                passFocusForward = {(e) => this.passFocusForward(e)}
                                textPropertyRender = {(element, textProperty) => this.textPropertyRender(element, textProperty)}
                            />
                        }
                        <div className='flex-nowrap justify-center mt-05 mb-05 mr-1 ml-1'>
                            <button ref = {el => this.okButtonRef = el} className='medium-static-button static-button' onClick={this.submitMembersToEvent}>OK</button>
                            <button ref = {el => this.cancelButtonRef = el} className='medium-static-button static-button default-button' onClick={() => this.setState({ addingExistingMembers: false, tempMembers:[], attendeeFilter: '' })}> Cancel </button>
                        </div>
                    </FixedWrapper>
                }
                {members.length === 0 && <p className='message-block mb-2'>There are no attendees registered for the event.</p>}
                {this.props.editsPermitted !== false &&
                    <div className="flex-wrap align-center justify-center mb-2">
                        <p className='input-label'>ADD ATTENDEES:</p>
                        <span>
                            {/*<button disabled className='big-static-button static-button' onClick={this.addNewMember}>Create New</button>*/}
                            <button className='big-static-button static-button' onClick={this.addExistingMember}>Add Members</button>
                        </span>
                    </div>
                }
                {members.length > 0 && <Table columns={columns} data={members} className={"break-at-500"} addHeadersForNarrowScreen={true}/>}
            </div>
        );
    }
}

export default withStore(EventAttendees)
