import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import { withStore } from '../store';
import MemberTRRInfo from './MemberTRRInfo';
import MemberEvents from './MemberEvents';
import RadioBoxSVG from '../../svg/RadioBoxSVG';


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
                        <li className='input-wrapper'>
                            <p>First Name:</p>
                            <input 
                                type='text' 
                                placeholder='First Name'
                                value = {this.state.member.firstName}
                                onChange={e => this.updateMemberProperty("firstName", e.target.value)}
                            />
                        </li>
                        <li className='input-wrapper'>
                            <p>Last Name:</p>
                            <input 
                                type='text' 
                                placeholder='Last Name'
                                value = {this.state.member.lastName}
                                onChange={e => this.updateMemberProperty("lastName", e.target.value)}
                            />
                        </li>
                        <li>
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
                                onDropDownValueChange={value => this.updateMemberProperty("chapter", value)}
                            />
                        </li>
                        <li className='input-wrapper'>
                            <p>Phone #:</p>
                            <input 
                                type='text' 
                                placeholder='Phone Number'
                                value = {this.state.member.phone}
                                onChange={e => this.updateMemberProperty("phone", e.target.value)}
                            />
                        </li>
                        <li className='input-wrapper'>
                            <p>Email:</p>
                            <input type='text' 
                                placeholder='Email'
                                value = {this.state.member.email}
                                onChange={e => this.updateMemberProperty("email", e.target.value)}
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
                            <p>Gender:</p>
                            <div className='flex-wrap justify-left ptpb055notNS'>

                                <div tabIndex={0} className='checkBox-wrapper'
                                    onClick = {() => this.updateMemberProperty("gender", {male: true, female: false})}
                                    onKeyDown={(e) => {
                                        if(e.keyCode === 32){/* SPACE BAR */ this.updateMemberProperty("gender", {male: true, female: false})}
                                    }}
                                    style = {{"marginRight":"0.75rem"}}
                                >
                                    <label className='radio'>
                                        <input type="radio" disabled checked={this.state.member.gender.male}/>
                                        <RadioBoxSVG />
                                    </label>
                                    <span className="checkbox-text">Male</span>
                                </div>

                                <div tabIndex={0} className='checkBox-wrapper'
                                    onClick = {() => this.updateMemberProperty("gender", {male: false, female: true})}
                                    onKeyDown={(e) => {
                                        if(e.keyCode === 32){/* SPACE BAR */ this.updateMemberProperty("gender", {male: false, female: true})}
                                    }}
                                >
                                    <label className='radio'>
                                        <input type="radio" disabled checked={this.state.member.gender.female}/>
                                        <RadioBoxSVG />
                                    </label>
                                    <span className="checkbox-text">Female</span>
                                </div>

                            </div>
                        </li>
                        <li className='input-wrapper'>
                            <p>Address:</p>
                            <input 
                                type='text' 
                                placeholder='Street Address'
                                value={this.state.member.address.streetAddress}
                                onChange={e => {
                                    let address = this.state.member.address;
                                    address.streetAddress = e.target.value;
                                    this.updateMemberProperty("address", address);
                                }}
                            />
                        </li>
                        <li>
                            <span></span>
                            <div className='flex-nowrap break-at-500 input-wrapper children-mr-08-when-width-500'>
                                <input 
                                    type='text' 
                                    placeholder='City' 
                                    style={{"flex":"1 1 auto"}}
                                    value={this.state.member.address.city}
                                    onChange={e => {
                                        let address = this.state.member.address;
                                        address.city = e.target.value;
                                        this.updateMemberProperty("address", address);
                                    }}
                                />
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
                                        let address = this.state.member.address;
                                        address.state = value;
                                        this.updateMemberProperty("address", address);
                                    }}
                                />
                                <input 
                                    type='text' 
                                    placeholder='Zip' 
                                    maxLength={5} 
                                    style={{"flex":"0 0 100px"}}
                                    value = {this.state.member.address.zip}
                                    onChange={e => {
                                        let address = this.state.member.address;
                                        address.zip = e.target.value;
                                        this.updateMemberProperty("address", address);
                                    }}
                                />
                            </div>
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
                        <button className='medium-static-button static-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex-1})}>Back</button>
                    }
                    {this.state.activeTabIndex < 2 &&
                        <button className='medium-static-button static-button default-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex+1})}>Next</button>
                    }
                    {this.state.activeTabIndex === 2 &&
                        <button className='medium-static-button static-button default-button' disabled >Save</button>
                    }
                </div>
            </div>
        );
    }
}

export default withStore(Member);