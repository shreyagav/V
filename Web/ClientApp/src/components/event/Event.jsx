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
import Status from '../Status';
import Alert from '../Alert';
import { alertNotValid } from '../alerts'
import StatusDraftSVG from '../../svg/StatusDraftSVG';
import StatusPublishedSVG from '../../svg/StatusPublishedSVG';
import StatusCanceledSVG from '../../svg/StatusCanceledSVG';
import Loader from '../Loader';
import eventValidators from './eventValidators'
import InputWithClearButton from '../InputWithClearButton';

class Event extends Component {

    constructor(props) {
        super(props);
        props.store.refreshUserInfo();
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
                projectedCost: '0',
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
        this.nextStep = this.nextStep.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.fixMainEventData = this.fixMainEventData.bind(this);
        this.updateEventProperty = this.updateEventProperty.bind(this);
        this.setActiveStep = this.setActiveStep.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.emptyTitle = false;
        this.emptyChapter = false;
        this.emptyStartDate = false;
        this.emptyTimeFrom = false;
        this.emptyTimeTo = false;
        this.emptyType = false;
        this.emptyColor = false;
        this.headerText = '';
    }

    componentWillMount(){
        this.validators = eventValidators();
        this.alertNotValid = alertNotValid(() => this.setState({ showError: false }));
    }

    componentWillReceiveProps(props) {
        this.setDefaultChapter(props);
    }

    setDefaultChapter(props) {
        if (props.store.userInfo != null && this.state.eventId == 0 && props.store.userInfo.authType == "Secretary") {
            var temp = this.state.eventMain;
            temp.site = props.store.userInfo.chapterId;
            this.setState({ eventMain: temp });
        }
    }

    componentDidMount() {
        this.setDefaultChapter(this.props);
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

    /*validation() {
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
    } */

    updateEvent() {
        var event = Object.assign({}, this.state.eventMain);
        event.id = this.state.eventId;
        this.setState({ loading: true });
        return Service.changeEvent(event);
    }
    onSaveClick() {
        let save = () => { this.updateEvent().then(() => { this.props.history.push('/');})}
        this.performIfValid(() => save());
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
                    .catch(err => { alert(err) });
            }
        }

        switch (this.state.activeTabIndex) {
            case 0:
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
            let event = this.state.eventMain;
            event.eventStatus = 'published';
            this.updateEvent().then(data => {
                this.setState({ eventMain: this.fixMainEventData(data), showDialog: false, loading: false });
            });
        };
        let publish = () => {
            this.headerText = 'Publish';
            this.onOkButtonClick = onOkButtonClick;
            this.dialogText = "Are you sure you want to publish event?";
            this.dialogContent = <h4>{this.state.eventMain.name}</h4>
            this.setState({showDialog: true});
        }
        this.performIfValid(() => publish());
    }

    onCancelEventButtonClick() {
        let onOkButtonClick = () => {
            let event = this.state.eventMain;
            event.eventStatus = 'canceled';
            this.updateEvent().then(data => {
                this.setState({ eventMain: this.fixMainEventData(data), showDialog: false, loading:false });
            });
            
        };
        let cancel = () => {
            this.headerText = 'Cancel';
            this.onOkButtonClick = onOkButtonClick;
            this.dialogText = "Are you sure you want to cancel event?";
            this.dialogContent = <h4>{this.state.eventMain.name}</h4>
            this.setState({showDialog: true});
        }
        this.performIfValid(() => cancel());
    }

    onMoveToDraftsButtonClick() {
        let onOkButtonClick = () => {
            let event = this.state.eventMain;
            event.eventStatus = 'draft';
            this.updateEvent().then(data => {
                this.setState({ eventMain: this.fixMainEventData(data), showDialog: false, loading: false });
            });
        };
        let draft = () => {
            this.headerText = 'Move to drafts';
            this.onOkButtonClick = onOkButtonClick;
            this.dialogText = "Are you sure you want to move event to drafts?";
            this.dialogContent = <h4>{this.state.eventMain.name}</h4>
            this.setState({showDialog: true});
        }
        this.performIfValid(() => draft());
    }

    renderHeader() {
        if (this.props.match.path == '/new-event') {
            return (<h1 className='uppercase-text mb-2'>New<strong> Event</strong></h1>)
        } else {
            return (<h1 className='uppercase-text mb-2'>Edit<strong> Event</strong></h1>)
        }
    }

    performIfValid(callback){
        if (this.props.store.isFormValid(this.validators, this.state.eventMain)) { callback(); } 
        else { this.setState({showError: true}) };
    }

    render() {
        let eventStatus = this.state.eventMain.eventStatus;
        if (eventStatus === undefined) {eventStatus = "draft"}
        //const pictures = this.state.formattedPicturesList;
        return (
            <div className='pages-wsm-wrapper ipw-800'>
                <div className='second-nav-wrapper'>
                    <div className='ipw-600'>
                        <Status eventStatus={eventStatus} className='mr-025' />
                        <div className = 'flex-nowrap align-center'>
                            {eventStatus !== 'published' && 
                                <button 
                                    className='round-button medium-round-button outline-on-hover' 
                                    onClick = {() => this.onPublishButtonClick()}
                                >
                                    <StatusPublishedSVG />
                                    <span>Publish</span>
                                </button>
                            }
                            {eventStatus !== 'canceled' && 
                                <button 
                                    className='round-button medium-round-button outline-on-hover' 
                                    onClick = {() => this.onCancelEventButtonClick()}
                                >
                                    <StatusCanceledSVG />
                                    <span>Cancel</span>
                                </button>
                            }
                            {eventStatus !== 'canceled' && eventStatus !== 'draft' && 
                                <button 
                                    className='round-button medium-round-button outline-on-hover'
                                    onClick = {() => this.onMoveToDraftsButtonClick()}
                                >
                                    <StatusDraftSVG />
                                    <span>Move to drafts</span>
                                </button>
                            }
                        </div>
                    </div>
                </div>
                {this.state.loading && <Loader/>}
                {this.renderHeader()}
                <div className = 'flex-wrap flex-flow-column mb-3'>
                    <TabComponent 
                        fixedHeight={true}
                        tabList={['information', 'attendees', 'budget', 'pictures']}
                        wasSelected={(index) => this.performIfValid(() => this.setActiveStep(index))}
                        activeTabIndex={this.state.activeTabIndex}
                    />
                </div>
                {this.state.activeTabIndex === 0 &&
                    <ul className='input-fields first-child-text-125 mt-1 pl-1 pr-1'>
                        <li>
                            <p>Event Title:</p>
                            <div className={this.props.store.checkIfShowError('name', this.validators) ? 'error-input-wrapper' : '' }>
                                <InputWithClearButton 
                                    type='text' 
                                    placeholder='Event Title'
                                    value = {this.state.eventMain.name}
                                    onChange={e => {
                                        this.updateEventProperty("name", e.target.value)
                                        this.props.store.updateValidators("name", e.target.value, this.validators);
                                    }}
                                    onClearValue = {() => {
                                        this.updateEventProperty("name", ""); 
                                        this.props.store.updateValidators("name", "", this.validators);
                                    }}
                                />
                                { this.props.store.displayValidationErrors('name', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p>Chapter:</p>
                            <div className={this.props.store.checkIfShowError('site', this.validators) ? 'error-input-wrapper' : ""}>
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
                                    disabled={!(this.props.store.userInfo && this.props.store.userInfo.authType=="Admin")}
                                    onDropDownValueChange={value => {
                                        this.props.store.updateValidators("site", value, this.validators);
                                        this.updateEventProperty("site", value);
                                    }}
                                />
                                { this.props.store.displayValidationErrors('site', this.validators) }
                            </div>
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
                            <ul className='input-fields flex-nowrap break-at-560 line-of-inputs-wrapper'>
                                <li 
                                    className={this.emptyTimeFrom ? 'mark-invalid' : ''}
                                    error-text='Please enter the time'
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
                                    error-text='Please enter the time'
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
                        <button 
                            className='medium-static-button static-button' 
                            onClick={() => this.performIfValid(() => this.setActiveStep(this.state.activeTabIndex-1))}
                        >Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button 
                            className='medium-static-button static-button default-button' 
                            onClick={() => this.performIfValid(() => (() => this.nextStep()))}
                        >Next</button>
                    }
                </div>
                
                {this.state.showError && this.alertNotValid }

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
                        mode = 'warning'
                    >
                       {this.dialogContent}
                    </Alert>
                }
            </div>
        );
    }
}

export default withStore(Event);