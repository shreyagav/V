import React, { Component } from 'react';
import DropDown from './DropDown';
import DatePicker from './DatePicker';
import CloseUpSVG from '../svg/CloseUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';

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
        fetch('/Events2.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({events: jjson})
        });
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
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
                <h1 className='uppercase-text mb-2'><strong>Events </strong></h1>
                <ul className="table events-table">
                    <li className="table-header">Title</li>
                    <li className="table-header">Chapter</li>
                    <li className="table-header">Start Date</li>
                    <li className="table-header">End Date</li>
                    <li className="table-header">Type of event</li>
                    <li className="table-filter table-filter-color-name">
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
                    </li>
                    {eventsList.map((element, index) => Object.keys(element).filter(key => key !== 'color').map(key =>
                                {if (key === 'name') {return <li key = {index.toString()+key} className="table-content"><span style={{'backgroundColor':element['color']}}></span><span>{element[key]}</span></li>}
                                    else {return <li key = {index.toString()+key} className="table-content">{element[key]}</li>}
                                }
                            )
                        )
                    }
                </ul>
                <a href="/event">NEW EVENT</a>
                <a href="/calendar">CALENDAR</a>
            </div>
        );
    }
}

export default withStore(NewEvents);