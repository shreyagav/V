import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import CloseUpSVG from '../../svg/CloseUpSVG';
import ArrowUpSVG from '../../svg/ArrowUpSVG';
import EditUpSVG from '../../svg/EditUpSVG';
import { withStore } from '../store';
import EditContact from '../EditContact';
import CheckBoxSVG from '../../svg/CheckBoxSVG';

class Chapter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chapter: {
                chapterName:'',
                state: '',
                securityClearance: '',
                poolRental: false,
                contactMain: {name: '', phone: '', email: ''},
                contactGovernment: {name: '', phone: '', email: ''},
                contactCoordinator: {name: '', phone: '', email: ''},
                contactNational: {name: '', phone: '', email: ''},
                contactOutreach: {name: '', phone: '', email: ''}
            },
            activeTabIndex: 0,
            regions: [],
            members: [],
        };
        this.regionsDropDownRef = null;
        this.poolRentalDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    componentDidMount(){
        var component = this;
        fetch('/Regions.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({regions: jjson})
        });
        fetch('/Members.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({members: jjson})
        });
    }

    handleClick(e) {
        if(this.state.activeTabIndex === 0){
            if(this.regionsDropDownRef.state.isOpen && !this.regionsDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.regionsDropDownRef.state.toggle(); /* actual */
            }
        }
    }

    toggleContact(key){
        const state = this.state;
        state[key] = !state[key];
        this.setState(state);
    }

    setValue(key, value){
        const state = this.state;
        state[key] = value;
        this.setState(state);
    }

    changeProperty(property, value){
        let chapter = this.state.chapter;
        chapter[property] = value;
        this.setState({chapter, chapter}, console.log(this.state.chapter));
    }

    render() {
        const members = this.state.members;
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
                <h1 className='uppercase-text mb-2'>New<strong>Chapter</strong></h1>
                <TabComponent 
                    fixedHeight={true}
                    tabList = {['General Info', 'Members']}
                    wasSelected = {(index) => this.setState({activeTabIndex: index})}
                    activeTabIndex = {this.state.activeTabIndex}
                />
                {this.state.activeTabIndex === 0 &&
                <div style={{"width":"100%", "maxWidth":"600px"}}>
                    <ul className='input-fields first-child-text-165 mt-3 mb-2 pl-1 pr-1'>
                        <li>
                            <p>Chapter Name:</p>
                            <input type='text' 
                                placeholder='Chapter Name'
                                value = {this.state.chapter.chapterName} 
                                onChange={(e) => this.changeProperty("chapterName", e.target.value)}
                            />
                        </li>
                        <li>
                            <p>Region:</p>
                            <MultiDropDown
                                ref={el => this.regionsDropDownRef = el}
                                list={this.props.store.chapterList}
                                multiSelect={false}
                                keyProperty='id'
                                textProperty='state'
                                defaultValue={this.state.chapter.state}
                                placeholder="Select state"
                                onDropDownValueChange={value => {
                                    this.changeProperty("state", value);
                                }}
                            />
                        </li>
                        <li>
                            <p>Security Clearace:</p>
                            <input type='text' 
                                placeholder='Security Clearance'
                                value = {this.state.chapter.securityClearance} 
                                onChange={(e) => this.changeProperty("securityClearance", e.target.value)}
                            />
                        </li>
                        <li>
                            <p>Pool Rental:</p>
                            <div 
                                tabIndex={0} 
                                className='checkBox-wrapper'
                                onClick={() => {this.changeProperty("poolRental", !this.state.chapter.poolRental)}}
                                onKeyDown={(e) => {if(e.keyCode === 32){/* SPACE BAR */ this.changeProperty("poolRental", !this.state.chapter.poolRental)}}}
                                style = {{"marginTop":"0.6rem"}}
                            >
                                <label>
                                    <input type="checkbox" disabled checked={this.state.chapter.poolRental}/>
                                    <CheckBoxSVG />
                                </label>
                                {this.state.chapter.poolRental ? <span className="checkbox-text italic">Yes</span> : <span className="checkbox-text italic">No</span>}
                            </div>
                        </li>
                    </ul>
                    <div className = 'flex-nowrap align-center mt-3 mb-3 ml-1 mr-1'>
                        <span className='line'></span>
                        <p className='pr-05 pl-05'><strong>CONTACTS</strong></p>
                        <span className='line'></span>
                    </div>
                    <ul className='input-fields first-child-text-165 mt-3 mb-2 pl-1 pr-1'>
                        <EditContact 
                            header={"Main:"}
                            value={this.state.chapter.contactMain}
                            onValueChange = {value => this.changeProperty("contactMain", value)}
                        />
                        <EditContact 
                            header={"Government:"}
                            value={this.state.chapter.contactGovernment}
                            onValueChange = {value => this.changeProperty("contactGovernment", value)}
                        />
                        <EditContact 
                            header={"Coordinator:"}
                            value={this.state.chapter.contactOutreach}
                            onValueChange = {value => this.changeProperty("contactOutreach", value)}
                        />
                        <EditContact 
                            header={"National:"}
                            value={this.state.chapter.contactNational}
                            onValueChange = {value => this.changeProperty("contactNational", value)}
                        />
                        <EditContact 
                            header={"Outreach:"} 
                            value={this.state.chapter.contactOutreach}
                            onValueChange = {value => this.changeProperty("contactOutreach", value)}
                        />
                    </ul>
                </div>
                }
                {this.state.activeTabIndex === 1 && 
                <div style={{"width":"100%", "maxWidth":"600px"}}>
                    <div className="flex-wrap align-center justify-center mt-2 mb-2">
                        <p className='input-label pr-1s '>ADD MEMBERS:</p>
                        <span className="flex-nowrap">
                            <button disabled className='big-static-button static-button' >
                                Create New
                            </button>
                            <button disabled className='big-static-button static-button' >
                                Add Member
                            </button>
                        </span>
                    </div>
                    <ul className='table-element mt-1 mb-2'>
                        <li>
                            <ul className='table-element-header table-element-member table-member'>
                                <li>Name</li>
                                <li className='no-break'>Role</li>
                                <li>Phone</li>
                                <li>Email</li>
                                <li></li>
                            </ul>
                        </li>
                        {
                        members.map((element,index) => 
                            <ul key={index} className='table-element-content table-element-member table-member'>
                                <li >{element.firstName + " " + element.lastName}</li>
                                <li className='no-break'>{element.role}</li>
                                <li >{element.phone}</li>
                                <li >{element.email}</li>
                                <li className='no-padding'>
                                <button disabled className='square-button-width'>
                                    <CloseUpSVG svgClassName='flip90'/>
                                </button>
                                </li>
                            </ul>
                            )
                        }
                    </ul>
                </div>
                }
                <div className='flex-wrap'>
                    {this.state.activeTabIndex > 0 &&
                        <button className='medium-static-button static-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex-1})}>Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button className='medium-static-button static-button default-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex+1})}>Next</button>
                    }
                    {this.state.activeTabIndex === 3 &&
                        <button className='medium-static-button static-button default-button' disabled >Save</button>
                    }
                </div>
            </div>
        );
    }
}

export default withStore(Chapter);