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
import RadioBoxSVG from '../../svg/RadioBoxSVG'
import Alert from '../Alert'
import RadioButton from '../RadioButton'
import EditUpSVG from '../../svg/EditUpSVG'
import { Service } from '../ApiService'
import Loader from '../Loader'

import memberValidators from './memberValidators'
import DeleteUpSVG from '../../svg/DeleteUpSVG';
import SaveUpSVG from '../../svg/SaveUpSVG';


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
                sponsoredBy: [],
                travelTime: '',
                medical: 0,
                injuryDate: null,
                authLevel: 0,
                userType: 0,
                comments: '',
                events:[],
                options: [],
            },
            activeTabIndex: 0,
            showError: false,
            showDeleteMemberDialog: false,
            showSuccessfullySavedDialog: false,
            userId: userId,
            sponsors:[]
        };
        this.stateDropDownRef = null;
        this.dateOfBirthDropDownRef = null;
        this.chaptersDropDownRef = null;
        this.joinDateDropDownRef = null;
        this.sponsoredByDropDownRef = null;
        this.medicalDropDownRef = null;
        this.injuryDateDropDownRef = null;
        this.statusDropDownRef = null;
        this.authLevelDropDownRef = null;
        this.userTypeDropDownRef = null;

        this.emptyChapter = false;
        this.emptyFirstName = false;
        this.emptyLastName = false;
        this.emptyPhone = false;
        this.emptyEmail = false;
        this.emptyDateOfBirth = false;
        this.emptyGender = false;
        this.emptyStreetAddress = false;
        this.emptyCity = false;
        this.emptyZip = false;
        this.emptyState = false;

        this.saveMemberInfo = this.saveMemberInfo.bind(this);
    }

    componentWillMount(){
        this.validators = memberValidators();
    }

    componentDidMount() {
        var onSuccess = (data) => {
            if (data.dateOfBirth != null) {
                data.dateOfBirth = new Date(data.dateOfBirth);
            }
            if (data.injuryDate != null) {
                data.injuryDate = new Date(data.injuryDate);
            }
            this.setState({ loading: false, member: data });
        };

        this.setState({ loading: true });
        Service.getSponsors().then(data => {
            this.setState({ sponsors: data });
            if (this.props.match.path == '/profile') {
                Service.getProfile().then(onSuccess);
            } else if (this.props.match.path == '/new-member') {
                
            } else if (this.state.userId != null && this.state.userId != "") {
                Service.getProfileById(this.state.userId).then(onSuccess);
            }
        });
    }

    saveMemberInfo() {
        this.setState({ loading: true });
        Service.setProfile(this.state.member).then(data => {
            this.setState({ loading: false, showSuccessfullySavedDialog: true });
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

    validation() {
        let validationPassed = true;
            if (this.state.activeTabIndex === 0){
                if(this.state.member.siteId == 0) {
                    this.emptyChapter = true;
                }
                if(this.state.member.firstName.length < 1) {
                    this.emptyFirstName = true;
                }
                if(this.state.member.lastName.length < 1) {
                    this.emptyLastName = true;
                }
                //if(this.state.member.phone.length < 1) {
                //    this.emptyPhone = true;
                //}
                if(this.state.member.email.length < 1) {
                    this.emptyEmail = true;
                }
                if(this.state.member.gender.male  === false && this.state.member.gender.female  === false) {
                    this.emptyGender = true;
                }
                if (this.state.member.city == null) {
                    this.emptyCity = true;
                }
                if (this.state.member.state == null) {
                    this.emptyState = true;
                }
                if (this.state.member.zip == null ||this.state.member.zip.length < 1) {
                    this.emptyZip = true;
                }
                if (this.emptyChapter || 
                    this.emptyFirstName || 
                    this.emptyLastName || 
                    this.emptyPhone || 
                    this.emptyEmail || 
                    this.emptyDateOfBirth || 
                    this.emptyGender || 
                    this.emptyStreetAddress || 
                    this.emptyCity || 
                    this.emptyZip || 
                    this.emptyState
                ){
                    this.setState({showError: true});
                    validationPassed = false;
                }
            }
        return validationPassed;
    }
    renderHeader() {
        if (this.props.match.path == '/profile') {
            return (<h1 className='uppercase-text mb-2 mt-2'>My<strong> Profile</strong></h1>)
        } else if (this.props.match.path == '/new-member') {
            return (<h1 className='uppercase-text mb-2 mt-2'>New<strong> Member</strong></h1>)
        } else {
            return (<h1 className='uppercase-text mb-2 mt-2'>Edit<strong> Member</strong></h1>)
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

    render() {
        //const pictures = this.state.formattedPicturesList;
        const stateList = [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }];

        return (
            <div className='inner-pages-wrapper ipw-600 pb-2 pt-3 pt-non-sc'>
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
                        </div>
                    </div>
                </div>
                {this.state.loading && <Loader />}
                {this.renderHeader()}
                <TabComponent 
                    fixedHeight={true}
                    tabList={this.getTabs()}
                    wasSelected={(index) => this.setState({activeTabIndex: index})}
                    activeTabIndex={this.state.activeTabIndex}
                />
                {this.state.activeTabIndex === 0 &&
                    <ul className='input-fields first-child-text-125 mt-3 pl-1 pr-1'>
                        <li className = 'input-wrapper'>
                            <p>First Name:</p>
                            <div className={this.props.store.checkIfShowError('firstName', this.validators) ? 'input-wrapper error-input-wrapper' : 'input-wrapper' }>
                                <input 
                                    type='text' 
                                    placeholder='First Name'
                                    value = {this.state.member.firstName}
                                    onChange={e => {
                                        this.updateMemberProperty("firstName", e.target.value);
                                        this.props.store.updateValidators("firstName", e.target.value, this.validators);
                                    }}
                                />
                                { this.props.store.displayValidationErrors('firstName', this.validators) }
                            </div>
                        </li>
                        <li className='input-wrapper'>
                            <p>Last Name:</p>
                            <div className={this.props.store.checkIfShowError('lastName', this.validators) ? 'input-wrapper error-input-wrapper' : 'input-wrapper'}>
                                <input 
                                    type='text' 
                                    placeholder='Last Name'
                                    value = {this.state.member.lastName}
                                    onChange={e => {
                                        this.props.store.updateValidators("lastName", e.target.value, this.validators);
                                        this.updateMemberProperty("lastName", e.target.value);
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
                                    list={this.props.store.chapterList}
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
                        <li className='input-wrapper'>
                            <p>Phone #:</p>
                            <input 
                                type='text' 
                                placeholder='Phone Number'
                                value = {this.state.member.phone}
                                onChange={e => {
                                    this.updateMemberProperty("phone", e.target.value)
                                }}
                            />
                        </li>
                        <li className='input-wrapper' >
                            <p>Email:</p>
                            <input type='text' 
                                placeholder='Email'
                                value = {this.state.member.email}
                                onChange={e => {
                                    this.updateMemberProperty("email", e.target.value);
                                }}
                            />
                        </li>
                        <li>
                            <p>Date of Birth:</p>
                            <DatePicker 
                                ref={el => this.dateOfBirthDropDownRef = el}
                                value={this.state.member.dateOfBirth}
                                onSelect={value => {
                                    this.updateMemberProperty("dateOfBirth", value);
                                }}
                            />
                    </li>
                    <li>
                        <p>Injury Date:</p>
                        <DatePicker
                            ref={el => this.injuryDateDropDownRef = el}
                            value={this.state.member.injuryDate}
                            onSelect={value => { this.updateMemberProperty("injuryDate", value) }}
                        />
                    </li>
                        <li>
                            <p>Gender:</p>
                            <div className='flex-wrap justify-left radio-inline-wrapper'>
                                <RadioButton
                                    style = {{"marginRight":"0.75rem"}}
                                    radioGroupElement = {this.state.member.gender}
                                    radioButtonValue = 'M'
                                    onClick = {(value) => {
                                        this.updateMemberProperty("gender", value);
                                        this.emptyGender = false;
                                    }}
                                    labelClassName = "checkbox-text"
                                    labelText = 'Male'
                                />
                                <RadioButton
                                    radioGroupElement = {this.state.member.gender}
                                    radioButtonValue = 'F'
                                    onClick = {(value) => {
                                        this.updateMemberProperty("gender", value);
                                        this.emptyGender = false;
                                    }}
                                    labelClassName = "checkbox-text"
                                    labelText = 'Female'
                                />
                            </div>
                        </li>
                        <li className='input-wrapper'>
                            <p>Address:</p>
                            <input 
                                type='text' 
                                placeholder='Street Address'
                                value={this.state.member.streetAddress}
                                onChange={e => {
                                    this.updateMemberProperty("streetAddress", e.target.value);
                                }}
                            />
                        </li>
                        <li>
                            <span className='empty'></span>
                            <ul className='input-fields flex-nowrap break-at-500 line-of-inputs-wrapper'>
                                <li 
                                    className='input-wrapper'
                                    style={{"flex":"1 1 auto"}}
                                >
                                    <input 
                                        type='text' 
                                        placeholder='City' 
                                        value={this.state.member.city}
                                        onChange={e => {
                                            this.updateMemberProperty("city", e.target.value);
                                        }}
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
                                            onDropDownValueChange={value => {
                                                this.updateMemberProperty("state", value);
                                            }}
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
                                        onChange={e => {
                                            this.updateMemberProperty("zip", e.target.value);
                                        }}
                                    />
                                </li>
                            </ul>
                    </li>
                    <li className='input-wrapper'>
                        <p>Travel Time:</p>
                        <input
                            type='text'
                            placeholder='Travel Time'
                            value={this.state.member.travelTime}
                            onChange={e => this.updateMemberProperty("travelTime", e.target.value)}
                        />
                    </li>
                    <li>
                        <p>Medical:</p>
                        <MultiDropDown
                            ref={el=>this.medicalDropDownRef=el}
                            list={[{ name: 'Inpatient', id: 42 }, { name: 'Outpatient', id: 43 }, { name: 'Vet Center', id: 44 }, { name: 'Other', id: 45 }, { name: 'None', id: 46 }, { name: 'Unknown', id: 94 }]}
                            multiSelect={false}
                            keyProperty='id'
                            textProperty='name'
                            defaultValue={this.state.member.medical}
                            placeholder="Medical"
                            onDropDownValueChange={value => this.updateMemberProperty("medical", value)}
                        />
                    </li>
                    </ul>
                }
                {this.state.activeTabIndex === 1 &&
                    <MemberEvents events={this.state.member.events} />
                }
                {this.state.activeTabIndex === 2 && 
                    <MemberTRRInfo 
                    setJoinDateDropDownRef={el => this.joinDateDropDownRef = el}
                    setSponsoredByDropDownRef={el => this.sponsoredByDropDownRef = el}
                    setStatusDropDownRef={el => this.statusDropDownRef = el}
                    setAuthLevelDropDownRef={el => this.authLevelDropDownRef = el}
                    setUserTypeDropDownRef={el => this.userTypeDropDownRef = el}
                    member={this.state.member}
                    updateMemberProperty={(property, value) => this.updateMemberProperty(property, value)}
                    sponsors={this.state.sponsors}
                    />
                }
                {this.state.activeTabIndex === 3 &&
                    <MemberOptions member={this.state.member} />
                }
                {this.state.activeTabIndex === 4 &&
                    <MemberDiagnosis member={this.state.member} />
                }
                <div className='flex-nowrap justify-center children-width-30 w-100 mt-2'>
                    <button className='medium-static-button static-button' onClick={() => this.setState({showDeleteMemberDialog: true})}>Delete</button>
                    {this.state.activeTabIndex > 0 &&
                        <button 
                            className='medium-static-button static-button' 
                            onClick={() => {
                                if (this.validation()) {
                                    this.setState({activeTabIndex: this.state.activeTabIndex-1});
                                }
                            }}
                        >
                            Back
                        </button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button 
                            className='medium-static-button static-button default-button' 
                            onClick={() => {
                                if (this.props.store.isFormValid(this.validators, this.state.member)) {
                                    this.setState({activeTabIndex: this.state.activeTabIndex+1})
                                } else this.setState({showError: true});
                            }}
                        >
                            Next
                        </button>
                    }
                    {this.state.activeTabIndex !== 1 &&
                        <button className='medium-static-button static-button' onClick={this.saveMemberInfo}>Save</button>
                    }
                </div>
                {this.state.showError && 
                    <Alert 
                        headerText = 'Error'
                        text = 'Some required information is missing or incomplete.'
                        onClose = {()=>this.setState({showError: false})}
                        showOkButton={true}
                        onOkButtonClick={() => this.setState({ showError: false })}
                        buttonText = "Got IT!"
                        mode = 'error'
                    >
                        <span class='alert-message'>Please fill out the fields in red.</span>
                    </Alert>
                }
                {this.state.showDeleteMemberDialog && 
                    <Alert 
                        headerText = 'Delete'
                        text = 'Are you sure you want to delete this Member?'
                        onClose = {()=>this.setState({showDeleteMemberDialog: false})}
                        showOkCancelButtons = {true}
                        onCancelButtonClick = {()=>this.setState({showDeleteMemberDialog: false})}
                        onOkButtonClick = {() => this.deleteMember()}
                        cancelButtonText = "Cancel"
                        okButtonText = "Delete"
                        mode = 'warning'
                    >
                        <h4 className='mb-05'>{this.state.member.firstName+' '+this.state.member.lastName}</h4>
                        <p style={{"textAlign":"center"}}>
                            This action cannot be undone. Delete anyway?
                        </p>
                    </Alert>
                }
                {this.state.showSuccessfullySavedDialog && 
                    <Alert 
                        headerText = 'Success'
                        onClose = {() => this.setState({showSuccessfullySavedDialog: false})}
                        showOkButton = {true}
                        onOkButtonClick = {() => this.setState({showSuccessfullySavedDialog: false})}
                        okButtonText = "Ok"
                        mode = 'success'
                    >
                        <p style={{"textAlign":"center"}}>
                            The information was successfully saved
                        </p>
                    </Alert>
                }
            </div>
        );
    }
}

export default withStore(Member);