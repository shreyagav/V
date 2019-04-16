import React, { Component } from 'react';
import DropDown from './DropDown';
import DatePicker from './DatePicker';
import CloseUpSVG from '../svg/CloseUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';
import { Service } from './ApiService';

class NewEvents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
        };
        this.colorDropDownRef = null;
        this.dayDropDownRef = null;
        this.numberDropDownRef = null;
        this.timeFromDropDownRef = null;
        this.timeToDropDownRef = null;
        this.dateStartDropDownRef = null;
        this.dateEndDropDownRef = null;
        this.chaptersDropDownRef = null;
        this.typeOfEventDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    componentDidMount(){
        var component = this;
        Service.getEventsList(null).then(json => { component.setState({ events: json }); });
    }

    handleClick(e) {
        if(this.state.activeTabIndex === 0){
            if(this.colorDropDownRef.state.isOpen && !this.colorDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
                this.colorDropDownRef.state.toggle();
            }
            if(this.typeOfEventDropDownRef.state.isOpen && !this.typeOfEventDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)) {
                this.typeOfEventDropDownRef.state.toggle();
            }
            if(this.dayDropDownRef.state.isOpen && !this.dayDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.dayDropDownRef.state.toggle();
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
    }

    render() {
        const eventsList = this.state.events;
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 mediaMin500-pl-pr-025' style={{"maxWidth":"900px"}}>
                <div className="flex-wrap align-center justify-space-between w-100 mb-2 mediaMax500-pl-pr-025">
                    <h1 className='uppercase-text'><strong>Events </strong></h1>
                    <a className='big-static-button static-button' href="/new-event"><p>ADD NEW EVENT</p></a>
                </div>
                <div className="label-input-wrapper mediaMax500-pl-pr-025">
                    <p>CHAPTER:</p>
                    <DropDown 
                        ref={el => this.chaptersDropDownRef = el}
                        list={this.props.store.chapterList}
                        defaultValue={{name:'National'}}
                    />
                </div>
                <ul className="table events-table">
                    <li className="table-header">Title</li>
                    <li className="table-header">Date</li>
                    <li className="table-header">Time</li>
                    <li className="table-header">Type of event</li>
                    <li className="table-header">Status</li>
                    {/*<li className="table-filter table-filter-color-name">
                        <DropDown
                            ref={el => this.colorDropDownRef = el}
                            list={this.props.store.colorList} 
                            defaultValue={{name: 'Gray', color: '#666666'}}
                            doNotShowName={true}
                        />
                        <input type='text' placeholder=''></input>
                    </li>
                    <li className="table-filter">
                        <DropDown 
                            ref={el => this.chaptersDropDownRef = el}
                            list={this.props.store.chapterList}
                            defaultValue={{name:'National'}}
                        />
                    </li>
                    <li className="table-filter"> <DatePicker ref={el => this.dateStartDropDownRef = el} /> </li>
                    <li className="table-filter"> <DatePicker ref={el => this.dateStartDropDownRef = el} /> </li>
                    <li className="table-filter">
                        <DropDown
                            ref={el => this.typeOfEventDropDownRef = el}
                            list={[{name: 'Pool Session'}, {name: 'Flat or White Water Session'}, {name: 'National Event'}, {name: 'Regional Event'}, {name: 'Chapter Planning Party'}]} 
                            defaultValue={{name: 'Pool Session'}}
                        />
                    </li>*/}
                    {eventsList.map((element, index) => Object.keys(element).filter(key => (key !== 'color' && key !== 'chapter' && key !='id')).map(key =>
                                {   
                                    if (key === 'name'){
                                        return <li key = {index.toString()+key} className={key === 'name' ? "name table-content" : "table-content"}>
                                            <span style={{'backgroundColor':element['color']}}></span>
                                            <span className="display-flex flex-flow-column flex-nowrap justify-left">                                                
                                                <span style={{"fontSize":"1.1em"}}>{element['name']}</span>
                                                <span className='chapter'>{element['chapter']}</span>
                                            </span>
                                        </li>
                                    }
                                    else {
                                        return <li key = {index.toString()+key} className={ key === 'status' ? "table-content small-bold" : "table-content"} >
                                            {element[key]}
                                        </li>
                                    }
                                }
                            )
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default withStore(NewEvents);