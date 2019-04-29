import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import DropDown from '../DropDown';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import { withStore } from '../store';
import MemberTRRInfo from './MemberTRRInfo';
import MemberEvents from './MemberEvents';


class Member extends Component {

    constructor(props) {
        super(props);
        let evtId = 0;
        if (props.match.params.id) {
            evtId = props.match.params.id
        }
        this.state = {
            activeTabIndex: 0,
            releaseSigned: false,
            liabilitySigned: false,
            activeMember: false,
            deactiveCause: "",
            travelTime: "",
            comments:"",
            events:[],
        };
        this.stateDropDownRef = null;
        this.dateOfBirthDropDownRef = null;
        this.chaptersDropDownRef = null;
        this.genderDropDownRef = null;
        this.joinDateDropDownRef = null;
        this.sponsoredByDropDownRef = null;
        this.medicalDropDownRef = null;
        this.injuryDateDropDownRef = null;
        this.oldStatusDropDownRef = null;
        this.oldAuthLevelDropDownRef = null;
        this.userOldTypeDropDownRef = null;
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
            if(this.stateDropDownRef.state.isOpen && !this.stateDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
                this.stateDropDownRef.state.toggle();
            }
            if(this.dateOfBirthDropDownRef.state.isOpen && !this.dateOfBirthDropDownRef.datePickerRef.contains(e.target)){
                this.dateOfBirthDropDownRef.toggle();
            }
            if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.chaptersDropDownRef.state.toggle();
            }
            if(this.genderDropDownRef.state.isOpen && !this.genderDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.genderDropDownRef.state.toggle();
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
            if(this.oldStatusDropDownRef.state.isOpen && !this.oldStatusDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.oldStatusDropDownRef.state.toggle();
            }
            if(this.oldAuthLevelDropDownRef.state.isOpen && !this.oldAuthLevelDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.oldAuthLevelDropDownRef.state.toggle();
            }
            if(this.userOldTypeDropDownRef.state.isOpen && !this.userOldTypeDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.userOldTypeDropDownRef.state.toggle();
            }
        }
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
                            <input type='text' placeholder='First Name'></input>
                        </li>
                        <li className='input-wrapper'>
                            <p>Last Name:</p>
                            <input type='text' placeholder='Last Name'></input>
                        </li>
                        <li>
                            <p>Chapter:</p>
                            <DropDown 
                                ref={el => this.chaptersDropDownRef = el}
                                list={this.props.store.chapterList}
                                defaultValue={{name:'National'}}
                            />
                        </li>
                        <li className='input-wrapper'>
                            <p>Phone #:</p>
                            <input type='text' placeholder='Phone Number'></input>
                        </li>
                        <li className='input-wrapper'>
                            <p>Email:</p>
                            <input type='text' placeholder='Email'></input>
                        </li>
                        <li>
                            <p>Date of Birth:</p>
                            <DatePicker
                                ref={el => this.dateOfBirthDropDownRef = el}
                                defaultDateToday={false}
                            />
                        </li>
                        <li>
                            <p>Gender:</p>
                            <DropDown 
                                ref={el => this.genderDropDownRef = el}
                                list={[{name:'Male'}, {name:'Female'}]}
                                placeholder='Gender'
                            />
                        </li>
                        <li className='input-wrapper'>
                            <p>Address:</p>
                            <input type='text' placeholder='Street Address'></input>
                        </li>
                        <li>
                            <span></span>
                            <div className='flex-nowrap break-at-500 input-wrapper children-mr-08-when-width-500'>
                                <input type='text' placeholder='City' style={{"flex":"1 1 auto"}}></input>
                                <DropDown
                                    ref={el => this.stateDropDownRef = el}
                                    list={stateList} 
                                    placeholder='State'
                                    showParameter='abbreviation'
                                />
                                <input type='text' placeholder='Zip' maxLength={5} style={{"flex":"0 0 100px"}}></input>
                            </div>
                        </li>
                    </ul>
                }
                {this.state.activeTabIndex === 1 && 
                    <MemberTRRInfo 
                        data = {this.state}
                        releaseSignedOnChange = {() => this.setState({releaseSigned: !this.state.releaseSigned})}
                        liabilitySignedOnChange = {() => this.setState({liabilitySigned: !this.state.liabilitySigned})}
                        activeMemberOnChange = {() => this.setState({activeMember: !this.state.activeMember})}
                        onDeactiveCauseChange = {event => this.setState({deactiveCause: event.target.value})}
                        setJoinDateDropDownRef = {el => this.joinDateDropDownRef = el}
                        setSponsoredByDropDownRef = {el => this.sponsoredByDropDownRef = el}
                        onTravelTimeChange = {event => this.setState({travelTime: event.target.value})}
                        setMedicalDropDownRef = {el => this.medicalDropDownRef = el}
                        setInjuryDateDropDownRef = {el => this.injuryDateDropDownRef = el}
                        setOldStatusDropDownRef = {el => this.oldStatusDropDownRef = el}
                        setOldAuthLevelDropDownRef = {el => this.oldAuthLevelDropDownRef = el}
                        setUserOldTypeDropDownRef = {el => this.userOldTypeDropDownRef = el} 
                        onCommentsChange = {event => this.setState({comments: event.target.value})}
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