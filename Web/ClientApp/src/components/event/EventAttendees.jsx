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
    }
    /*
    componentDidUpdate(){
        if(this.state.filteredMembers.length !== this.state.tempMembers.length && this.state.selectAllCheckboxChecked){
            this.setState({selectAllCheckboxChecked: false});
        }
    } */

    submitMembersToEvent() {
        this.setState({ loading: true });
        Service.addEventAttendees(this.state.eventId, this.state.tempMembers)
            .then(data => this.setState({ members: data, tempMembers: [], loading: false, addingExistingMembers: false, attendeeFilter: '' }));
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

    filterMemberList = (list, filter) => {
        let filteredList = [];
        /* remove all " " at the beginning and double ' ' inside the filter expression if they are there */
        filter = filter.replace(/\,+/g, ' ');
        filter = filter.toLowerCase().replace(/\s+/g, ' ');
        if (filter !== '') {
            let filterList = [];
            for(let i=0; i < list.length; i++){
                /* create an array of filters*/
                if (filter.indexOf(" ") > -1) {
                    filterList = filter.split(" ");
                } else {
                    filterList.push(filter);
                }
            }
            /* check if filter criteria were met */
            for (let j=0; j < list.length; j++){
                //if(j===1115){debugger}
                let filterCriteriaWereMet = true;
                for (let i=0; i < filterList.length; i++){
                    if(!(list[j].firstName.toLowerCase().includes(filterList[i]) || list[j].lastName.toLowerCase().includes(filterList[i]) || list[j].email.toLowerCase().includes(filterList[i]) || list[j].phone.toLowerCase().includes(filterList[i]))){
                        filterCriteriaWereMet = false;
                    }
                }
                /* end of check if filter criteria were met */
                if (filterCriteriaWereMet) {
                    filteredList.push(list[j]);
                }
            }
        } else {
            filteredList = list;
        }
        return filteredList;
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
        let list = this.createFilteredList(this.state.siteMembers);
        if(!this.state.selectAllCheckboxChecked) {
            //select all checkboxes
            list.forEach(element => tempMembers.push(element.id));
        }
        else {
            if (list.length === this.state.siteMembers.length){
                tempMembers = [];
            }
            else{
                let search = (element, list, keyProperty) => {
                    let wasFound = list.find(listElement => listElement[keyProperty] === element);
                    if (wasFound > -1) {return true}
                    return false;
                }
                //unselect all checkboxes
                tempMembers.filter(element => search(element, list, this.props.keyProperty));
            }
        }
        this.setState({selectAllCheckboxChecked: !this.state.selectAllCheckboxChecked, tempMembers: tempMembers});
    }

    filterShowSelectedMembersOnly(list, filterList) {
        // show only members which were selected
        let filteredList = [];
        filterList.forEach(element => {
            list.forEach(subElement => {
                if( element === subElement.id ){
                    filteredList.push(subElement);
                }
            })
        });
        return filteredList;
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

    onAddExistingMembersWindowClose() {
        this.setState({ addingExistingMembers: false, attendeeFilter: ''})
    }

    createFilteredList(list) {
        let filteredList = list;
        if (this.state.attendeeFilter !== ''){ filteredList = this.filterMemberList( filteredList, this.state.attendeeFilter ) }
        if (this.state.activeMembersOnlyChecked) { /* filter for active members */ }
        if (this.state.selectedMembersOnlyChecked){ filteredList = this.filterShowSelectedMembersOnly( filteredList, this.state.tempMembers ) }
        return filteredList;
    }

    render() {
        const members = this.state.members;
        const columns=[
            {title:"Attendee", accesor:"name", className:"borders-when-display-block", render: this.renderFullNameColumn},
            {title:"Phone", accesor:"phone"},
            {title:"Email", accesor:"email", className:'word-break'}
        ];
        if (this.state.addingExistingMembers) {
            this.filteredList = this.createFilteredList(this.state.siteMembers);
        }
        console.log("TEMP MEMBERS");
        console.log(this.state.tempMembers);
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
                                    if (this.state.selectAllCheckboxChecked) {
                                        this.selectAllCheckboxOnChange()
                                    }; 
                                    this.setState({attendeeFilter: e.target.value})}
                                }
                            />
                            <SearchUpSVG svgClassName='icon'/>
                            <button onClick={() => this.setState({attendeeFilter: ''})}>
                                <CloseUpSVG />
                            </button>
                        </div>
                        <div className='flex-wrap justify-space-between align-center mr-05 ml-05'>
                            <CheckBox 
                                className='mr-1 mb-1 ml-025' 
                                onClick={() => this.selectAllCheckboxOnChange()}
                                checked={this.state.selectAllCheckboxChecked}
                                labelStyle={{"fontSize":"0.9rem"}}
                                labelText={<span>Select All<strong>{" "+ this.filteredList.length.toString()}</strong></span>}
                            />
                            <div className='flex-wrap justify-left'>
                                <CheckBox 
                                    className='mr-1 mb-1 ml-025' 
                                    onClick={() => {
                                        if (this.state.selectAllCheckboxChecked) {
                                            this.selectAllCheckboxOnChange()
                                        };
                                        //let tempMembers = this.state.tempMembers;
                                        //filter temp members to leave only temp members which belongs
                                        // set temp members to new temp members
                                        this.setState({
                                            tempMembers: [],
                                            selectedMembersOnlyChecked: false,
                                            activeMembersOnlyChecked: !this.state.activeMembersOnlyChecked}
                                        )}
                                    }
                                    checked={this.state.activeMembersOnlyChecked}
                                    labelStyle={{"fontSize":"0.9rem"}}
                                    labelText='Active Members Only'
                                />
                                <CheckBox
                                    className='mb-1 ml-025'
                                    onClick={() => this.setState({selectedMembersOnlyChecked: !this.state.selectedMembersOnlyChecked})}
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
                {members.length > 0 && <Table columns={columns} data={members} />}
            </div>
        );
    }
}

export default withStore(EventAttendees)
