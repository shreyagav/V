import React, { Component } from 'react';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import DatePicker from '../DatePicker';
import { withStore } from '../store';

class MemberTRRInfo extends Component {

    render() {
        return (
            <div>
                <div className='flex-nowrap justify-left align-center mb-1 mt-3 ml-1 mr-1'>
                    <label>
                        <input type="checkbox" checked={this.props.data.releaseSigned} onChange={this.props.releaseSignedOnChange} />
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 12 12" >
                            <polygon className='svg' points="5.3,11 4.2,11 0,5.3 1.1,4.4 4.7,9.4 10.9,1 12,1.8 " />
                        </svg>
                    </label>
                    <p className='pl-05' style={{"textTransform":"uppercase", "fontWeight":"500"}}>Release Signed</p>
                </div>
                <div className='flex-nowrap justify-left align-center mb-05 ml-1 mr-1'>
                    <label>
                        <input type="checkbox" checked={this.props.data.liabilitySigned} onChange={this.props.liabilitySignedOnChange} />
                         <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 12 12" >
                            <polygon className='svg' points="5.3,11 4.2,11 0,5.3 1.1,4.4 4.7,9.4 10.9,1 12,1.8 " />
                        </svg>
                    </label>
                    <p className='pl-05' style={{"textTransform":"uppercase", "fontWeight":"500"}}>Liability Signed</p>
                </div>
                <div className = 'flex-nowrap align-center mt-2 mb-2 ml-1 mr-1'>
                    <span className='line'></span>
                        <p className='pr-05 pl-05'><strong>ACTIVE</strong></p>
                    <span className='line'></span>
                </div>
                <div className='flex-nowrap justify-left align-center ml-1 mr-1'>
                    <ul className='input-fields first-child-text-125'>
                        <li>
                            <div className='flex-nowrap justify-left align-center' style={{"marginTop":"0.65rem"}}>
                                <label>
                                    <input type="checkbox" checked={this.props.data.activeMember} onChange={this.props.activeMemberOnChange} />
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 12 12" >
                                        <polygon className='svg' points="5.3,11 4.2,11 0,5.3 1.1,4.4 4.7,9.4 10.9,1 12,1.8 " />
                                    </svg>
                                </label>
                                <p className='pl-05' style={{"marginTop":"0px"}}>Active</p>
                            </div>
                            {!this.props.data.activeMember &&
                                <div className='flex-nowrap justify-left align-center break-at-500'>
                                    <p className='break-at-500-p'>Deactive Cause:</p>
                                    <input 
                                        type='text' 
                                        placeholder='Deactive Cause' 
                                        value={this.props.data.deactiveCause}
                                        onChange={this.props.onDeactiveCauseChange}
                                    />
                                </div>
                            }
                        </li>
                    </ul>
                </div>
                <div className = 'flex-nowrap align-center mt-2 mb-2 ml-1 mr-1'>
                    <span className='line'></span>
                    <p className='pr-05 pl-05'><strong>INFO</strong></p>
                    <span className='line'></span>
                </div>
                <ul className='input-fields first-child-text-125 mt-3 pl-1 pr-1'>
                        <li>
                            <p>Join Date:</p>
                            <DatePicker
                                ref={this.props.setJoinDateDropDownRef}
                            />
                        </li>
                        <li>
                            <p>Sponsored By:</p>
                            {/*<DropDown 
                                ref={this.props.setSponsoredByDropDownRef}
                                list={[{name:'Sponsored By Option 1'}, {name:'Sponsored By Option 2'}, {name:'Sponsored By Option 3'}]}
                                placeholder='Sponsored By'
                            />*/}
                        </li>
                        <li className='input-wrapper'>
                            <p>Travel Time:</p>
                            <input 
                                type='text' 
                                placeholder='Travel Time' 
                                value={this.props.data.travelTime}
                                onChange={this.props.onTravelTimeChange}
                            />
                        </li>
                        <li>
                            <p>Medical:</p>
                            {/*<DropDown 
                                ref={this.props.setMedicalDropDownRef}
                                list={[{name:'Medical Option 1'}, {name:'Medical Option 2'}, {name:'Medical Option 3'}]}
                                placeholder='Medical'
                            />*/}
                        </li>
                        <li>
                            <p>Injury Date:</p>
                            <DatePicker
                                ref={this.props.setInjuryDateDropDownRef}
                            />
                        </li>
                        <li>
                            <p>Status:</p>
                            {/*<DropDown 
                                ref={this.props.setOldStatusDropDownRef}
                                list={[{name:'Status 1'}, {name:'Status 2'}, {name:'Status 3'}]}
                                defaultValue={{name:'Status 1'}}
                            />*/}
                        </li>
                        <li>
                            <p>Role:</p>
                            {/*<DropDown 
                                ref={this.props.setOldAuthLevelDropDownRef}
                                list={[{name:'AuthLevel 1'}, {name:'AuthLevel 2'}, {name:'AuthLevel 3'}]}
                                defaultValue={{name:'AuthLevel 1'}}
                            />*/}
                        </li>
                        <li>
                            <p>TRR User Type:</p>
                            {/*<DropDown 
                                ref={this.props.setUserOldTypeDropDownRef}
                                list={[{name:'userType 1'}, {name:'userType 2'}, {name:'userType 3'}]}
                                defaultValue={{name:'userType 1'}}
                            />*/}
                        </li>
                        <li>
                            <p>Comments:</p>
                            <textarea 
                                placeholder='Comments'
                                value={this.props.data.comments}
                                onChange={this.props.onCommentsChange}
                            />
                        </li>
                    </ul>
            </div>
        );
    }
}

export default withStore(MemberTRRInfo);