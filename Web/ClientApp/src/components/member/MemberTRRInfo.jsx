import React, { Component } from 'react';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import DatePicker from '../DatePicker';
import CheckBoxSVG from '../../svg/CheckBoxSVG';
import { withStore } from '../store';

class MemberTRRInfo extends Component {

    render() {
        return (
            <div>
                <div 
                    tabIndex={0} 
                    className='checkBox-wrapper mb-05 ml-1 mt-3 mr-1'
                    onClick={() => this.props.updateMemberProperty("releaseSigned", !this.props.member.releaseSigned)}
                    onKeyDown={(e) => {if(e.keyCode === 32){/* SPACE BAR */ this.props.updateMemberProperty("releaseSigned", !this.props.member.releaseSigned);}}}
                >
                    <label>
                        <input type="checkbox" disabled checked={this.props.member.releaseSigned}/>
                        <CheckBoxSVG />
                    </label>
                    <span style={{"textTransform":"uppercase", "fontWeight":"500"}}>Release Signed</span> 
                </div>

                <div 
                    tabIndex={0} 
                    className='checkBox-wrapper mb-05 ml-1 mr-1'
                    onClick={() => this.props.updateMemberProperty("liabilitySigned", !this.props.member.liabilitySigned)}
                    onKeyDown={(e) => {if(e.keyCode === 32){/* SPACE BAR */ this.props.updateMemberProperty("liabilitySigned", !this.props.member.liabilitySigned);}}}
                >
                    <label>
                        <input type="checkbox" disabled checked={this.props.member.liabilitySigned}/>
                        <CheckBoxSVG />
                    </label>
                    <span style={{"textTransform":"uppercase", "fontWeight":"500"}}>Liability Signed</span> 
                </div>
                <div className = 'flex-nowrap align-center mt-2 mb-2 ml-1 mr-1'>
                    <span className='line'></span>
                        <p className='pr-05 pl-05'><strong>ACTIVE</strong></p>
                    <span className='line'></span>
                </div>
                <div className='flex-nowrap justify-left align-center ml-1 mr-1'>
                    <ul className='input-fields first-child-text-125'>
                        <li>
                            <div 
                                tabIndex={0} 
                                className='checkBox-wrapper'
                                onClick={() => this.props.updateMemberProperty("activeMember", !this.props.member.activeMember)}
                                onKeyDown={(e) => {if(e.keyCode === 32){/* SPACE BAR */ this.props.updateMemberProperty("activeMember", !this.props.member.activeMember);}}}
                                style = {{"marginTop":"0.6rem"}}
                            >
                                <label>
                                    <input type="checkbox" disabled checked={this.props.member.activeMember}/>
                                    <CheckBoxSVG />
                                </label>
                                <span style={{"textTransform":"uppercase"}}>Active</span> 
                            </div>

                            {!this.props.member.activeMember &&
                                <div className='flex-nowrap justify-left align-center break-at-500'>
                                    <p className='break-at-500-p'>Deactive Cause:</p>
                                    <input 
                                        type='text' 
                                        placeholder='Deactive Cause' 
                                        value={this.props.member.deactiveCause}
                                        onChange={e => this.props.updateMemberProperty("deactiveCause", e.target.value)}
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
                                value={this.props.member.joinDate}
                                onSelect={value => {this.props.updateMemberProperty("joinDate", value)}}
                            />
                        </li>
                        <li>
                            <p>Sponsored By:</p>
                            <MultiDropDown
                                ref={this.props.setSponsoredByDropDownRef}
                                list={[{name:'Sponsored By Option 1'}, {name:'Sponsored By Option 2'}, {name:'Sponsored By Option 3'}]}
                                multiSelect={false}
                                keyProperty='name'
                                textProperty='name'
                                defaultValue={this.props.member.sponsoredBy}
                                placeholder="Sponsored By"
                                onDropDownValueChange={value => this.props.updateMemberProperty("sponsoredBy", value)}
                            />
                        </li>
                        <li className='input-wrapper'>
                            <p>Travel Time:</p>
                            <input 
                                type='text' 
                                placeholder='Travel Time' 
                                value={this.props.member.travelTime}
                                onChange={e => this.props.updateMemberProperty("travelTime", e.target.value)}
                            />
                        </li>
                        <li>
                            <p>Medical:</p>
                            <MultiDropDown
                                ref={this.props.setMedicalDropDownRef}
                                list={[{name:'Medical Option 1'}, {name:'Medical Option 2'}, {name:'Medical Option 3'}]}
                                multiSelect={false}
                                keyProperty='name'
                                textProperty='name'
                                defaultValue={this.props.member.medical}
                                placeholder="Medical"
                                onDropDownValueChange={value => this.props.updateMemberProperty("medical", value)}
                            />
                        </li>
                        <li>
                            <p>Injury Date:</p>
                            <DatePicker 
                                ref={this.props.setInjuryDateDropDownRef}
                                value={this.props.member.injuryDate}
                                onSelect={value => {this.props.updateMemberProperty("injuryDate", value)}}
                            />
                        </li>
                        <li>
                            <p>Status:</p>
                            <MultiDropDown
                                ref={this.props.setStatusDropDownRef}
                                list={[{name:'Status 1'}, {name:'Status 2'}, {name:'Status 3'}]}
                                multiSelect={false}
                                keyProperty='name'
                                textProperty='name'
                                defaultValue={this.props.member.status}
                                placeholder="Status"
                                onDropDownValueChange={value => this.props.updateMemberProperty("status", value)}
                            />
                        </li>
                        <li>
                            <p>Role:</p>
                            <MultiDropDown
                                ref={this.props.setAuthLevelDropDownRef}
                                list={[{name:'AuthLevel 1'}, {name:'AuthLevel 2'}, {name:'AuthLevel 3'}]}
                                multiSelect={false}
                                keyProperty='name'
                                textProperty='name'
                                defaultValue={this.props.member.authLevel}
                                placeholder="Select Authentification Level"
                                onDropDownValueChange={value => this.props.updateMemberProperty("authLevel", value)}
                            />
                        </li>
                        <li>
                            <p>TRR User Type:</p>
                            <MultiDropDown
                                ref={this.props.setUserTypeDropDownRef}
                                list={[{name:'userType 1'}, {name:'userType 2'}, {name:'userType 3'}]}
                                multiSelect={false}
                                keyProperty='name'
                                textProperty='name'
                                defaultValue={this.props.member.userType}
                                placeholder="Select User Type"
                                onDropDownValueChange={value => this.props.updateMemberProperty("userType", value)}
                            />
                        </li>
                        <li>
                            <p>Comments:</p>
                            <textarea 
                                placeholder='Comments'
                                value={this.props.member.comments}
                                onChange={e => this.props.updateMemberProperty("comments", e.target.value)}
                            />
                        </li>
                    </ul>
            </div>
        );
    }
}

export default withStore(MemberTRRInfo);