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
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);
        console.log('mount');
        var me = this;
        setTimeout(()=>{console.log('set state');me.setState({stateFilter1:[401, 354]});},2000);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    handleClick(e) {
        if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
            this.chaptersDropDownRef.state.toggle();
        }
    }

    renderStateColumn (value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{"alignItems":"stretch"}}>
                {row['state'].name}
            </li>
        );
    }

    renderChaptersList(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{"alignItems":"stretch"}}>
                <ul>
                    {row['chapters'].map(element => 
                        <li style={{"fontSize":"1.1em"}} key={index + element['name']}><a href='/new-chapter'>{element['name']}</a></li>
                    )}
                </ul>
            </li>
        );
    }

    filterList() {
        let list = this.props.store.chapterList;
        if (this.state.stateFilter !== "" && this.state.stateFilter !== "National") {
            const newList = this.props.store.chapterList.filter(element => 
                (element.state === this.state.stateFilter.name)
            );
            list = newList;
        }
        return list;
    }

    render() {
        /*const chapterList = this.filterList();*/
        const stateList = Array.from(this.props.store.chapterList, element => {return {"name":element.state.name}});
        const columns=[
            {title:"State", accesor:"state", className:"borders-when-display-block chapter"},
            {title:"Chapters", accesor:"chapters", render: this.renderChaptersList}
        ];

        return (
            <div className='flex-nowrap justify-center'>
                <div className='flex-nowrap flex-flow-column align-center mt-3 pb-2 mediaMin500-pl-pr-025' style={{"width":"600px"}}>
                    <div className="flex-wrap align-center justify-space-between w-100 mb-2 mediaMax500-pl-pr-025">
                        <h1 className='uppercase-text'><strong>Chapters</strong></h1>
                        <a className='big-static-button static-button' href="/new-chapter"><p>ADD NEW CHAPTER</p></a>
                    </div>
                    <div className="label-input-wrapper mediaMax500-pl-pr-025">
                        <p>CHAPTER:</p>
                        <MultiDropDown 
                            ref={el => this.chaptersDropDownRef = el}
                            list={this.props.store.chapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter: value})}
                        />
                        <Table columns={columns} data={this.props.store.chapterList}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStore(Chapters);