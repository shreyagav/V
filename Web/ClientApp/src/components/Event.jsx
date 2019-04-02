import React, { Component } from 'react';
import TabComponent from './TabComponent';
import DropDown from './DropDown';
import DatePicker from './DatePicker';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';

class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            repeatedEventsIsOpen: true,
            activeTabIndex: 0,
            members: [],
        };
        this.colorDropDownRef = null;
        this.dayDropDownRef = null;
        this.numberDropDownRef = null;
        this.timeFromDropDownRef = null;
        this.timeToDropDownRef = null;
        this.dateStartDropDownRef = null;
        this.dateEndDropDownRef = null;
        this.chaptersDropDownRef = null;
        this.typeOfEventDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    componentDidMount(){
        var component = this;
        fetch('/Members.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({members: jjson})
        });
    }

    handleClick(e) {
        if(this.state.activeTabIndex === 0){
            if(this.colorDropDownRef.state.isOpen && !this.colorDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
                this.colorDropDownRef.state.toggle();
            }
            if(this.typeOfEventDropDownRef.state.isOpen && !this.typeOfEventDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
                this.typeOfEventDropDownRef.state.toggle();
            }
            if(this.dayDropDownRef.state.isOpen && !this.dayDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.dayDropDownRef.state.toggle();
            }
            if(this.numberDropDownRef.state.isOpen && !this.numberDropDownRef.timeNumberPickerRef.contains(e.target)){
                this.numberDropDownRef.toggle();
            }
            if(this.timeFromDropDownRef.state.isOpen && !this.timeFromDropDownRef.timeNumberPickerRef.contains(e.target)){
                this.timeFromDropDownRef.toggle();
            }
            if(this.timeToDropDownRef.state.isOpen && !this.timeToDropDownRef.timeNumberPickerRef.contains(e.target)){
                this.timeToDropDownRef.toggle();
            }
            if(this.dateStartDropDownRef.state.isOpen && !this.dateStartDropDownRef.datePickerRef.contains(e.target)){
                this.dateStartDropDownRef.toggle();
            }
            if(this.dateEndDropDownRef.state.isOpen && !this.dateEndDropDownRef.datePickerRef.contains(e.target)){
                this.dateEndDropDownRef.toggle();
            }
            if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.chaptersDropDownRef.state.toggle();
            }
        }
    }

    toggleRepeatedEvents(){
        this.setState({repeatedEventsIsOpen: !this.state.repeatedEventsIsOpen});
    }

    render() {
        const members = this.state.members;
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2' style={{"margin":"1rem"}}>
                <h1 className='uppercase-text mb-2'>New<strong> Event</strong></h1>
                <TabComponent 
                    height={'3rem'}
                    fontSize={'1rem'}
                    tabList={['info', 'attendees', 'budget', 'pictures']}
                    //proceedInOrder={true}
                    tabEqualWidth={true}
                    wasSelected={(index) => this.setState({activeTabIndex: index})}
                    activeTabIndex={this.state.activeTabIndex}
                />
                {this.state.activeTabIndex === 0 &&
                    <ul className='input-fields first-child-text-120 mt-3 mb-3'>
                        <li>
                            <p>Event Title:</p>
                            <input type='text' placeholder=''></input>
                        </li>
                        <li>
                            <p>Chapter:</p>
                            <DropDown 
                                ref={el => this.chaptersDropDownRef = el}
                                list={this.props.store.chapterList}
                                defaultValue={{name:'National'}}
                            />
                        </li>
                        <li>
                            <p>Start Date:</p>
                            <DatePicker
                                ref={el => this.dateStartDropDownRef = el}
                            />
                        </li>
                        <li>
                            <p></p>
                            <div>
                                <div className='flex-nowrap mb-1'>
                                        <p className='flex11auto'>For repeated events</p>
                                        <button 
                                            disabled
                                            className='arrow-button arrow-button-25square' 
                                            onClick={() => {this.toggleRepeatedEvents();}}
                                        >
                                            {/*<ArrowUpSVG svgClassName={this.state.repeatedEventsIsOpen ? 'flip90' : 'flip270'}/>*/}
                                        </button>
                                </div>
                                {this.state.repeatedEventsIsOpen && 
                                    <ul className='input-fields'>
                                        <li className='number-field'>
                                            <p>repeats every:</p>
                                            <TimePicker 
                                                ref={el => this.numberDropDownRef = el}
                                                timePickerMode={false}
                                            />
                                            <DropDown
                                                ref={el => this.dayDropDownRef = el}
                                                list={[{"name":"day"}, {"name":"week"}, {"name": "month"}, {"name":"year"}]} 
                                                defaultValue={{"name":"day"}}
                                            />
                                        </li>
                                        <li className='flex-wrap align-center'>
                                                <p>Repeats on:</p>
                                                <span className='buttonlike-checkbox add-margin flex-wrap justify-left align-center'>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>SU</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>MO</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>TU</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>WE</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>TH</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>FR</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>SA</span>
                                                    </label>
                                                </span>
                                        </li>
                                        <li className='flex-nowrap fit-content align-center' style={{"marginTop":"-0.3rem"}}>
                                            <p>End Date:</p>
                                            <DatePicker 
                                                ref={el => this.dateEndDropDownRef = el}
                                            />
                                        </li>
                                    </ul>
                                }
                            </div>
                        </li>
                        <li>
                            <p>From:</p>
                            <ul className='input-fields-child-ul time-fields'>
                                <li>
                                    <TimePicker 
                                        ref={el => this.timeFromDropDownRef = el}
                                        timePickerMode={true}
                                    />
                                </li>
                                <li><p>to:</p></li>
                                <li>
                                    <TimePicker 
                                        ref={el => this.timeToDropDownRef = el}
                                        timePickerMode={true}
                                    />
                                </li>
                            </ul>
                        </li>
                        <li>
                            <p>Type of event:</p>
                            <DropDown
                                ref={el => this.typeOfEventDropDownRef = el}
                                list={[{name: 'Pool Session'}, {name: 'Flat or White Water Session'}, {name: 'National Event'}, {name: 'Regional Event'}, {name: 'Chapter Planning Party'}]} 
                                defaultValue={{name: 'Pool Session'}}
                            />
                        </li>
                        <li>
                            <p>Color:</p>
                            <DropDown
                                ref={el => this.colorDropDownRef = el}
                                list={[{name: 'blue', color: '#0099cc'}, {name: 'orange', color: '#ff9933'}, {name: 'green', color: '#669933'}, {name: 'purple', color: '#9252a0'}, {name: 'grey', color: '#666666'}, {name: 'mint', color: '#33cc99'}]} 
                                defaultValue={{name: 'green', color: '#669933'}}
                            />
                        </li>
                        <li>
                            <p>Description:</p>
                            <textarea placeholder='Description'/>
                        </li>
                    </ul>
                }
                {this.state.activeTabIndex === 1 && 
                <div style={{"width":"100%", "maxWidth":"600px"}}>
                    <ul className='table-element mt-3 mb-3'>
                        <li>
                            <ul className='table-element-header table-element-member'>
                                <li >Name</li>
                                <li >Role</li>
                                <li >Phone</li>
                                <li >Email</li>
                                <li ></li>
                            </ul>
                        </li>
                        {
                        members.map((element,index) => 
                            <ul key={index} className='table-element-content table-element-member'>
                                <li >{element.firstName + " " + element.lastName}</li>
                                <li >{element.role}</li>
                                <li >{element.phone}</li>
                                <li >{element.email}</li>
                                <li ></li>
                            </ul>
                            )
                        }
                    </ul>
                </div>
                }
                <div className='flex-wrap mb-3'>
                    {this.state.activeTabIndex > 0 &&
                        <button className='medium-static-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex-1})}>Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button className='medium-static-button default-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex+1})}>Next</button>
                    }
                    {this.state.activeTabIndex === 3 &&
                        <button className='medium-static-button default-button' disabled >Save</button>
                    }
                </div>
            </div>
        );
    }
}

export default withStore(Event);