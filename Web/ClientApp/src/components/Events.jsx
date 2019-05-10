import React, { Component } from 'react';
import DropDown from './DropDown';
import DatePicker from './DatePicker';
import CloseUpSVG from '../svg/CloseUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';

class NewEvents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            filters: {
                dateFrom: '',
            }
        };
        this.chaptersDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    componentDidMount(){
        var component = this;
        Service.getEventsList(null).then(json => { component.setState({ events: json }); });
    }

    handleClick(e) {
        if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
            this.chaptersDropDownRef.state.toggle();
        }
    }

    renderColumnName(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{"alignItems":"stretch"}}>
                <span style={{'backgroundColor':row['color']}}></span>
                <span className="display-flex flex-flow-column flex-nowrap justify-left">                                                
                    <span style={{"fontSize":"1.1em"}}>{value}</span>
                    <span className='chapter'>{row['chapter']}</span>
                </span>
            </li>
        );
    }

    render() {
        const eventsList = this.state.events;
        const columns=[
            {title:"Title", accesor:"name", className:"borders-when-display-block", render: this.renderColumnName},
            {title:"Date", accesor:"date"},
            {title:"Time", accesor:"time", columnMinWidth:'6em'},
            {title:"Type of event", accesor:"type", columnMinWidth:'5em', className:'word-break'},
            {title:"Status", accesor:"status", className:"small-bold"}
        ];
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
                <Table columns={columns} data={eventsList} />
            </div>
        );
    }
}

export default withStore(NewEvents);