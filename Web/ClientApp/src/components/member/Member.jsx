import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import { withStore } from '../store';
import MemberTRRInfo from './MemberTRRInfo';
import MemberEvents from './MemberEvents';
import MemberOptions from './MemberOptions';
import RadioBoxSVG from '../../svg/RadioBoxSVG';
import Alert from '../Alert';
import RadioButton from '../RadioButton';
import { Service } from '../ApiService';
import Loader from '../Loader';


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
            userId: userId
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

        this.handleClick = this.handleClick.bind(this);
        this.saveMemberInfo = this.saveMemberInfo.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

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
        if (this.props.match.path == '/profile' ) {
            Service.getProfile().then(onSuccess);
        } else if (this.props.match.path == '/new-member') {

        } else if (this.state.userId != null && this.state.userId !="") {
            Service.getProfileById(this.state.userId).then(onSuccess);
        }
    }

    handleClick(e) {
        if(this.state.activeTabIndex === 0){
            if(this.dateOfBirthDropDownRef.state.isOpen && !this.dateOfBirthDropDownRef.datePickerRef.contains(e.target)){
                this.dateOfBirthDropDownRef.toggle();
            }
            if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.chaptersDropDownRef.state.toggle();
            }
            if(this.stateDropDownRef.state.isOpen && !this.stateDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.stateDropDownRef.state.toggle();
            }
            if (this.medicalDropDownRef.state.isOpen && !this.medicalDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
                this.medicalDropDownRef.state.toggle();
            }
            if (this.injuryDateDropDownRef.state.isOpen && !this.injuryDateDropDownRef.datePickerRef.contains(e.target)) {
                this.injuryDateDropDownRef.toggle();
            }
        }
        if(this.state.activeTabIndex === 2){
            if(this.joinDateDropDownRef.state.isOpen && !this.joinDateDropDownRef.datePickerRef.contains(e.target)){
                this.joinDateDropDownRef.toggle();
            }
            if(this.sponsoredByDropDownRef.state.isOpen && !this.sponsoredByDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.sponsoredByDropDownRef.state.toggle();
            }
            if(this.statusDropDownRef.state.isOpen && !this.statusDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.statusDropDownRef.state.toggle();
            }
            if(this.authLevelDropDownRef.state.isOpen && !this.authLevelDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.authLevelDropDownRef.state.toggle();
            }
            if(this.userTypeDropDownRef.state.isOpen && !this.userTypeDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.userTypeDropDownRef.state.toggle();
            }
        }
    }

    saveMemberInfo() {
        this.setState({ loading: true });
        Service.setProfile(this.state.member).then(data => {
            this.setState({ loading: false });
        });
    }

    updateMemberProperty(property, value){
        let member = this.state.member;
        member[property] = value;
        this.setState({member, member}, console.log(this.state));
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
                if (this.state.member.zip == null ||this.state.member.zip.length < 1) {
                    this.emptyZip = true;
                }
                if (this.emptyChapter || this.emptyFirstName || this.emptyLastName || this.emptyPhone || this.emptyEmail || this.emptyDateOfBirth || this.emptyGender || this.emptyStreetAddress || this.emptyCity || this.emptyZip || this.emptyState){
                    this.setState({showError: true});
                    validationPassed = false;
                }
            }
        return validationPassed;
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
            return ['personal info', 'events', 'TRR info', 'options'];
        }
    }

    render() {
        const pictures = this.state.formattedPicturesList;
        const stateList = [{ "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "Arizona", "abbreviation": "AZ" }, { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" }, { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Hawaii", "abbreviation": "HI" }, { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" }, { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" }, { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Maryland", "abbreviation": "MD" }, { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" }, { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" }, { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" }, { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" }, { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Ohio", "abbreviation": "OH" }, { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Pennsylvania", "abbreviation": "PA" }, { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" }, { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" }, { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" }, { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }];

        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
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
                        <li className = {this.emptyFirstName ? 'input-wrapper mark-invalid' : 'input-wrapper'}
                            error-text='Please enter the First Name'
                        >
                            <p>First Name:</p>
                            <input 
                                type='text' 
                                placeholder='First Name'
                                value = {this.state.member.firstName}
                                onChange={e => {
                                    if(this.emptyFirstName) {this.emptyFirstName = false;}
                                    this.updateMemberProperty("firstName", e.target.value);
                                }}
                            />
                        </li>
                        <li className={this.emptyLastName ? 'input-wrapper mark-invalid' : 'input-wrapper'}
                            error-text='Please enter the Last Name'
                        >
                            <p>Last Name:</p>
                            <input 
                                type='text' 
                                placeholder='Last Name'
                                value = {this.state.member.lastName}
                                onChange={e => {
                                    if(this.emptyLastName) {this.emptyLastName = false;}
                                    this.updateMemberProperty("lastName", e.target.value);
                                }}
                            />
                        </li>
                        <li className = {this.emptyChapter ? 'mark-invalid' : ""}
                            error-text='Please select the Chapter'
                        >
                            <p>Chapter:</p>
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
                                    if(this.emptyChapter) {this.emptyChapter = false;}
                                    this.updateMemberProperty("siteId", value);
                                    console.log(this.state.member, value);
                                }}
                            />
                        </li>
                        <li className={this.emptyPhone ? 'input-wrapper mark-invalid' : 'input-wrapper'}
                            error-text='Please enter the Phone Number'
                        >
                            <p>Phone #:</p>
                            <input 
                                type='text' 
                                placeholder='Phone Number'
                                value = {this.state.member.phone}
                                onChange={e => {
                                    if(this.emptyPhone){this.emptyPhone = false;}
                                    this.updateMemberProperty("phone", e.target.value)
                                }}
                            />
                        </li>
                        <li className={this.emptyEmail ? 'input-wrapper mark-invalid' : 'input-wrapper'}
                            error-text='Please enter the Email'
                        >
                            <p>Email:</p>
                            <input type='text' 
                                placeholder='Email'
                                value = {this.state.member.email}
                                onChange={e => {
                                    if(this.emptyEmail){this.emptyEmail = false;}
                                    this.updateMemberProperty("email", e.target.value);
                                }}
                            />
                        </li>
                        <li className={this.emptyDateOfBirth ? 'mark-invalid' : ''}
                            error-text='Please enter the Date of Birth'
                        >
                            <p>Date of Birth:</p>
                            <DatePicker 
                                ref={el => this.dateOfBirthDropDownRef = el}
                                value={this.state.member.dateOfBirth}
                                onSelect={value => {
                                    if(this.emptyDateOfBirth){this.emptyDateOfBirth = false;}
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
                        <li className={this.emptyGender ? 'mark-invalid' : ''}
                            error-text='Please select Gender'
                        >
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
                        <li className={this.emptyStreetAddress ? 'input-wrapper mark-invalid' : 'input-wrapper'}
                            error-text='Please enter the Street Address'
                        >
                            <p>Address:</p>
                            <input 
                                type='text' 
                                placeholder='Street Address'
                                value={this.state.member.streetAddress}
                                onChange={e => {
                                    if(this.emptyStreetAddress){this.emptyStreetAddress = false;}
                                    this.updateMemberProperty("streetAddress", e.target.value);
                                }}
                            />
                        </li>
                        <li>
                            <span></span>
                            <ul className='input-fields flex-nowrap break-at-500 line-of-inputs-wrapper'>
                                <li 
                                    className={this.emptyCity ? 'input-wrapper mark-invalid' : 'input-wrapper'} 
                                    error-text='Enter City'
                                    style={{"flex":"1 1 auto"}}
                                >
                                    <input 
                                        type='text' 
                                        placeholder='City' 
                                        value={this.state.member.city}
                                        onChange={e => {
                                            if(this.emptyCity){this.emptyCity = false;}
                                            this.updateMemberProperty("city", e.target.value);
                                        }}
                                    />
                                </li>
                                <li className={this.emptyState ? 'mark-invalid' : ''} error-text='Select State' style={{"flex":"1 1 auto"}}>
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
                                                if(this.emptyState){this.emptyState = false;}
                                                this.updateMemberProperty("state", value);
                                            }}
                                        />
                                </li>
                                <li 
                                    className={this.emptyZip ? 'input-wrapper mark-invalid' : 'input-wrapper'}
                                    error-text='Enter Zip'
                                    style={{"flex":"0 0 100px"}}
                                >
                                    <input 
                                        type='text' 
                                        placeholder='Zip' 
                                        maxLength={5} 
                                        value = {this.state.member.zip}
                                        onChange={e => {
                                            if(this.emptyZip){this.emptyZip = false;}
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
                {this.state.activeTabIndex === 2 && 
                    <MemberTRRInfo 
                        setJoinDateDropDownRef = {el => this.joinDateDropDownRef = el}
                        setSponsoredByDropDownRef = {el => this.sponsoredByDropDownRef = el}
                        setStatusDropDownRef = {el => this.statusDropDownRef = el}
                        setAuthLevelDropDownRef = {el => this.authLevelDropDownRef = el}
                        setUserTypeDropDownRef = {el => this.userTypeDropDownRef = el} 

                        member = {this.state.member}
                        updateMemberProperty = {(property, value) => this.updateMemberProperty(property, value)}
                    />
                }
                {this.state.activeTabIndex === 1 &&
                    <MemberEvents events={this.state.member.events} />
                }
                {this.state.activeTabIndex === 3 &&
                    <MemberOptions member={this.state.member} />
                }
                <div className='flex-wrap mt-2'>
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
                    {this.state.activeTabIndex < 2 &&
                        <button 
                            className='medium-static-button static-button default-button' 
                            onClick={() => {
                                if (this.validation()) {
                                    this.setState({activeTabIndex: this.state.activeTabIndex+1})
                                }
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
                        onClose = {()=>this.setState({showError: false})}
                        showOkButton={true}
                        onOkButtonClick={() => this.setState({ showError: false })}
                        buttonText = "Got IT!"
                        mode = 'error'
                    >
                        <span>Some required information is missing or incomplete. Please fill out the fields in red.</span>
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
            </div>
        );
    }
}

export default withStore(Member);