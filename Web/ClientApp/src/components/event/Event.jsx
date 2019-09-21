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
import StatusDeletedSVG from '../../svg/StatusDeletedSVG';

import DeleteUpSVG from '../../svg/DeleteUpSVG'
import SaveUpSVG from '../../svg/SaveUpSVG'
import ReturnUpSVG from '../../svg/ReturnUpSVG'

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

    updateEvent() {
        var event = Object.assign({}, this.state.eventMain);
        event.id = this.state.eventId;
        this.setState({ loading: true });
        return Service.changeEvent(event);
    }

    onSaveClick() {
        let save = () => { this.updateEvent().then(() => { 
            this.setState({ loading: false });
            /* show sucess window */
        }).catch(()=>{
            /* show Error Window */
        })}
        this.performIfValid(() => save(), () => this.setState({showError: true}) );
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
        this.performIfValid(() => publish(), () => this.setState({showError: true}) );
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
        this.performIfValid(() => cancel(), () => this.setState({showError: true}) );
    }

    onDeleteEventButtonClick() {
        let onOkButtonClick = () => {
            let event = this.state.eventMain;
            event.eventStatus = 'deleted';
            this.setState({ loading:true });
            this.updateEvent().then(data => {
                this.setState({ 
                    eventMain: this.fixMainEventData(data), 
                    showDialog: false, 
                    /*loading:false */
                }, () => this.props.history.goBack());
            });
        };
        let del = () => {
            this.headerText = 'Delete';
            this.onOkButtonClick = onOkButtonClick;
            this.dialogText = "Are you sure you want to delete the event?";
            this.dialogContent = <div><h4>{this.state.eventMain.name}</h4><p className='m-05'>This action can not be undone. Delete anyway?</p></div>
            this.setState({showDialog: true});
        }
        let checkIfEventHasID = () => {
            console.log(this.state.eventId);
            if(this.state.eventId === 0){this.props.history.goBack()}
            else del();
        }
        this.performIfValid(() => del(), checkIfEventHasID);
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
            this.dialogText = "Are you sure you want to move the event to drafts?";
            this.dialogContent = <h4>{this.state.eventMain.name}</h4>
            this.setState({showDialog: true});
        }
        this.performIfValid(() => draft(), () => this.setState({showError: true}) );
    }

    renderHeader() {
        if (this.props.match.path == '/new-event') {
            return (<h1 className='uppercase-text mb-2'>New<strong> Event</strong></h1>)
        } else {
            return (<h1 className='uppercase-text mb-2'>Edit<strong> Event</strong></h1>)
        }
    }

    performIfValid(callback, callback2){
        if (this.props.store.isFormValid(this.validators, this.state.eventMain)) { callback() } 
        else { 
            if(callback2) {callback2()} 
        };
    }

    render() {
        let eventStatus = this.state.eventMain.eventStatus;
        if (eventStatus === undefined) {eventStatus = "draft"}
        //const pictures = this.state.formattedPicturesList;
        return (
            <div className='pages-wsm-wrapper ipw-800'>
                <div className='second-nav-wrapper'>
                    <div className='ipw-600'>
                        <div className = 'flex-nowrap align-center'>
                            <Status eventStatus={eventStatus} className='mr-025' />
                            {eventStatus !== 'published' && eventStatus !== 'deleted' &&
                                <button 
                                    className='round-button medium-round-button outline-on-hover hlo500' 
                                    onClick = {() => this.onPublishButtonClick()}
                                    hint = 'Publish'
                                >
                                    <StatusPublishedSVG />
                                    <span>Publish</span>
                                </button>
                            }
                            {eventStatus !== 'canceled' && eventStatus !== 'deleted' &&
                                <button 
                                    className='round-button medium-round-button outline-on-hover hlo500' 
                                    onClick = {() => this.onCancelEventButtonClick()}
                                    hint = "Cancel"
                                >
                                    <StatusCanceledSVG />
                                    <span>Cancel</span>
                                </button>
                            }
                            {eventStatus !== 'canceled' && eventStatus !== 'draft' && eventStatus !== 'deleted' &&
                                <button 
                                    className='round-button medium-round-button outline-on-hover hlo500'
                                    onClick = {() => this.onMoveToDraftsButtonClick()}
                                    hint = "Draft"
                                >
                                    <StatusDraftSVG />
                                    <span>Draft</span>
                                </button>
                            }
                        </div>
                        <div className = 'flex-nowrap align-center'>
                            {eventStatus !== 'deleted' && 
                                <button 
                                    className='round-button medium-round-button outline-on-hover hlo500'
                                    onClick = {() => this.onDeleteEventButtonClick()}
                                    hint="Delete"
                                >
                                    <DeleteUpSVG />
                                    <span>Delete</span>
                                </button>
                            }
                            <button
                                className='round-button medium-round-button outline-on-hover hlo500' 
                                hint="Save"
                                onClick={this.onSaveClick}
                            >
                                <SaveUpSVG />
                                <span>Save</span>
                            </button>
                            <button
                                className='round-button medium-round-button outline-on-hover hlo500'
                                hint="Exit"
                                onClick={() => this.props.history.goBack()}
                            >
                                <ReturnUpSVG />
                                <span>Exit</span>
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.loading && <Loader/>}
                {this.renderHeader()}
                <div className = 'flex-wrap flex-flow-column mb-3'>
                    <TabComponent 
                        fixedHeight={true}
                        tabList={['information', 'attendees', 'budget', 'pictures']}
                        wasSelected={(index) => this.performIfValid(() => this.setActiveStep(index), () => this.setState({showError: true}) )}
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
                        <p>Date:</p>
                        <div className={this.props.store.checkIfShowError('date', this.validators) ? 'error-input-wrapper' : ""}>
                            <DatePicker 
                                value={this.state.eventMain.date}
                                ref={el => this.dateStartDropDownRef = el}
                                onSelect={value => {
                                    this.emptyStartDate = false;
                                    this.props.store.updateValidators("date", value, this.validators);
                                    this.updateEventProperty("date", value);
                                }}
                            />
                            { this.props.store.displayValidationErrors('date', this.validators) }
                        </div>
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
                                    <div className={this.props.store.checkIfShowError('timeFrom', this.validators) ? 'error-input-wrapper' : ""}>
                                        <TimePicker 
                                            ref={el => this.timeFromDropDownRef = el}
                                            timePickerMode={true}
                                            value={this.state.eventMain.timeFrom}
                                            onChange={value => {
                                                if (value.activated) {this.emptyTimeFrom = false;}
                                                this.props.store.updateValidators("timeFrom", value, this.validators);
                                                this.updateEventProperty("timeFrom", value);
                                            }}
                                        />
                                        { this.props.store.displayValidationErrors('timeFrom', this.validators) }
                                    </div>
                                </li>
                                <li><p>to:</p></li>
                                <li
                                    className={this.emptyTimeTo ? 'mark-invalid' : ''}
                                    error-text='Please enter the time'
                                >
                                    <div className={this.props.store.checkIfShowError('timeTo', this.validators) ? 'error-input-wrapper' : ""}>
                                        <TimePicker 
                                            ref={el => this.timeToDropDownRef = el}
                                            timePickerMode={true}
                                            value={this.state.eventMain.timeTo}
                                            onChange={value => {
                                                if (value.activated) {this.emptyTimeTo = false;}
                                                this.props.store.updateValidators("timeTo", value, this.validators);
                                                this.updateEventProperty("timeTo", value);
                                            }}
                                        />
                                        { this.props.store.displayValidationErrors('timeTo', this.validators) }
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li
                            className={this.emptyType ? 'mark-invalid' : ''}
                            error-text='Please select the Event Type'
                        >
                            <p>Type of event:</p>
                            <div className={this.props.store.checkIfShowError('eventType', this.validators) ? 'error-input-wrapper' : ""}>
                                <MultiDropDown
                                    ref={el => this.typeOfEventDropDownRef = el}
                                    list={this.props.store.eventTypes}
                                    keyProperty='id'
                                    textProperty='title'
                                    defaultValue={this.state.eventMain.eventType}
                                    placeholder='Event type'
                                    onDropDownValueChange={value => {
                                        this.emptyType = false;
                                        this.props.store.updateValidators("eventType", value, this.validators);
                                        this.updateEventProperty("eventType", value)
                                    }}
                                />
                                { this.props.store.displayValidationErrors('eventType', this.validators) }
                            </div>
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
                            onClick={() => this.performIfValid(() => this.setActiveStep(this.state.activeTabIndex-1), () => this.setState({showError: true}) )}
                        >Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button 
                            className='medium-static-button static-button default-button' 
                            onClick={() => this.performIfValid(this.nextStep, () => this.setState({showError: true})) }
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