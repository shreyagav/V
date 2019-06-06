import React, { Component } from 'react';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';
import VolunteerUpSVG from '../svg/VolunteerUpSVG';
import VeteranUpSVG from '../svg/VeteranUpSVG';
import CloseUpSVG from '../svg/CloseUpSVG';
import EditUpSVG from '../svg/EditUpSVG';
import Loader from './Loader';
import { Link } from 'react-router-dom';

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
    updateList(props) {
        let actualFilters = {};
        this.setState({ loadData: true });
        props.filters.forEach(a => {
            if (Array.isArray(a.value) && a.value.length > 0) {
                actualFilters[a.name] = a.value;
            } else if (typeof (a.value) == "string" && a.value != "") {
                actualFilters[a.name] = a.value;
            } else if (a.value instanceof Date && !isNaN(a.value.valueOf())) {
                actualFilters[a.name] = a.value.toISOString().slice(0, 10);
            } else if (typeof (a.value) == "object" && a.value != null) {
                if (a.value.activated) {
                    actualFilters[a.name] = a.value;
                }
            } else if (typeof (a.value) == "number" && a.value != 0) {
                actualFilters[a.name] = a.value;
            }
        });
        console.log(actualFilters);
        Service.getFilteredMembers(actualFilters).then(json => { this.setState({ members: json, loadData:false }); });
    }

    componentWillReceiveProps(props) {
        let temp = JSON.stringify(props.filters);
        if (temp != this.filtersStr) {
            this.filtersStr = temp;
            this.updateList(props);
        }
    }

    componentWillMount(){
        document.addEventListener("mousedown", this.handleClick, false);
        let filters = this.props.filters;
        filters.push({name: "chapters", value: []});
        this.props.updateFilters(filters);
    }
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    componentDidMount(){
        this.filtersStr = JSON.stringify(this.props.filters);
        this.updateList(this.props);
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
                    {row['oldType'] === 54 ? <VeteranUpSVG /> : <VolunteerUpSVG />}
                </span>
                <Link to={"/member/" + row["id"]}>
                    <span style={{ "display": "flex", "flexFlow": "column", "flexWrap": "nowrap", "flex": "1 1 auto" }} className="blue-link link">
                    <span style={{"fontSize":"1.1em", "flex":"1 1 auto"}}>{row['firstName'] + ' ' + row['lastName']}</span>
                    <span style={{ "flex": "1 1 auto" }} className='chapter'>{row['siteName']}</span>
                    </span>
                </Link>
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

    updateFilter(filterName, value){
        let filters = this.props.filters;
        let element = filters.find(element => element.name === filterName); 
        element.value = value;
        this.props.updateFilters(filters);
    }

    render() {
        const chapterFilter = this.props.filters.find(element => {
            if (element.name === 'chapters'){return element}
        })
        const members = this.state.members;
        const columns=[
            {title:"Member", accesor:"name", className:"borders-when-display-block", render: this.renderFullNameColumn},
            {title:"Phone", accesor:"phone"},
            {title:"Email", accesor:"email", columnMinWidth:'6em', className:'word-break'},
            {title:"Zip", accesor:"zip"},
            {title:"DOB", accesor:"dateOfBirth"}
        ];
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 mediaMin500-pl-pr-025' style={{ "maxWidth": "900px" }}>
                {this.state.loadData && <Loader />}
                <div className="flex-wrap align-center justify-space-between w-100 mb-2 mediaMax500-pl-pr-025">
                    <h1 className='uppercase-text'><strong>Members</strong></h1>
                    {/*<a className='big-static-button static-button' href="/new-member"><p>ADD NEW MEMBER</p></a>*/}
                </div>
                <div className="label-input-wrapper mediaMax500-pl-pr-025">
                    <p>CHAPTER:</p>
                    <MultiDropDown 
                            ref={el => this.chaptersDropDownRef = el}
                            list={this.props.store.chapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            expandBy='chapters'
                            expandedTextProperty='name'
                            expandedKeyProperty='id'
                            expandedMultiSelect={true}
                            defaultValue={chapterFilter ? chapterFilter.value : [] }
                            placeholder='National'
                            onDropDownValueChange = {value => this.updateFilter("chapters", value)}
                    />
                </div>
                <Table columns={columns} data={members} className={"break-at-700"}/>
            </div>
        );
    }
}

export default withStore(Members);