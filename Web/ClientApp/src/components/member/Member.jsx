import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import { withStore } from '../store';
import MemberTRRInfo from './MemberTRRInfo';
import MemberEvents from './MemberEvents';
import RadioBoxSVG from '../../svg/RadioBoxSVG';
import Alert from '../Alert';
import RadioButton from '../RadioButton';


class Member extends Component {

    constructor(props) {
        super(props);
        let evtId = 0;
        if (props.match.params.id) {
            evtId = props.match.params.id
        }
        this.state = {
            member: {
                chapter: [],
                firstName: '',
                lastName: '', 
                phone: '',
                email: '',
                dateOfBirth: null,
                gender: {
                    male: false,
                    female: false,
                },
                address: {
                    streetAddress: '',
                    city: '',
                    state: [],
                    zip: '',
                },
                releaseSigned: false,
                liabilitySigned: false,
                activeMember: false,
                deactiveCause: '',
                joinDate: null,
                sponsoredBy: [],
                travelTime: '',
                medical: [],
                injuryDate: null,
                status: [],
                authLevel: [],
                userType: [],
                comments: '',
                events:[],
            },
            activeTabIndex: 0,
            showError: false,
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
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    componentDidMount() {
        var component = this;
        fetch('../Events2.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({events: jjson})
        })
        .then(console.log(this.state.events));
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
        }
        if(this.state.activeTabIndex === 1){
            if(this.joinDateDropDownRef.state.isOpen && !this.joinDateDropDownRef.datePickerRef.contains(e.target)){
                this.joinDateDropDownRef.toggle();
            }
            if(this.sponsoredByDropDownRef.state.isOpen && !this.sponsoredByDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.sponsoredByDropDownRef.state.toggle();
            }
            if(this.medicalDropDownRef.state.isOpen && !this.medicalDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.medicalDropDownRef.state.toggle();
            }
            if(this.injuryDateDropDownRef.state.isOpen && !this.injuryDateDropDownRef.datePickerRef.contains(e.target)){
                this.injuryDateDropDownRef.toggle();
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
                if(this.state.member.chapter.length < 1) {
                    this.emptyChapter = true;
                }
                if(this.state.member.firstName.length < 1) {
                    this.emptyFirstName = true;
                }
                if(this.state.member.lastName.length < 1) {
                    this.emptyLastName = true;
                }
                if(this.state.member.phone.length < 1) {
                    this.emptyPhone = true;
                }
                if(this.state.member.email.length < 1) {
                    this.emptyEmail = true;
                }
                if(this.state.member.dateOfBirth === null) {
                    this.emptyDateOfBirth = true;
                }
                if(this.state.member.gender.male  === false && this.state.member.gender.female  === false) {
                    this.emptyGender = true;
                }
                if(this.state.member.address.streetAddress.length < 1) {
                    this.emptyStreetAddress = true;
                }
                if(this.state.member.address.city.length < 1) {
                    this.emptyCity = true;
                }
                if(this.state.member.address.zip.length < 1) {
                    this.emptyZip = true;
                }
                if(this.state.member.address.state < 1) {
                    this.emptyState = true;
                }
                if (this.emptyChapter || this.emptyFirstName || this.emptyLastName || this.emptyPhone || this.emptyEmail || this.emptyDateOfBirth || this.emptyGender || this.emptyStreetAddress || this.emptyCity || this.emptyZip || this.emptyState){
                    this.setState({showError: true});
                    validationPassed = false;
                }
            }
        return validationPassed;
    }
    
    render() {
        const pictures = this.state.formattedPicturesList;
        const stateList = [{"name": "Alabama", "abbreviation": "AL"},{"name":"Alaska", "abbreviation":"AK"},{"name":"Arizona", "abbreviation": "AZ"},{"name":"Arkansas", "abbreviation":"AR"},{"name":"California", "abbreviation":"CA"},{"name":"Colorado", "abbreviation":"CO"},{"name":"Connecticut", "abbreviation":"CT"},{"name":"Delaware", "abbreviation":"DE"},{"name":"Florida", "abbreviation":"FL"},{"name":"Georgia", "abbreviation":"GA"},{"name":"Hawaii", "abbreviation":"HI"},{"name":"Idaho", "abbreviation":"ID"},{"name":"Illinois", "abbreviation":"IL"},{"name":"Indiana", "abbreviation":"IN"},{"name":"Iowa", "abbreviation":"IA"},{"name":"Kansas", "abbreviation":"KS"},{"name":"Kentucky", "abbreviation":"KY"},{"name":"Louisiana", "abbreviation":"LA"},{"name":"Maine", "abbreviation":"ME"},{"name":"Maryland", "abbreviation":"MD"},{"name":"Massachusetts", "abbreviation":"MA"},{"name":"Michigan", "abbreviation":"MI"},{"name":"Minnesota", "abbreviation":"MN"},{"name":"Mississippi", "abbreviation":"MS"},{"name":"Missouri", "abbreviation":"MO"},{"name":"Montana", "abbreviation":"MT"},{"name":"Nebraska", "abbreviation":"NE"},{"name":"Nevada", "abbreviation":"NV"},{"name":"New Hampshire", "abbreviation":"NH"},{"name":"New Jersey", "abbreviation":"NJ"},{"name":"New Mexico", "abbreviation":"NM"},{"name":"New York", "abbreviation":"NY"},{"name":"North Carolina", "abbreviation":"NC"},{"name":"North Dakota", "abbreviation":"ND"},{"name":"Ohio", "abbreviation":"OH"},{"name":"Oklahoma", "abbreviation":"OK"},{"name":"Oregon", "abbreviation":"OR"},{"name":"Pennsylvania", "abbreviation":"PA"},{"name":"Rhode Island", "abbreviation":"RI"},{"name":"South Carolina", "abbreviation":"SC"},{"name":"South Dakota", "abbreviation":"SD"},{"name":"Tennessee", "abbreviation":"TN"},{"name":"Texas", "abbreviation":"TX"},{"name":"Utah", "abbreviation":"UT"},{"name":"Vermont", "abbreviation":"VT"},{"name":"Virginia", "abbreviation":"VA"},{"name":"Washington", "abbreviation":"WA"},{"name":"West Virginia", "abbreviation":"WV"},{"name":"Wisconsin", "abbreviation":"WI"},{"name":"Wyoming", "abbreviation":"WY"}];
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
                <h1 className='uppercase-text mb-2'>New<strong> Member</strong></h1>
                <TabComponent 
                    inheritParentHeight={false}
                    tabList={['personal info', 'TRR info', 'events']}
                    wasSelected={(index) => this.setState({activeTabIndex: index})}
                    activeTabIndex={this.state.activeTabIndex}
                    tabEqualWidth={true}
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
                                defaultValue={this.state.member.chapter}
                                placeholder="Select chapter"
                                onDropDownValueChange={value => {
                                    if(this.emptyChapter) {this.emptyChapter = false;}
                                    this.updateMemberProperty("chapter", value);
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
                        <li className={this.emptyGender ? 'mark-invalid' : ''}
                            error-text='Please select Gender'
                        >
                            <p>Gender:</p>
                            <div className='flex-wrap justify-left radio-inline-wrapper'>
                                <RadioButton
                                    style = {{"marginRight":"0.75rem"}}
                                    radioGroupElement = {this.state.member.gender}
                                    radioButtonValue = 'male'
                                    onClick = {(value) => {
                                        this.updateMemberProperty("gender", value);
                                        this.emptyGender = false;
                                    }}
                                    labelClassName = "checkbox-text"
                                    labelText = 'Male'
                                />
                                <RadioButton
                                    radioGroupElement = {this.state.member.gender}
                                    radioButtonValue = 'female'
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
                                value={this.state.member.address.streetAddress}
                                onChange={e => {
                                    if(this.emptyStreetAddress){this.emptyStreetAddress = false;}
                                    let address = this.state.member.address;
                                    address.streetAddress = e.target.value;
                                    this.updateMemberProperty("address", address);
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
                                        value={this.state.member.address.city}
                                        onChange={e => {
                                            if(this.emptyCity){this.emptyCity = false;}
                                            let address = this.state.member.address;
                                            address.city = e.target.value;
                                            this.updateMemberProperty("address", address);
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
                                            defaultValue={this.state.member.address.state}
                                            placeholder="State"
                                            textPropertyRender = {(element, textProperty) => this.stateNameAndAbbrRender(element, textProperty)}
                                            onDropDownValueChange={value => {
                                                if(this.emptyState){this.emptyState = false;}
                                                let address = this.state.member.address;
                                                address.state = value;
                                                this.updateMemberProperty("address", address);
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
                                        value = {this.state.member.address.zip}
                                        onChange={e => {
                                            if(this.emptyZip){this.emptyZip = false;}
                                            let address = this.state.member.address;
                                            address.zip = e.target.value;
                                            this.updateMemberProperty("address", address);
                                        }}
                                    />
                                </li>
                            </ul>
                        </li>
                    </ul>
                }
                {this.state.activeTabIndex === 1 && 
                    <MemberTRRInfo 
                        setJoinDateDropDownRef = {el => this.joinDateDropDownRef = el}
                        setSponsoredByDropDownRef = {el => this.sponsoredByDropDownRef = el}
                        setMedicalDropDownRef = {el => this.medicalDropDownRef = el}
                        setInjuryDateDropDownRef = {el => this.injuryDateDropDownRef = el}
                        setStatusDropDownRef = {el => this.statusDropDownRef = el}
                        setAuthLevelDropDownRef = {el => this.authLevelDropDownRef = el}
                        setUserTypeDropDownRef = {el => this.userTypeDropDownRef = el} 

                        member = {this.state.member}
                        updateMemberProperty = {(property, value) => this.updateMemberProperty(property, value)}
                    />
                }
                {this.state.activeTabIndex === 2 && 
                    <MemberEvents events={this.state.events}/>
                }
                <div className='flex-wrap mt-2'>
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
                    {this.state.activeTabIndex === 2 &&
                        <button className='medium-static-button static-button default-button' disabled >Save</button>
                    }
                    {this.state.showError && 
                        <Alert 
                            headerText = 'Error'
                            onClose = {()=>this.setState({showError: false})}
                            showOkButton = {true}
                            buttonText = "Got IT!"
                            mode = 'error'
                        >
                        <span>Some required information is missing or incomplete. Please fill out the fields in red.</span>
                        </Alert>
                    }
                </div>
            </div>
        );
    }
}

export default withStore(Member);