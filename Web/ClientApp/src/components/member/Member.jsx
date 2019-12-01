import React, { Component } from 'react'
import TabComponent from '../TabComponent'
import MultiDropDown from '../MultiDropDown/MultiDropDown'
import DatePicker from '../DatePicker'
import TimePicker from '../TimePicker'
import { withStore } from '../store'
import MemberTRRInfo from './MemberTRRInfo'
import MemberEvents from './MemberEvents'
import MemberOptions from './MemberOptions'
import MemberDiagnosis from './MemberDiagnosis'
import Alert from '../Alert'
import RadioButton from '../RadioButton'
import { Service } from '../ApiService'
import Loader from '../Loader'
import { alertNotValid } from '../alerts'
import EditContact from '../EditContact';
import memberValidators from './memberValidators'
import DeleteUpSVG from '../../svg/DeleteUpSVG'
import SaveUpSVG from '../../svg/SaveUpSVG'
import ReturnUpSVG from '../../svg/ReturnUpSVG'
import { createValidators } from '../storeValidatorsRules'

import InputWithClearButton from '../InputWithClearButton'


class Member extends Component {

    constructor(props) {
        super(props);
        props.store.refreshUserInfo();
        let userId = "";
        if (props.match.params.id) {
            userId = props.match.params.id
        }
        this.state = {
            member: {
                id: userId,
                siteId: 0,
                firstName: '',
                lastName: '', 
                phone: '',
                email: '',
                dateOfBirth: null,
                gender: '',

                streetAddress: '',
                city: '',
                state: '',
                zip: '',

                releaseSigned: false,
                liabilitySigned: false,
                activeMember: false,
                deactiveCause: '',
                joinDate: null,
                sponsoredById: null,
                travelTime: '',
                medical: 0,
                injuryDate: null,
                roles: [],
                userType: 0,
                comments: '',
                events:[],
                options: [],
                status: 0,
                emergencyContact: {}
            },
            activeTabIndex: 0,
            showError: false,
            showDeleteMemberDialog: false,
            showSuccessfullySavedDialog: false,
            showErrorSaveDialog: false,
            userId: userId,
            sponsors: [],
            authLevels:[]
        };
        this.stateDropDownRef = null;
        this.dateOfBirthDropDownRef = null;
        this.chaptersDropDownRef = null;
        this.joinDateDropDownRef = null;
        //this.sponsoredByDropDownRef = null;
        //this.medicalDropDownRef = null;
        //this.injuryDateDropDownRef = null;
        this.statusDropDownRef = null;
        this.authLevelDropDownRef = null;
        this.userTypeDropDownRef = null;

        this.saveMemberInfo = this.saveMemberInfo.bind(this);
        this.onContactInputValueChange = this.onContactInputValueChange.bind(this);
        this.close = this.close.bind(this);
        this.contactValidators = createValidators([
            { 'name': 'name', 'typeFunction': 'nameOTG', 'text': 'Name' },
            { 'name': 'phone', 'typeFunction': 'nameOTG', 'text': 'Phone' },
            { 'name': 'email', 'typeFunction': 'nameOTG', 'text': 'Email' },
        ]);

    }

    componentWillMount(){
        this.validators = memberValidators();
        this.alertNotValid = alertNotValid(() => this.setState({ showError: false }));
    }

    fixData(data) {
        if (data.dateOfBirth != null) {
            data.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (data.injuryDate != null) {
            data.injuryDate = new Date(data.injuryDate);
        }
        if (data.joinDate != null) {
            data.joinDate = new Date(data.joinDate);
        }
        if (data.emergencyContact == null) {
            data.emergencyContact = {};
        }
        return data;
    }

    componentDidMount() {
        var onSuccess = (data) => {
            this.setState({ loading: false, member: this.fixData(data) });
        };
        this.setState({ loading: true });
        Service.getTRRInfoLists().then(data => {
            this.setState({ /*sponsors: data.sponsors,*/ authLevels:data.roles });
            if (this.props.match.path == '/profile') {
                Service.getProfile().then(onSuccess);
            } else if (this.props.match.path == '/new-member') {
                this.setState({ loading: false });
            } else if (this.state.userId != null && this.state.userId != "") {
                Service.getProfileById(this.state.userId).then(onSuccess);
            }
        });
    }

    close() { this.props.history.goBack(); }

    saveMemberInfo() {
        this.setState({ loading: true });
        Service.setProfile(this.state.member).then(data => {
            if(data === undefined) {this.setState({ loading: false, showErrorSaveDialog: true })}
            else {

                this.setState({ member: this.fixData(data), loading: false, showSuccessfullySavedDialog: true })
            }
        }).catch(er => {
            var mess = 'Something went wrong.';
            console.log(typeof (er));
            if (Array.isArray(er)) {
                mess.forEach(a => { mess += '; ' + a; });
            } 
            this.setState({ loading: false, showErrorSaveDialog: true, messageErrorSaveDialog: mess });
        });
    }

    updateMemberProperty(property, value){
        let member = this.state.member;
        member[property] = value;
        this.setState({member, member});
    }

    stateNameAndAbbrRender(element, textProperty){
        return <span className='text-transform-none'>
            {element.name + ', ' + element.abbreviation}
        </span>
    }

    deleteMember() {
        Service.deleteProfile(this.state.member).then(this.close);
    }

    renderHeader() {
        if (this.props.match.path == '/profile') {
            return (<h1 className='uppercase-text mb-2'>My<strong> Profile</strong></h1>)
        } else if (this.props.match.path == '/new-member') {
            return (<h1 className='uppercase-text mb-2'>New<strong> Member</strong></h1>)
        } else {
            return (<h1 className='uppercase-text mb-2'>Edit<strong> Member</strong></h1>)
        }
    }

    getTabs() {
        if (this.props.match.path == '/profile') {
            return ['my info', 'my events'];
        } else {
            return ['personal info', 'events', 'TRR info', 'options', 'diagnosis'];
        }
    }

    checkIfElementMeetsCriteria = (el, filterList, params) => {
        let checkParam = (param, elFilter) => {
            return el[param].toLowerCase().includes(elFilter)
        }
        let allParamsWereFound = true;
        filterList.forEach(elFilter => {
            if (!params.find(param => checkParam(param, elFilter))){ 
                allParamsWereFound = false
            }
        })
        return allParamsWereFound;
    }
    onContactInputValueChange(param, newValue) {
        let member = this.state.member;
        member.emergencyContact[param] = newValue;
        this.setState({ member: member});
    }

    searchValueIntoArray(filter){
        /* remove all " " at the beginning and double ' ' inside the filter expression if they are there */
        filter = filter.replace(/\,+/g, ' ');
        filter = filter.toLowerCase().replace(/\s+/g, ' ');
        /* return an array of filters or empty string*/
        if (filter !== '') { return filter.split(" ")} 
        else return '';
    }

    filterList = (list, filter, params) => {
        let filterList = this.searchValueIntoArray(filter);
        if (filterList === ''){ 
            return list;
        }
        else {
            let newList = [];
            list.forEach(element => {
                if (this.checkIfElementMeetsCriteria(element, filterList, params)){
                    newList.push(element);
                }
            })
            return newList;
        }
    } 

    performIfValid(callback){
        if (this.props.store.isFormValid(this.validators, this.state.member)) { callback(); } 
        else { this.setState({showError: true}) };
    }

    render() {
        //const pictures = this.state.formattedPicturesList;
        const stateList = [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }];
        return (
            <div className='pages-wsm-wrapper ipw-800'>
                <div className='second-nav-wrapper'>
                    <div className='ipw-600'>
                        <div></div>
                        <div className='flex-nowrap'>
                            <button 
                                className='round-button medium-round-button outline-on-hover' 
                                onClick={() => this.setState({showDeleteMemberDialog: true})}
                            >   
                                <DeleteUpSVG />
                                <span>Delete</span>
                            </button>
                            <button
                                className='round-button medium-round-button outline-on-hover' 
                                onClick={this.saveMemberInfo}
                            >
                                <SaveUpSVG />
                                <span>Save</span>
                            </button>
                            <button
                                className='round-button medium-round-button outline-on-hover'
                                onClick={this.close}
                            >
                                <ReturnUpSVG />
                                <span>Exit</span>
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.loading && <Loader />}
                {this.renderHeader()}
                <div className='flex-nowrap justify-center align-center mb-3 w-100'>
                    <TabComponent 
                        fixedHeight={true}
                        tabList={this.getTabs()}
                        wasSelected={index => this.performIfValid(() => this.setState({activeTabIndex: index}))}
                        activeTabIndex={this.state.activeTabIndex}
                    />
                </div>
                {this.state.activeTabIndex === 0 &&
                    <div>
                    <ul className='input-fields first-child-text-125 pl-1 pr-1'>
                        <li>
                            <p>First Name:</p>
                            <div className={this.props.store.checkIfShowError('firstName', this.validators) ? 'error-input-wrapper' : '' }>
                                <InputWithClearButton 
                                    type='text' 
                                    placeholder='First Name'
                                    value = {this.state.member.firstName}
                                    onChange={e => {
                                        this.updateMemberProperty("firstName", e.target.value);
                                        this.props.store.updateValidators("firstName", e.target.value, this.validators);
                                    }}
                                    onClearValue = {() => {
                                        this.updateMemberProperty("firstName", ""); 
                                        this.props.store.updateValidators("firstName", "", this.validators);
                                    }}
                                />
                                { this.props.store.displayValidationErrors('firstName', this.validators) }
                            </div>
                        </li>
                        <li className='input-wrapper'>
                            <p>Last Name:</p>
                            <div className={this.props.store.checkIfShowError('lastName', this.validators) ? 'input-wrapper error-input-wrapper' : 'input-wrapper'}>
                                <InputWithClearButton 
                                    type='text' 
                                    placeholder='Last Name'
                                    value = {this.state.member.lastName}
                                    onChange={e => {
                                        this.updateMemberProperty("lastName", e.target.value);
                                        this.props.store.updateValidators("lastName", e.target.value, this.validators);
                                    }}
                                    onClearValue = {() => {
                                        this.updateMemberProperty("lastName", ""); 
                                        this.props.store.updateValidators("lastName", "", this.validators);
                                    }}
                                />
                                { this.props.store.displayValidationErrors('lastName', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p>Chapter:</p>
                            <div className={this.props.store.checkIfShowError('siteId', this.validators) ? 'error-input-wrapper' : ""}>
                                <MultiDropDown
                                    ref={el => this.chaptersDropDownRef = el}
                                    list={this.props.store.chapterList.filter(a => !a.deleted)}
                                    multiSelect={false}
                                    keyProperty='id'
                                    textProperty='state'
                                    expandBy='chapters'
                                    expandedTextProperty='name'
                                    expandedKeyProperty='id'
                                    expandedMultiSelect={false}
                                    defaultValue={this.state.member.siteId}
                                    placeholder="Select chapter"
                                    onDropDownValueChange={value => {
                                        this.props.store.updateValidators("siteId", value, this.validators);
                                        this.updateMemberProperty("siteId", value);
                                    }}
                                />
                                { this.props.store.displayValidationErrors('siteId', this.validators) }
                            </div>
                        </li>
                        <li className='input-wrapper' >
                            <p>Email:</p>
                            <div className={this.props.store.checkIfShowError('email', this.validators) ? 'error-input-wrapper' : ""}>
                                <input type='text' 
                                    placeholder='Email'
                                    value = {this.state.member.email}
                                    onChange={e => {
                                        this.props.store.updateValidators("email", e.target.value, this.validators);
                                        this.updateMemberProperty("email", e.target.value);
                                    }}
                                />
                                { this.props.store.displayValidationErrors('email', this.validators) }
                            </div>
                        </li>
                        <li className='input-wrapper'>
                            <p className='mark-optional'>Phone #:</p>
                            <input 
                                type='text' 
                                placeholder='Phone Number'
                                value = {this.state.member.phone}
                                onChange={e => {
                                    this.updateMemberProperty("phone", e.target.value)
                                }}
                            />
                        </li>
                        <li>
                            <p>Gender:</p>
                            <div>
                                <div className={'flex-wrap justify-left radio-inline-wrapper' + (this.props.store.checkIfShowError('gender', this.validators) ? ' error-input-wrapper' : "")}>
                                    <RadioButton
                                        style = {{"marginRight":"0.75rem"}}
                                        radioGroupElement = {this.state.member.gender}
                                        radioButtonValue = 'M'
                                        onClick = {(value) => {
                                            this.props.store.updateValidators("gender", value, this.validators);
                                            this.updateMemberProperty("gender", value);
                                        }}
                                        labelClassName = "checkbox-text"
                                        labelText = 'Male'
                                    />
                                    <RadioButton
                                        radioGroupElement = {this.state.member.gender}
                                        radioButtonValue = 'F'
                                        onClick = {(value) => {
                                            this.props.store.updateValidators("gender", value, this.validators);
                                            this.updateMemberProperty("gender", value);
                                        }}
                                        labelClassName = "checkbox-text"
                                        labelText = 'Female'
                                    />
                                </div>
                                { this.props.store.displayValidationErrors('gender', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p className='mark-optional'>Date of Birth:</p>
                            <DatePicker 
                                ref={el => this.dateOfBirthDropDownRef = el}
                                value={this.state.member.dateOfBirth}
                                onSelect={value => {
                                    this.updateMemberProperty("dateOfBirth", value);
                                }}
                            />
                    </li>
                    {/*<li>
                        <p className='mark-optional'>Injury Date:</p>
                        <DatePicker
                            ref={el => this.injuryDateDropDownRef = el}
                            value={this.state.member.injuryDate}
                            onSelect={value => { this.updateMemberProperty("injuryDate", value) }}
                        />
                    </li>*/}
                    <li className='input-wrapper'>
                        <p className='mark-optional'>Address:</p>
                        <input 
                            type='text' 
                            placeholder='Street Address'
                            value={this.state.member.streetAddress}
                            onChange={e => this.updateMemberProperty("streetAddress", e.target.value)}
                        />
                    </li>
                    <li>
                        <span className='empty'></span>
                        <ul className='input-fields flex-nowrap break-at-560 line-of-inputs-wrapper'>
                            <li 
                                className='input-wrapper'
                                style={{"flex":"1 1 auto"}}
                            >
                                <input 
                                    type='text' 
                                    placeholder='City' 
                                    value={this.state.member.city}
                                    onChange={e => this.updateMemberProperty("city", e.target.value)}
                                />
                            </li>
                            <li className='input-wrapper' style={{"flex":"1 0 150px"}}>
                                <MultiDropDown
                                    ref={el => this.stateDropDownRef = el}
                                    list={stateList}
                                    multiSelect={false}
                                    keyProperty='abbreviation'
                                    textProperty='abbreviation'
                                    defaultValue={this.state.member.state}
                                    placeholder="State"
                                    textPropertyRender = {(element, textProperty) => this.stateNameAndAbbrRender(element, textProperty)}
                                    onDropDownValueChange={value => this.updateMemberProperty("state", value)}
                                    search={this.filterList}
                                    searchParams={['abbreviation', 'name']}
                                    //searchMinCharacterCount = {5}
                                />
                            </li>
                            <li className='input-wrapper' style={{"flex":"0 0 100px"}}>
                                <input 
                                    type='text' 
                                    placeholder='Zip' 
                                    maxLength={5} 
                                    value = {this.state.member.zip}
                                    onChange={e => this.updateMemberProperty("zip", e.target.value)}
                                />
                            </li>
                        </ul>
                    </li>
                    {/*<li className='input-wrapper'>
                        <p className='mark-optional'>Travel Time:</p>
                        <input
                            type='text'
                            placeholder='Travel Time'
                            value={this.state.member.travelTime}
                            onChange={e => this.updateMemberProperty("travelTime", e.target.value)}
                        />
                    </li>
                    <li>
                        <p className='mark-optional'>Medical:</p>
                        <MultiDropDown
                            ref={el => this.medicalDropDownRef = el}
                            list={[{ name: 'Inpatient', id: 42 }, { name: 'Outpatient', id: 43 }, { name: 'Vet Center', id: 44 }, { name: 'Other', id: 45 }, { name: 'None', id: 46 }, { name: 'Unknown', id: 94 }]}
                            multiSelect={false}
                            keyProperty='id'
                            textProperty='name'
                            defaultValue={this.state.member.medical}
                            placeholder="Medical"
                            onDropDownValueChange={value => this.updateMemberProperty("medical", value)}
                        />
                    </li>*/}
                    </ul>
                <ul className='input-fields first-child-text-165 mt-3 mb-2 pl-1 pr-1'>
                    <EditContact
                        header={"Emergency Contact:"}
                        value={this.state.member.emergencyContact}
                        onInputValueChange={this.onContactInputValueChange}
                        isFormValid={() => true}
                        showError={() => this.setState({ showError: true })}
                        validators={this.contactValidators}
                        updateValidators={param => null}
                    />
                    </ul>
                    </div>
                }
                {this.state.activeTabIndex === 1 &&
                    <MemberEvents events={this.state.member.events} />
                }
                {this.state.activeTabIndex === 2 && 
                    <MemberTRRInfo 
                    setJoinDateDropDownRef={el => this.joinDateDropDownRef = el}
                    /*setSponsoredByDropDownRef={el => this.sponsoredByDropDownRef = el}*/
                    setStatusDropDownRef={el => this.statusDropDownRef = el}
                    setAuthLevelDropDownRef={el => this.authLevelDropDownRef = el}
                    setUserTypeDropDownRef={el => this.userTypeDropDownRef = el}
                    member={this.state.member}
                    updateMemberProperty={(property, value) => this.updateMemberProperty(property, value)}
                    /*sponsors={this.state.sponsors}*/
                    roles={this.state.authLevels}
                    />
                }
                {this.state.activeTabIndex === 3 &&
                    <MemberOptions member={this.state.member} />
                }
                {this.state.activeTabIndex === 4 &&
                    <MemberDiagnosis member={this.state.member} />
                }
                <div className='flex-nowrap justify-center children-width-30 w-100 mt-2'>
                    {this.state.activeTabIndex > 0 &&
                        <button 
                            className='medium-static-button static-button' 
                            onClick={() => this.performIfValid(() => this.setState({activeTabIndex: this.state.activeTabIndex - 1}))}
                        > Back </button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button 
                            className='medium-static-button static-button default-button' 
                            onClick={() => this.performIfValid(() => this.setState({activeTabIndex: this.state.activeTabIndex + 1}))}
                        > Next </button>
                    }
                </div>

                {this.state.showError && this.alertNotValid }

                {this.state.showDeleteMemberDialog && 
                    <Alert 
                        headerText = 'Delete'
                        text = 'Are you sure you want to delete this Member?'
                        onClose = {() => this.setState({showDeleteMemberDialog: false})}
                        showOkCancelButtons = {true}
                        onCancelButtonClick = {() => this.setState({showDeleteMemberDialog: false})}
                        onOkButtonClick = {() => {this.deleteMember()}}
                        cancelButtonText = "Cancel"
                        okButtonText = "Delete"
                        mode = 'warning'
                    >
                        <h4 className='mb-05'>{this.state.member.firstName+' '+this.state.member.lastName}</h4>
                        <p style={{"textAlign":"center"}}>This action cannot be undone. Delete anyway?</p>
                    </Alert>
                }

                {this.state.showSuccessfullySavedDialog && 
                    <Alert 
                        headerText='Success'
                        onClose={() => this.setState({showSuccessfullySavedDialog: false})}
                        showOkButton={true}
                        onOkButtonClick={() => this.setState({showSuccessfullySavedDialog: false})}
                        okButtonText="Ok"
                        mode='success'
                    >
                        <h4 className='mb-05'>{this.state.member.firstName+' '+this.state.member.lastName}</h4>
                        <p style={{"textAlign":"center"}}> Was successfully saved </p>
                    </Alert>
                }

                {this.state.showErrorSaveDialog && 
                    <Alert 
                        headerText='Error'
                        onClose={() => this.setState({showErrorSaveDialog: false})}
                        showOkButton={true}
                        onOkButtonClick={() => this.setState({showErrorSaveDialog: false})}
                        okButtonText="Ok"
                        mode='error'
                >
                    <p className='mb-05' style={{ "textAlign": "center" }}> {this.state.messageErrorSaveDialog} </p>
                        <h4 className='mb-05'>{this.state.member.firstName+' '+this.state.member.lastName}</h4>
                        <p style={{"textAlign":"center"}}> was not saved </p>
                    </Alert>
                }

            </div>
        );
    }
}

export default withStore(Member);