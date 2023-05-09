//import { Route, Router, history } from 'react-router';
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG'
import EditUpSVG from '../../svg/EditUpSVG'
import Table from '../Table'
import VolunteerUpSVG from '../../svg/VolunteerUpSVG'
import VeteranUpSVG from '../../svg/VeteranUpSVG'
import PaddlerUpSVG from '../../svg/PaddlerUpSVG'
import Loader from '../Loader'
import { Service } from '../ApiService'
import FixedWrapper from '../FixedWrapper'
import MultiDropDown from '../MultiDropDown/MultiDropDown'
import CheckBox from '../CheckBox'
import SearchInput from '../SearchInput'
import Alert from '../Alert'
import TabComponent from '../TabComponent';
import CaregiverUpSVG from '../../svg/CaregiverUpSVG'



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
            chapterOnlyMembers: true,
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
        this.renderToggler = this.renderToggler.bind(this);

    }

    submitMembersToEvent() {
        this.setState({ loading: true });
        Service.addEventAttendees(this.state.eventId, this.state.tempMembers)
            .then(data => this.setState({ 
                members: data, 
                tempMembers: [], 
                loading: false, 
                addingExistingMembers: false, 
                attendeeFilter: '' 
            }));
    }

    addNewMember() {}

    addExistingMember() {
        this.setState({ loading: true });
        Service.getSiteMembers(this.state.eventId)
            .then(data => { this.setState({ 
                siteMembers: data, 
                loading: false, 
                addingExistingMembers: true
            }, () => this.filterMemberList()) });
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

    createFilteredListWithTimeOut(){
        this.timeoutVar = setTimeout(() => {this.filterMemberList()}, 150);
    }

    filterMemberList = () => {
        let list = this.state.siteMembers;
        let filter = this.state.attendeeFilter;
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
                ((this.state.chapterOnlyMembers && element.siteId==this.props.chapterId) || !this.state.chapterOnlyMembers) &&
                (this.state.selectedMembersOnlyChecked === false || (
                    this.state.selectedMembersOnlyChecked === true && this.state.tempMembers.indexOf(element.id) > -1))
            ){filteredList.push(element)}
        })
        this.setState({filteredList: filteredList})
    } 

    

    renderFullNameColumn(value, row, index, col) {
        return ( 
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span style={{ "flex": "0 0 auto", "height": "1.2rem" }}>
                    {row['memberTypeId'] === 53 ? <VolunteerUpSVG /> : (row['memberTypeId'] === 55 ? <CaregiverUpSVG /> : <PaddlerUpSVG />)}
                </span>
                <span style={{"flex":"1 1 auto"}} className="big-bold">{row['firstName'] + ' ' + row['lastName']}</span>
                {this.props.editsPermitted !== false &&
                    <button 
                        className='round-button small-round-button light-grey-outline-button' 
                        style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                        onClick={() => {
                            this.headerText = 'Warning';
                            this.dialogText = 'You want to remove the participant'
                            this.onOkButtonClick = () => {this.removeMember(row); this.setState({showDialog: false})};
                            this.cancelButtonText = 'Cancel';
                            this.okButtonText = 'Remove';
                            this.dialogContent = <h4>{row['firstName'] + ' ' + row['lastName']}</h4>
                            this.setState({showDialog: true})/*this.removeMember(row)*/}}
                    >
                        <CloseUpSVG />
                    </button>
                }
                {this.props.editsPermitted !== false &&
                    <Link 
                        className='round-button small-round-button light-grey-outline-button' 
                        style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                        to={"/member/" + row.id}
                    >
                        <EditUpSVG />
                    </Link>
                }
            </li>
        );
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

    renderToggler(value, row, index, col) {
        return (<li className="table-content"><TabComponent
            style={{ 'fontSize': '0.85rem', 'height': '24px' }}
            tabList={["yes", "no"]}
            wasSelected={(index) => {
                if (index != value) {
                    var attendies = this.state.members;
                    var one = attendies.find(a => a.id == row.id);
                    if (one != null) {
                        this.setState({ loading: true });
                        Service.toggleAttendance({ userId: one.id, eventId: this.state.eventId, attended: index == 0 })
                            .then(res => {
                                if (res.ok) {
                                    one.attended = index == 0;
                                    this.setState({ member: attendies });
                                } else {
                                    alert(res.error);
                                }
                                this.setState({ loading: false });
                            });
                    }
                }
            }}
            activeTabIndex={row.attended ? 0 : 1}
        /></li>)
    }

    render() {
        const members = this.state.members;
        const columns=[
            {title:"Attendee", accesor:"name", className:"borders-when-display-block", render: this.renderFullNameColumn},
            { title: "Phone", accesor: "phone" },
            { title: "Zip", accesor: "zipCode" }, 
            { title: "Email", accesor: "email", className: 'word-break' }
        ];
        if (this.props.showAttended) {
            //columns.push({ title: "Attended", accessor: "attended", render: this.renderToggler });
        }
        return (
            <div className='w-100 prpl-0'>         
                {this.state.loading && <Loader />}
                {this.state.addingExistingMembers &&
                    <FixedWrapper maxWidth={"600px"} noPadding={true}>
                        <h2 className='ml-075 mr-075 mt-2 mb-1'>Add Members</h2>
                        <SearchInput 
                            placeholder='Search members'
                            wrapperClassName = 'm-075'
                            value={this.state.attendeeFilter}
                            onValueChange={(value) => {
                                clearTimeout(this.timeoutVar);
                                this.setState({attendeeFilter: value}, this.createFilteredListWithTimeOut());
                            }}
                            onClearValueButtonClick={() => {
                                clearTimeout(this.timeoutVar);
                                this.setState({attendeeFilter: ""}, this.createFilteredListWithTimeOut());
                            }}
                        />
                        <div className='flex-wrap justify-space-between align-center mr-075 ml-05 mb-05'>
                        {/*<CheckBox 
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
                                labelText={<span>Select All<strong>{" "+ this.state.filteredList.length.toString()}</strong></span>}
                            />*/}
                        <CheckBox
                                className='mr-1 mb-1 ml-025'
                            onClick={() => {
                                this.setState({ chapterOnlyMembers: !this.state.chapterOnlyMembers }, this.filterMemberList);
                                }}
                                checked={this.state.chapterOnlyMembers}
                                labelStyle={{"fontSize":"0.9rem"}}
                                labelText={<span>Event chapter only</span>}
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
                        {this.state.filteredList.length === 0 && <p className='message-block mb-2 mt-2'>There are no members that meet this criteria.</p>}
                        {this.state.filteredList.length > 0 &&
                            <MultiDropDown
                                className = 'pr-075'
                                list={this.state.filteredList}
                                multiSelect={true}
                                toggleable={false}
                                keyProperty='id'
                                textProperty='email'
                                defaultValue={this.state.tempMembers}
                                placeholder="Select from the list"
                                onDropDownValueChange={value => this.setState({ tempMembers: value })}
                                hideHeader = {true}
                                substractHeight = {65}
                                textPropertyRender = {(element, textProperty) => this.textPropertyRender(element, textProperty)}
                            />
                        }
                        <div className='flex-nowrap justify-center mt-1 mb-05 mr-075 ml-075'>
                            <button ref = {el => this.okButtonRef = el} className='medium-static-button static-button' onClick={this.submitMembersToEvent}>OK</button>
                            <button ref = {el => this.cancelButtonRef = el} className='medium-static-button static-button default-button' onClick={() => this.setState({ addingExistingMembers: false, tempMembers:[], attendeeFilter: '' })}> Cancel </button>
                        </div>
                    </FixedWrapper>
                }
                {members.length === 0 && <p className='message-block mb-2 pr-1 pl-1'>There are no attendees registered for the event.</p>}
                {this.props.editsPermitted !== false &&
                    <div className="flex-wrap align-center justify-center mb-2 pr-1 pl-1">
                        <p className='input-label'>ADD ATTENDEES:</p>
                        <span>
                            {/*<button disabled className='big-static-button static-button' onClick={this.addNewMember}>Create New</button>*/}
                            <button className='big-static-button static-button' onClick={this.addExistingMember}>Add Members</button>
                        </span>
                    </div>
                }
                {members.length > 0 && <Table columns={columns} data={members} className={"break-at-500"} addHeadersForNarrowScreen={true}/>}
                {this.state.showDialog && 
                    <Alert 
                        headerText = {this.headerText}
                        text = {this.dialogText}
                        onClose = {() => this.setState({showDialog: false})}
                        showOkCancelButtons = {true}
                        onCancelButtonClick = {() => this.setState({showDialog: false})}
                        onOkButtonClick = {this.onOkButtonClick}
                        cancelButtonText = {this.cancelButtonText}
                        okButtonText = {this.okButtonText}
                        mode = 'warning'
                    >
                       {this.dialogContent}
                    </Alert>
                }      
            </div>
        );
    }
}

export default withStore(EventAttendees)
