import React, { Component } from 'react';
import DropDown from './DropDown';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import DatePicker from './DatePicker';
import CloseUpSVG from '../svg/CloseUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';

import VolunteerUpSVG from '../svg/VolunteerUpSVG';
import VeteranUpSVG from '../svg/VeteranUpSVG';

class Chapters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stateFilter1: [],
            stateFilter2: 8,
            stateFilter3: [2, 3, 4],
            stateFilter4: '444',
            stateFilter5: '#666666',
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
            {title:"State", accesor:"state", className:"borders-when-display-block chapter", render: this.renderStateColumn},
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
                            expandBy='chapters'
                            expandedTextProperty='name'
                            expandedKeyProperty='id'
                            expandedMultiSelect={true}
                            defaultValue={this.state.stateFilter1}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter1: value})}
                        />

                        <MultiDropDown 
                            list={this.props.store.chapterList}
                            multiSelect={false}
                            keyProperty='id'
                            textProperty='state'
                            expandBy='chapters'
                            expandedTextProperty='name'
                            expandedKeyProperty='id'
                            expandedMultiSelect={false}
                            defaultValue={this.state.stateFilter10}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter10: value})}
                        />

                        <MultiDropDown 
                            list={this.props.store.chapterList}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter2}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter2: value})}
                        />
                        
                        <MultiDropDown 
                            list={this.props.store.chapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter3}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter3: value})}
                        />

                        <MultiDropDown
                            list={[{name: 'Veteran', role: [{name: '111', img: <VeteranUpSVG />},{name: '222', img: <VolunteerUpSVG />}]},{name: 'Volunteer', role: [{name: '333', img: <VeteranUpSVG />},{name: '444', img: <VolunteerUpSVG />}]}]}
                            keyProperty='name'
                            textProperty='name'
                            defaultValue={this.state.stateFilter4}
                            placeholder='Role'
                            expandBy='role'
                            expandedTextProperty='name'
                            expandedKeyProperty='name'
                            onDropDownValueChange = {value => this.setState({stateFilter4: value})}
                        />

                        <MultiDropDown
                            list={this.props.store.colorList} 
                            keyProperty='color'
                            textProperty='name'
                            defaultValue={this.state.stateFilter5}
                            placeholder='Color'
                            onDropDownValueChange = {value => this.setState({stateFilter5: value})}
                        />

                    </div>
                    <button onClick={()=>console.log(this.state)}>check state</button>
                    {/*<Table columns={columns} data={chapterList}/>*/}
                </div>
            </div>
        );
    }
}

export default withStore(Chapters);