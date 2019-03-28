import React, { Component } from 'react';
import TabComponent from './TabComponent';
import DropDown from './DropDown';
import DatePicker from './DatePicker';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import DropDownSimple from './DropDownSimple';
import TimePicker from './TimePicker';

export class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {
            repeatedEventsIsOpen: true,
        };
        this.colorDropDownRef = null;
        this.dayDropDownRef = null;
        this.numberDropDownRef = null;
        this.timeFromDropDownRef = null;
        this.timeToDropDownRef = null;
        this.dateStartDropDownRef = null;
        this.dateEndDropDownRef = null;
        this.chaptersDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    handleClick(e) {
        if(this.colorDropDownRef.state.isOpen && !this.colorDropDownRef.dropDownSimpleRef.contains(e.target)) {
            this.colorDropDownRef.toggle();
        }
        if(this.dayDropDownRef.state.isOpen && !this.dayDropDownRef.dropDownSimpleRef.contains(e.target)){
            this.dayDropDownRef.toggle();
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

    toggleRepeatedEvents(){
        this.setState({repeatedEventsIsOpen: !this.state.repeatedEventsIsOpen});
    }

    render() { 
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2' style={{"margin":"1rem"}}>
                <h1 className='uppercase-text mb-2'>New<strong> Event</strong></h1>
                <TabComponent 
                    height={'3rem'}
                    fontSize={'1rem'}
                    tabList={['info', 'budget', 'pictures', 'attendees']}
                    proceedInOrder={true}
                    tabEqualWidth={true}
                />
                <ul className='input-fields first-child-text-120 mt-3 mb-3'>
                    <li>
                        <p>Event Title:</p>
                        <input type='text' placeholder=''></input>
                    </li>
                    <li>
                        <p>Chapter:</p>
                        <DropDown 
                            ref={el => this.chaptersDropDownRef = el}
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
                                        <DropDownSimple 
                                            ref={el => this.dayDropDownRef = el}
                                            list={[{"value":"day"}, {"value":"week"}, {"value": "month"}, {"value":"year"}]} 
                                            defaultValue={[{"value":"day"}]}
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
                        <input type='text' placeholder='Pool'></input>
                    </li>
                    <li>
                        <p>Color:</p>
                        <DropDownSimple 
                            ref={el => this.colorDropDownRef = el}
                            list={[{value: 'blue', color: '#0099cc'}, {value: 'orange', color: '#ff9933'}, {value: 'green', color: '#669933'}, {value: 'purple', color: '#9252a0'}, {value: 'grey', color: '#666666'}, {value: 'mint', color: '#33cc99'}]} 
                            defaultValue={[{value: 'green', color: '#669933'}]}
                        />
                    </li>
                </ul>
                <div className='flex-wrap mb-3'>
                    <button className='medium-static-button'>Back</button>
                    <button className='medium-static-button default-button'>Next</button>
                </div>
            </div>
        );
    }
}

export default Event;