import React, { Component } from 'react';
import DropDown from './DropDown';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';
import VolunteerUpSVG from '../svg/VolunteerUpSVG';
import VeteranUpSVG from '../svg/VeteranUpSVG';
import CloseUpSVG from '../svg/CloseUpSVG';
import EditUpSVG from '../svg/EditUpSVG';

class Members extends Component {

    constructor(props) {
        super(props);
        this.state = {
            members: [],
            loadData: true,
        };
        this.chaptersDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    componentDidMount(){
            var component = this;
            this.setState({ loadData: true });
            fetch('/Members.json')
                .then(function (data) { return data.json(); })
                .then(function (jjson) {
                    component.setState({ members: jjson});
                })
                .then(function () {
                    setTimeout(() => component.setState({loadData: false}), 1500)
                });
        //Service.getEventsList(null).then(json => { component.setState({ events: json }); });
    }

    handleClick(e) {
        if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
            this.chaptersDropDownRef.state.toggle();
        }
    }

    renderFullNameColumn(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{"display":"flex", "alignItems":"center"}}>
                <span style={{"flex":"0 0 auto","height":"1.2rem"}}>
                    {row['role'] === 'VET' ? <VeteranUpSVG /> : <VolunteerUpSVG />}
                </span>
                <span style={{"display":"flex", "flexFlow":"column", "flexWrap":"nowrap","flex":"1 1 auto"}}>
                    <span style={{"fontSize":"1.1em", "flex":"1 1 auto"}}>{row['firstName'] + ' ' + row['lastName']}</span>
                    <span style={{"flex":"1 1 auto"}} className='chapter'>{row['chapter']}</span>
                </span>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.removeMember()}
                >
                    <CloseUpSVG />
                </button>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.editMember()}
                >
                    <EditUpSVG />
                </button>
            </li>
        );
    }

    render() {
        const members = this.state.members;
        const columns=[
            {title:"Member", accesor:"name", className:"borders-when-display-block", render: this.renderFullNameColumn},
            {title:"Phone", accesor:"phone"},
            {title:"Email", accesor:"email", columnMinWidth:'6em', className:'word-break'},
            {title:"Zip", accesor:"zip"},
            {title:"DOB", accesor:"dateOfBirth"}
        ];
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 mediaMin500-pl-pr-025' style={{"maxWidth":"900px"}}>
                <div className="flex-wrap align-center justify-space-between w-100 mb-2 mediaMax500-pl-pr-025">
                    <h1 className='uppercase-text'><strong>Members</strong></h1>
                    <a className='big-static-button static-button' href="/new-member"><p>ADD NEW MEMBER</p></a>
                </div>
                <div className="label-input-wrapper mediaMax500-pl-pr-025">
                    <p>CHAPTER:</p>
                    <DropDown 
                        ref={el => this.chaptersDropDownRef = el}
                        list={this.props.store.chapterList}
                        defaultValue={{name:'National'}}
                    />
                </div>
                <Table columns={columns} data={members} className={"break-at-700"}/>
            </div>
        );
    }
}

export default withStore(Members);