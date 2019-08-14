import React, { Component } from 'react';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';
import VolunteerUpSVG from '../svg/VolunteerUpSVG';
import PaddlerUpSVG from '../svg/PaddlerUpSVG';
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
        let filters = this.props.filters;
        filters.push({name: "chapters", value: []});
        this.props.updateFilters(filters);
    }

    componentDidMount(){
        this.filtersStr = JSON.stringify(this.props.filters);
        this.updateList(this.props);
    }

    renderFullNameColumn(value, row, index, col) {
        return (
            <li 
                key={index} 
                className={col.className ? "table-content " + col.className : "table-content"} 
                style={{"display":"flex", "alignItems":"center"}}
            >
                <div className='flex-nowrap align-self-stretch align-center pr-05 pl-05' style={ row['oldType'] === 54 ? {"backgroundColor":"#fe7b22"} : {"backgroundColor":"#8bba19"}}>
                    <span style={{"flex":"0 0 auto","height":"1.5rem"}}>
                        {row['oldType'] === 54 ? <PaddlerUpSVG svgClassName='fill-white'/> : <VolunteerUpSVG svgClassName='fill-white' />}
                    </span>
                </div>
                <Link to={"/member/" + row["id"]}>
                    <span style={{ "display": "flex", "flexFlow": "column", "flexWrap": "nowrap", "flex": "1 1 auto" }} className="blue-link link">
                        <span style={{"fontSize":"1.1em", "flex":"1 1 auto"}}>{row['firstName'] + ' ' + row['lastName']}</span>
                        <span style={{ "flex": "1 1 auto" }} className='chapter'>{row['siteName']}</span>
                    </span>
                </Link>
            </li>
        );
    }

    renderDOBColumn(value, row, index, col) {
        const getNewValue = (value) => {
            if(value === null){ return null }
            else {
                let dob = new Date(value);
                return ('0' + (dob.getMonth() + 1).toString()).slice(-2) + '/' + ('0' + dob.getDate().toString()).slice(-2) + '/' + dob.getFullYear()
            }
        }
        return (
            <li 
                key={index} 
                className={col.className ? "table-content " + col.className : "table-content"} 
                style={{"display":"flex", "alignItems":"center"}}
            >
                <span className='table-mini-header'>{col.title + ": "}</span>
                {value !== null && <span> { getNewValue(value) } </span> }
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
        /*const chapterFilter = this.props.filters.find(element => {
            if (element.name === 'chapters'){return element}
        })*/
        const members = this.state.members;
        const columns=[
            {title:"Member", accesor:"name", className:"borders-when-display-block", render: this.renderFullNameColumn},
            {title:"Phone", accesor:"phone"},
            {title:"Email", accesor:"email", columnMinWidth:'6em', className:'word-break'},
            {title:"Zip", accesor:"zip"},
            {title:"DOB", accesor:"dateOfBirth", render: this.renderDOBColumn}
        ];
        return (
            <div className="inner-pages-wrapper ipw-1000">
                {this.state.loadData && <Loader />}
                <div className="flex-wrap align-center justify-space-between w-100 mb-2">
                    <h1 className='uppercase-text'><strong>Members</strong></h1>
                    <a className='big-static-button static-button' href="/new-member"><p>NEW MEMBER</p></a>
                </div>
                {/*<div className="label-input-wrapper mb-1">
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
                </div>*/}
                {members.length > 0 &&
                    <Table columns={columns} data={members} className={"break-at-700"} addHeadersForNarrowScreen={true}/>
                }
                {members.length === 0 && !this.state.loadData && 
                    <p className='message-block mt-2'>There are no members for selected chapters.</p>
                }
            </div>
        );
    }
}

export default withStore(Members);