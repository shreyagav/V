import React, { Component } from 'react';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import DatePicker from './DatePicker';
import CloseUpSVG from '../svg/CloseUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';

import VolunteerUpSVG from '../svg/VolunteerUpSVG';
import VeteranUpSVG from '../svg/VeteranUpSVG';
import Alert from './Alert';

class Chapters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stateFilter: [],
        };
        this.chaptersDropDownRef = null;
    }

    componentWillMount(){
        console.log('mount');
        var me = this;
        setTimeout(() => {console.log('set state'); me.setState({stateFilter1:[401, 354]});},2000)
    }

    renderStateName(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span className='chapter'>{value}</span>
            </li>
        );
    }

    renderChaptersList(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span className='table-mini-header'>{col.title + ": "}</span>
                <ul>
                    {row['chapters'].map(element => 
                        <li style={{"fontSize":"1.1em"}} key={index + element['name']}>
                            <a href='/new-chapter' style={{"fontSize": "0.9em", "fontWeight": "400"}}>{element['name']}</a>
                        </li>
                    )}
                </ul>
            </li>
        );
    }

    filterList() {
        let list = this.props.store.chapterList;
        let filterList = this.state.stateFilter;
        if (filterList.length > 0) {
            const newList = [];
            filterList.forEach(element => {
                let newElement = list.find(listElement => {if (listElement.id === element) return true});
                newList.push(newElement);
            })
            return newList;
        } else return list;
    }

    render() {
        const chapterList = this.filterList();
        const stateList = Array.from(this.props.store.chapterList, element => {return {"name":element.state.name}});
        const columns=[
            {title:"State", accesor:"state", className:"borders-when-display-block", render: this.renderStateName},
            {title:"Chapters", accesor:"chapters", render: this.renderChaptersList}
        ];

        return (
                <div className='inner-pages-wrapper ipw-600'>
                    <div className="flex-wrap align-center justify-space-between w-100 mb-2 ">
                        <h1 className='uppercase-text'><strong>Chapters</strong></h1>
                        <a className='big-static-button static-button' href="/new-chapter"><p>NEW CHAPTER</p></a>
                    </div>
                    <div className="label-input-wrapper mb-1">
                        <p>CHAPTER:</p>
                        <MultiDropDown 
                            ref={el => this.chaptersDropDownRef = el}
                            list={this.props.store.chapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter}
                            placeholder='National'
                            onDropDownValueChange = {value => { 
                                this.setState({stateFilter: value}) 
                            }}
                        />
                    </div>
                    <Table columns={columns} data={chapterList} className={"break-at-500"} addHeadersForNarrowScreen={true}/>
                </div>
        );
    }
}

export default withStore(Chapters);