import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import DropDown from '../DropDown';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import { withStore } from '../store';
import EventAttendees from './EventAttendees';
import EventBudget from './EventBudget';
import EventPictures from './EventPictures';
import {SimpleDropDown} from '../SimpleDropDown/SimpleDropDown'
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import { Service } from '../ApiService';
import CloseUpSVG from '../../svg/CloseUpSVG';

class Event extends Component {

    constructor(props) {
        super(props);
        let evtId = 0;
        if (props.match.params.id) {
            evtId = props.match.params.id
        }
        this.state = {
            repeatedEventsIsOpen: true,
            activeTabIndex: 0,
            members: [],
            budget: [],
            pictures: [],
            eventMain: {
                name: "",
                description: "",
                eventType: 0,
                site: 0,
                timeFrom: {},
                timeTo: {},
                type:null,
                groupId: 0,
                date: new Date()
            },
            eventId: evtId
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
        this.onTestChange = this.onTestChange.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.updateEventProperty = this.updateEventProperty.bind(this);
    }
    nextStep() {
        if (this.state.activeTabIndex == 0) {
            var me = this;
            var event = Object.assign({}, this.state.eventMain);
            event.id = this.state.eventId;
            console.log('goto step 2', event);
            Service.changeEvent(event).then((data) => {

                console.log('goto step 2', data);
                setTimeout(() => { me.setState({ activeTabIndex: me.state.activeTabIndex + 1, eventId: data.id }); }, 500);
            });
            
        } else {
            this.setState({ activeTabIndex: this.state.activeTabIndex + 1 });
        }
        
    }
    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}
    onTestChange(newVal){
        var tmp = this.state.eventMain;
        tmp.test = newVal;
        this.setState({eventMain:tmp});
    }
    componentDidMount() {
        if (this.props.location && this.props.location.state && this.props.location.state.date) {
            var temp = this.state.eventMain;
            temp.date = this.props.location.state.date;
            this.setState({ eventMain: temp });
        }
        var component = this;
        if (this.state.eventId != 0) {
            this.setState({ loading: true });
            Service.getEvent(this.state.eventId)
                .then(data => {
                    data.date = new Date(data.date);
                    component.setState({ eventMain: data, loading: false });
                })
                .catch(exception => component.setState({ error: exception, loading: false }));
        }
        fetch('/Pictures.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({pictures: jjson})
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
            /*if(this.dayDropDownRef.state.isOpen && !this.dayDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.dayDropDownRef.state.toggle();
            }
            if(this.numberDropDownRef.state.isOpen && !this.numberDropDownRef.timeNumberPickerRef.contains(e.target)){
                this.numberDropDownRef.toggle();
            }*/
            if(this.timeFromDropDownRef.state.isOpen && !this.timeFromDropDownRef.timeNumberPickerRef.contains(e.target)){
                this.timeFromDropDownRef.toggle();
            }
            if(this.timeToDropDownRef.state.isOpen && !this.timeToDropDownRef.timeNumberPickerRef.contains(e.target)){
                this.timeToDropDownRef.toggle();
            }
            if(this.dateStartDropDownRef.state.isOpen && !this.dateStartDropDownRef.datePickerRef.contains(e.target)){
                this.dateStartDropDownRef.toggle();
            }
            /*if(this.dateEndDropDownRef.state.isOpen && !this.dateEndDropDownRef.datePickerRef.contains(e.target)){
                this.dateEndDropDownRef.toggle();
            }*/
            if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
                this.chaptersDropDownRef.state.toggle();
            }
        }
    }

    toggleRepeatedEvents(){
        this.setState({repeatedEventsIsOpen: !this.state.repeatedEventsIsOpen});
    }

    formatImageList(pageNumber) {
        let rowHeight = this.state.rowHeight;
        let maxWidth = this.imageGalleryRef.getBoundingClientRect().width;
        let newArray = [];
        let newImageList = [];
        let totalWidth = 0;
        let counter = 0;
        let tryUntill = 0;
        let imageList = this.state.pictures;
        if (pageNumber*this.state.amountPerPage < imageList.length) {
            tryUntill = pageNumber*this.state.amountPerPage;
        }
        else tryUntill = imageList.length;
        for (let i=(pageNumber-1)*this.state.amountPerPage; i < tryUntill; i++) {
            totalWidth = totalWidth + (imageList[i].width * rowHeight) / imageList[i].height;
            counter = counter + 1;
            newArray.push(imageList[i]);
            if (totalWidth > maxWidth) {
                for (let j=0; j < newArray.length; j++){
                    newArray[j].flexBasis = (((newArray[j].width * rowHeight)/newArray[j].height) /totalWidth)*100*(1 - (10*(counter-1))/maxWidth);
                }
                newImageList.push(newArray);
                counter=0;
                totalWidth = 0;
                newArray = []; 
            }
        }
        if (newArray.length > 0) {
            for (let j=0; j < newArray.length; j++){
                newArray[j].flexBasis = (((newArray[j].width * rowHeight)/newArray[j].height) /maxWidth)*100*(1 - (10*(counter-1))/maxWidth);
            }
            newImageList.push(newArray);
        }
        this.setState(() => ({formattedPicturesList: newImageList}));
    }

    updateEventProperty(property, value) {
        var temp = this.state.eventMain;
        temp[property] = value;
        this.setState({ eventMain: temp });
    }

    render() {
        const pictures = this.state.formattedPicturesList;
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
                <h1 className='uppercase-text mb-2'>New<strong> Event</strong></h1>
                <TabComponent 
                    inheritParentHeight={false}
                    tabList={['info', 'attendees', 'budget', 'pictures']}
                    wasSelected={(index) => this.setState({activeTabIndex: index})}
                    activeTabIndex={this.state.activeTabIndex}
                    tabEqualWidth={true}
                />
                {this.state.activeTabIndex === 0 &&
                    <ul className='input-fields first-child-text-125 mt-3 pl-1 pr-1'>
                        <li>
                            <p>Event Title:</p>
                            <div className='input-button-wrapper'>
                                <input 
                                    ref={el => this.titleDropDownRef = el}
                                    placeholder='Event Title'
                                    value={this.state.eventMain.name}
                                    onChange={(evt) => this.updateEventProperty("name", evt.target.value)}
                                />
                                {this.state.eventMain.name !== "" &&
                                    <button onClick={() => {this.updateEventProperty("name", ""); this.titleDropDownRef.focus();}}>
                                        <CloseUpSVG />
                                    </button>
                                }
                            </div>
                        </li>
                        <li>
                            <p>Chapter:</p>
                            <MultiDropDown
                            ref={el => this.chaptersDropDownRef = el}
                            list={this.props.store.chapterList}
                            multiSelect={false}
                            keyProperty='id'
                            textProperty='state'
                            expandBy='chapters'
                            expandedTextProperty='name'
                            expandedKeyProperty='id'
                            expandedMultiSelect={false}
                            defaultValue={this.state.eventMain.site}
                            placeholder="Select chapter"
                            onDropDownValueChange={value => this.updateEventProperty("site", value)}
                            />
                        </li>
                        <li>
                        <p>Start Date:</p>
                        <DatePicker value={this.state.eventMain.date}
                            ref={el => this.dateStartDropDownRef = el}
                            onSelect={value => this.updateEventProperty("date", value)}
                            />
                        </li>
                    {/*<li>
                            <p></p>
                            <div>
                            <div className='flex-nowrap mb-1'>
                                        <p className='flex11auto'>For repeated events</p>
                                        <button 
                                            disabled
                                            className='arrow-button' 
                                            onClick={() => {this.toggleRepeatedEvents();}}
                                        >*/}
                                            {/*<CloseUpSVG svgClassName={this.state.repeatedEventsIsOpen ? 'flip90' : 'flip270'}/>*/}
                            {/*</button>
                                </div>*/}
                                {/*this.state.repeatedEventsIsOpen && 
                                    <ul className='input-fields'>
                                        <li className='number-field'>
                                            <p>repeats every:</p>
                                            <TimePicker 
                                                ref={el => this.numberDropDownRef = el}
                                                timePickerMode={false}
                                            />
                                            <DropDown
                                                ref={el => this.dayDropDownRef = el}
                                                list={[{"name":"day"}, {"name":"week"}, {"name": "month"}, {"name":"year"}]} 
                                                defaultValue={{"name":"day"}}
                                            />
                                        </li>
                                        <li className='flex-wrap align-center'>
                                                <p>Repeats on:</p>
                                                <span className='buttonlike-checkbox add-margin flex-wrap justify-left align-center'>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>SU</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>MO</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>TU</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>WE</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>TH</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>FR</span>
                                                    </label>
                                                    <label>
                                                        <input type="checkbox"/>
                                                        <span>SA</span>
                                                    </label>
                                                </span>
                                        </li>
                                        <li className='flex-nowrap fit-content align-center' style={{"marginTop":"-0.3rem"}}>
                                            <p>End Date:</p>
                                            <DatePicker 
                                                ref={el => this.dateEndDropDownRef = el}
                                            />
                                        </li>
                                    </ul>
                                
                            </div>
                        </li>*/}
                        <li>
                            <p>From:</p>
                            <ul className='input-fields-child-ul time-fields'>
                                <li>
                                    <TimePicker 
                                    ref={el => this.timeFromDropDownRef = el}
                                    timePickerMode={true}
                                    time={this.state.eventMain.timeFrom}
                                    onChange={value => this.updateEventProperty("timeFrom", value)}
                                    />
                                </li>
                                <li><p>to:</p></li>
                                <li>
                                    <TimePicker 
                                        ref={el => this.timeToDropDownRef = el}
                                    timePickerMode={true}
                                    time={this.state.eventMain.timeTo}
                                    onChange={value => this.updateEventProperty("timeTo", value)}
                                    />
                                </li>
                            </ul>
                        </li>
                        <li>
                            <p>Type of event:</p>
                            <MultiDropDown
                                ref={el => this.typeOfEventDropDownRef = el}
                                list={this.props.store.eventTypes}
                                keyProperty='id'
                                textProperty='title'
                                defaultValue={this.state.eventMain.eventType}
                            placeholder='Event type'
                            onDropDownValueChange={value => this.updateEventProperty("eventType",value)}
                    />
                        </li>
                        <li>
                            <p>Color:</p>
                            <MultiDropDown
                                ref={el => this.colorDropDownRef = el}
                                list={this.props.store.colorList}
                                keyProperty='color'
                                textProperty='name'
                                defaultValue={this.state.eventMain.color}
                                placeholder='Color'
                                onDropDownValueChange={value => this.updateEventProperty("color", value)}
                            />

                        </li>
                        <li>
                            <p>Description:</p>
                            <div className='input-button-wrapper'>
                                <textarea 
                                    ref={el => this.descriptionInputRef = el}
                                    placeholder='Description'
                                    value={this.state.eventMain.description}
                                    onChange={(evt) => this.updateEventProperty("description", evt.target.value)}
                                />
                                {/*this.state.eventMain.description !== "" &&
                                    <button onClick={() => {this.updateEventProperty("description", ""); this.descriptionInputRef.focus();}}>
                                        <CloseUpSVG />
                                    </button>
                                */}
                            </div>
                        </li>
                    </ul>
                }
                {this.state.activeTabIndex === 1 && <EventAttendees eventId={this.state.eventId} /> }
                {this.state.activeTabIndex === 2 && <EventBudget eventId={this.state.eventId} /> }
                {this.state.activeTabIndex === 3 && <EventPictures eventId={this.state.eventId}/> }
                <div className='flex-wrap mt-2'>
                    {this.state.activeTabIndex > 0 &&
                        <button className='medium-static-button static-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex-1})}>Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button className='medium-static-button static-button default-button' onClick={this.nextStep}>Next</button>
                    }
                    {this.state.activeTabIndex === 3 &&
                        <button className='medium-static-button static-button default-button' disabled >Save</button>
                    }
                </div>
            </div>
        );
    }
}

export default withStore(Event);