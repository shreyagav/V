import React, { Component } from 'react';
import TabComponent from './TabComponent';
import DropDown from './DropDown';

export class Event extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
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
                        <input placeholder=''></input>
                    </li>
                    <li>
                        <p>Chapter:</p>
                        <DropDown />
                    </li>
                    <li>
                        <p>Start Date:</p>
                        <input placeholder='mm/dd/yy'></input>
                    </li>
                    <li>
                        <p></p>
                        <ul className='input-fields'>
                            <li><p>For repeated events</p></li>
                            <li className='flex-wrap align-center'>
                                <span className='fb-11auto flex-nowrap align-center'>
                                    <p>repeats every:</p>
                                    <input type="number" min="1" max="99" placeholder='1' className='fb-1050px'></input>
                                </span>
                                <input placeholder='Day' className='fb-55100px align-self-stretch'></input>
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
                            <li className='flex-nowrap fit-content align-center'>
                                <p>End Date:</p>
                                <input placeholder='mm/dd/yy'></input>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p>From:</p>
                        <div className='flex-nowrap align-center'>
                            <input className='fb-55100px' placeholder='08:00 AM'></input>
                            <p>to:</p>
                            <input className='fb-55100px' placeholder='08:00 PM'></input>
                            <span className="fb-00100px"></span>
                        </div>
                    </li>
                    <li>
                        <p>Type of event:</p>
                        <div className='flex-nowrap align-center'>
                            <input className='fb-55100px' placeholder='Pool'></input>
                            <p>Color:</p>
                            <input className='fb-00100px' placeholder='Blue'></input>
                        </div>
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