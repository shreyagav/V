import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import { withStore } from '../store';
import EventAttendees from './EventAttendees';
import EventBudget from './EventBudget';
import EventPictures from './EventPictures';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import { Service } from '../ApiService';
import CloseUpSVG from '../../svg/CloseUpSVG';
import Alert from '../Alert';
import Loader from '../Loader';

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
            loading: evtId!=0,
            eventMain: {
                name: "",
                description: "",
                eventType: 0,
                site: 0,
                timeFrom: {
                    activated: false,
                    hours: 8,
                    minutes: 0,
                    am: true,
                },
                timeTo: {
                    activated: false,
                    hours: 8,
                    minutes: 0,
                    am: true,
                },
                type:null,
                color: "#666666",
                groupId: 0,
                date: new Date(),
                eventStatus: "draft",
                projectedCost: 0,
            },
            eventId: evtId,
            showError: false,
            showDialog: false,
        };
        this.defaultTimeValue = {
            activated: false,
            hours: 8,
            minutes: 0,
            am: true,
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
        this.nextStep = this.nextStep.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.fixMainEventData = this.fixMainEventData.bind(this);
        this.updateEventProperty = this.updateEventProperty.bind(this);
        this.setActiveStep = this.setActiveStep.bind(this);
        this.emptyTitle = false;
        this.emptyChapter = false;
        this.emptyStartDate = false;
        this.emptyTimeFrom = false;
        this.emptyTimeTo = false;
        this.emptyType = false;
        this.emptyColor = false;
        this.headerText = '';
    }
    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}
    componentDidMount() {
        if (this.props.location && this.props.location.state && this.props.location.state.date) {
            var temp = this.state.eventMain;
            temp.date = this.props.location.state.date;
            this.setState({ eventMain: temp });
        }
        var component = this;
        if (this.state.eventId != 0) {
            Service.getEvent(this.state.eventId)
                .then(data => {
                    
                    component.setState({ eventMain: component.fixMainEventData(data), loading: false });
                })
                .catch(exception => component.setState({ error: exception, loading: false }));
        }
    }
    fixMainEventData(data) {
        data.date = new Date(data.date);
        data.timeFrom["activated"] = true;
        data.timeTo["activated"] = true;
        return data;
    }
    validation() {
        let validationPassed = true;
            if (this.state.activeTabIndex === 0){
                if(this.state.eventMain.name.length < 1) {
                    this.emptyTitle = true;
                }
                if(this.state.eventMain.site === 0) {
                    this.emptyChapter = true;
                }
                if(this.state.eventMain.date === '') {
                    this.emptyStartDate = true;
                }
                if(!this.state.eventMain.timeFrom.activated) {
                    this.emptyTimeFrom = true;
                }
                if(!this.state.eventMain.timeTo.activated) {
                    this.emptyTimeTo = true;
                }

                if(this.state.eventMain.eventType === null || this.state.eventMain.eventType === 0) {
                    this.emptyType = true;
                }
                if(this.state.eventMain.color === '') {
                    this.emptyColor = true;
                }
                if (this.emptyTitle || this.emptyChapter || this.emptyStartDate || this.emptyTimeFrom || this.emptyTimeTo || this.emptyType || this.emptyColor){
                    this.setState({showError: true});
                    validationPassed = false;
                }
            }
        return validationPassed;
    }

    updateEvent() {
        var event = Object.assign({}, this.state.eventMain);
        event.id = this.state.eventId;
        this.setState({ loading: true });
        return Service.changeEvent(event);
    }

    setActiveStep(num) {
        var me = this;
        var afterStep = (data) => {
            me.setState({ activeTabIndex: num, eventId: data.id, loading: false });
        }

        if (num == 1) {
            afterStep = (data) => {
                Service.getEventAttendees(data.id)
                    .then(attendees => {
                        setTimeout(() => { me.setState({ activeTabIndex: num, members: attendees, eventId: data.id, loading: false }); }, 500);
                    })
            }
        }

        switch (this.state.activeTabIndex) {
            case 0:
                if (!this.validation()) return;
                this.updateEvent().then((data) => {
                    afterStep(me.fixMainEventData(data));
                });
                break;
            case 2:
                var me = this;
                this.updateEvent().then((data) => {
                    afterStep(me.fixMainEventData(data));
                });
                break;
            default:
                this.setState({ activeTabIndex: num });
        }
    }


    nextStep() {
        this.setActiveStep(this.state.activeTabIndex + 1);
    }

    onTestChange(newVal){
        var tmp = this.state.eventMain;
        tmp.test = newVal;
        this.setState({eventMain:tmp});
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

    onPublishButtonClick() {
        let onOkButtonClick = () => {
            // Publish Event
            let event = this.state.eventMain;
            event.eventStatus = 'published';
            this.updateEvent().then(data => {
                this.setState({ eventMain: this.fixMainEventData(data), showDialog: false, loading: false });
            });
        };
        if (!this.validation()) {
            this.setState({showDialog: false});
            return;
        } else {
            this.headerText = 'Publish event';
            this.onOkButtonClick = onOkButtonClick;
            this.dialogText = "Are you sure you want to publish event?";
            this.dialogContent = <h4>{this.state.eventMain.name}</h4>
            this.setState({showDialog: true});
        }
    }

    onCancelEventButtonClick() {
        let onOkButtonClick = () => {
            // Cancel Event
            let event = this.state.eventMain;
            event.eventStatus = 'cancelled';
            this.updateEvent().then(data => {
                this.setState({ eventMain: this.fixMainEventData(data), showDialog: false, loading:false });
            });
            
        };
        if (!this.validation()) {
            this.setState({showDialog: false});
            return;
        } else {
            this.headerText = 'Cancell event';
            this.onOkButtonClick = onOkButtonClick;
            this.dialogText = "Are you sure you want to cancel event?";
            this.dialogContent = <h4>{this.state.eventMain.name}</h4>
            this.setState({showDialog: true});
        }
    }

    onMoveToDraftsButtonClick() {
        let onOkButtonClick = () => {
            // Move to Drafts Event
            let event = this.state.eventMain;
            event.eventStatus = 'draft';
            this.updateEvent().then(data => {
                this.setState({ eventMain: this.fixMainEventData(data), showDialog: false, loading: false });
            });
        };
        if (!this.validation()) {
            this.setState({showDialog: false});
            return;
        } else {
            this.headerText = 'Move to drafts';
            this.onOkButtonClick = onOkButtonClick;
            this.dialogText = "Are you sure you want to move event to drafts?";
            this.dialogContent = <h4>{this.state.eventMain.name}</h4>
            this.setState({showDialog: true});
        }
    }

    render() {
        const pictures = this.state.formattedPicturesList;
        console.log("eventStatus = "+this.state.eventMain.eventStatus);
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
                {this.state.loading && <Loader/>}
                <h1 className='uppercase-text mb-2'>New<strong> Event</strong></h1>
                <div className = 'flex-wrap flex-flow-column mb-3'>
                    {(this.state.eventMain.eventStatus === 'draft' || this.state.eventMain.eventStatus === undefined) && 
                        <div className = 'status-wrapper mb-2'>
                            <div className='status-indicator draft'>Draft</div>
                            <div className = 'flex-wrap align-center'>
                                <button className='round-button medium-round-button grey-outline-button' onClick = {() => this.onPublishButtonClick()}>
                                    Publish
                                </button>
                                <button className='round-button medium-round-button grey-outline-button' onClick = {() => this.onCancelEventButtonClick()}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    }
                    {this.state.eventMain.eventStatus === 'published' && 
                        <div className = 'status-wrapper mb-2'>
                            <div className='status-indicator published'>Published</div>
                            <div className = 'flex-wrap align-center'>
                                <button className='round-button medium-round-button grey-outline-button' onClick = {() => this.onMoveToDraftsButtonClick()}>Move to drafts</button>
                                <button className='round-button medium-round-button grey-outline-button' onClick = {() => this.onCancelEventButtonClick()}>Cancel</button>
                            </div>
                        </div>
                    }
                    {this.state.eventMain.eventStatus === 'cancelled' && 
                        <div className = 'status-wrapper mb-2'>
                            <div className='status-indicator cancelled'>Cancelled</div>
                            <div className = 'flex-wrap align-center'>
                                <button className='round-button medium-round-button grey-outline-button' onClick = {() => this.onPublishButtonClick()}>Publish</button>
                            </div>
                        </div>
                    }
                    <TabComponent 
                        inheritParentHeight={false}
                        tabList={['information', 'attendees', 'budget', 'pictures']}
                        wasSelected={(index) => this.setActiveStep(index)}
                        activeTabIndex={this.state.activeTabIndex}
                        tabEqualWidth={true}
                    />
                </div>
                {this.state.activeTabIndex === 0 &&
                    <ul className='input-fields first-child-text-125 mt-1 pl-1 pr-1'>
                        <li 
                            className={this.emptyTitle ? 'mark-invalid' : ''}
                            error-text='Please enter the Event Title'
                        >
                            <p>Event Title:</p>
                            <div className='input-button-wrapper'>
                                <input 
                                    type='text'
                                    ref={el => this.titleDropDownRef = el}
                                    placeholder='Event Title'
                                    value={this.state.eventMain.name}
                                    onChange={(evt) => {
                                        if(evt.target.value.length > 0) {
                                            this.emptyTitle = false;
                                        }
                                        this.updateEventProperty("name", evt.target.value);
                                    }}
                                />
                                {this.state.eventMain.name !== "" &&
                                    <button onClick={() => {this.updateEventProperty("name", ""); this.titleDropDownRef.focus();}}>
                                        <CloseUpSVG />
                                    </button>
                                }
                            </div>
                        </li>
                        <li 
                            className={this.emptyChapter ? 'mark-invalid' : ''}
                            error-text='Please select the Chapter'
                        >
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
                                onDropDownValueChange={value => {
                                    this.emptyChapter = false;
                                    this.updateEventProperty("site", value);
                                }}
                            />
                        </li>
                        <li
                            className={this.emptyStartDate ? 'mark-invalid' : ''}
                            error-text='Please enter the date'
                        >
                        <p>Start Date:</p>
                        <DatePicker 
                            value={this.state.eventMain.date}
                            ref={el => this.dateStartDropDownRef = el}
                            onSelect={value => {
                                this.emptyStartDate = false;
                                this.updateEventProperty("date", value);
                            }}
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
                                <li 
                                    className={this.emptyTimeFrom ? 'mark-invalid' : ''}
                                    error-text='Please enter the time event starts'
                                >
                                    <TimePicker 
                                        ref={el => this.timeFromDropDownRef = el}
                                        timePickerMode={true}
                                        value={this.state.eventMain.timeFrom}
                                        onChange={value => {
                                            if (value.activated) {this.emptyTimeFrom = false;}
                                            this.updateEventProperty("timeFrom", value);
                                        }}
                                    />
                                </li>
                                <li><p>to:</p></li>
                                <li
                                    className={this.emptyTimeTo ? 'mark-invalid' : ''}
                                    error-text='Please enter the time event ends'
                                >
                                    <TimePicker 
                                        ref={el => this.timeToDropDownRef = el}
                                        timePickerMode={true}
                                        value={this.state.eventMain.timeTo}
                                        onChange={value => {
                                            if (value.activated) {this.emptyTimeTo = false;}
                                            this.updateEventProperty("timeTo", value);
                                        }}
                                    />
                                </li>
                            </ul>
                        </li>
                        <li
                            className={this.emptyType ? 'mark-invalid' : ''}
                            error-text='Please select the Event Type'
                        >
                            <p>Type of event:</p>
                            <MultiDropDown
                                ref={el => this.typeOfEventDropDownRef = el}
                                list={this.props.store.eventTypes}
                                keyProperty='id'
                                textProperty='title'
                                defaultValue={this.state.eventMain.eventType}
                                placeholder='Event type'
                                onDropDownValueChange={value => {
                                    this.emptyType = false;
                                    this.updateEventProperty("eventType",value)
                                }}
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
                            <p className='mark-optional'>Description:</p>
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
                {this.state.activeTabIndex === 1 && <EventAttendees eventId={this.state.eventId} attendees={this.state.members} />}
                {this.state.activeTabIndex === 2 && 
                    <EventBudget 
                        eventId={this.state.eventId} 
                        projectedCost={this.state.eventMain.projectedCost} 
                        onProjectedCostChange={value => this.updateEventProperty("projectedCost", value)}
                    />
                }
                {this.state.activeTabIndex === 3 && <EventPictures eventId={this.state.eventId}/> }
                <div className='flex-wrap mt-2'>
                    {this.state.activeTabIndex > 0 &&
                        <button className='medium-static-button static-button' 
                            onClick={() => {this.setActiveStep(this.state.activeTabIndex-1)}}
                        >Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button className='medium-static-button static-button default-button' onClick={() => { this.nextStep();}}>Next</button>
                    }
                    {this.state.activeTabIndex === 3 &&
                        <button className='medium-static-button static-button default-button' disabled >Save</button>
                    }
                </div>
                
                {this.state.showError && 
                    <Alert 
                        headerText = 'Error'
                        onClose = {()=>this.setState({showError: false})}
                        showOkButton = {true}
                        onOkButtonClick = {()=>this.setState({showError: false})}
                        buttonText = "Got IT!"
                        mode = 'error'
                    >
                       <span>Some required information is missing or incomplete. Please fill out the fields in red.</span>
                    </Alert>
                }

                {this.state.showDialog && 
                    <Alert 
                        headerText = {this.headerText}
                        text = {this.dialogText}
                        onClose = {() => this.setState({showDialog: false})}
                        showOkCancelButtons = {true}
                        onCancelButtonClick = {() => this.setState({showDialog: false})}
                        onOkButtonClick = {() => this.onOkButtonClick()}
                        cancelButtonText = "Cancel"
                        okButtonText = "Ok"
                    >
                       {this.dialogContent}
                    </Alert>
                }
            </div>
        );
    }
}

export default withStore(Event);