import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import EventAttendees from './EventAttendees';
import EventPictures from './EventPictures';
import EventBudget from './EventBudget';
import { withStore } from '../store';
import TimeUpSVG from '../../svg/TimeUpSVG';
import DateUpSVG from '../../svg/DateUpSVG';
import ChaptersUpSVG from '../../svg/ChaptersUpSVG';
import EventUpSVG from '../../svg/EventUpSVG';
import Status from '../Status';
import EditUpSVG from '../../svg/EditUpSVG';
import Loader from '../Loader';
import Alert from '../Alert';
import { Service } from '../ApiService';

class EventDemo extends Component {

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
            eventMain: {},
            eventId: evtId,
            loading: evtId!=0,
            attending: false,
            showAlert: false,
            showMessage: false,
        };
        this.onAttendanceChanged = this.onAttendanceChanged.bind(this);
    }

    setEventMain(data, showMessage = false) {
        data.date = new Date(data.date);
        this.setState({ eventMain: data, loading: false, showMessage: showMessage });
    }

    componentDidMount() {
        var component = this;
        if (this.state.eventId != 0) {
            Service.getEvent(this.state.eventId)
                .then(data => {
                    this.setEventMain(data);
                })
                .catch(exception => component.setState({ error: exception, loading: false }));
        }
        fetch('/Pictures.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({pictures: jjson})
        });
    }

    setActiveStep(num) {
        switch (this.state.activeTabIndex) {
            case 0:
                var me = this;
                var event = Object.assign({}, this.state.eventMain);
                event.id = this.state.eventId;
                this.setState({ loading: true });
                Service.changeEvent(event).then((data) => {
                    Service.getEventAttendees(data.id)
                        .then(attendees => {
                            setTimeout(() => { me.setState({ activeTabIndex: num, members: attendees, eventId: data.id, loading: false }); }, 500);
                        }).catch(err => { setTimeout(() => { me.setState({ activeTabIndex: num, members: [], eventId: data.id, loading: false }); }, 500); });
                });
                break;
            default:
                this.setState({ activeTabIndex: num });
        }
    }

    nextStep() {
        this.setActiveStep(this.state.activeTabIndex + 1);
    }

    navigateToEventEdit(id) {
        //this.props.history.push('/event-view/' + id);
        this.props.history.push('/event-edit/' + id);
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

    onAttendanceChanged(index){
        // YES
        if (!this.props.store.userInfo) {
            this.props.history.push({ pathname: '/SignIn', state: { redirectUrl: this.props.location.pathname } });
            return;
        }
        var func = index === 0 ? Service.selfSignUp : Service.selfSignOff;
        func(this.state.eventMain.id).then(data => this.setEventMain(data, true)).catch(err => alert(err));
    }

    render() {
        let tabSatellite = () => {
            return <div className = 'status-wrapper mb-2'>
                        <div className={eventStatus + ' status-indicator'}>{eventStatus}</div>
                            <div className = 'flex-wrap align-center'>
                                <button className='round-button medium-round-button grey-outline-button' onClick={() => this.navigateToEventEdit(this.state.eventId)}>
                                    Edit Event
                                </button>
                            </div>
                    </div>
        }
        let chapter = {};
        let eventDate = '';
        let eventTime = '';
        let eventType = '';
        const user = this.props.store.userInfo;
        if (this.props.store.chapterList.length > 0 && !this.state.loading) {
            let state = this.props.store.chapterList.find(element => {
                return element.chapters.find(innerElement => {return innerElement.id === this.state.eventMain.site})
            });
            chapter = state.chapters.find(element => {return element.id === this.state.eventMain.site});
        }
        if(this.state.eventMain.date !== undefined) {
            eventDate = 
            ("0" + this.state.eventMain.date.getMonth()).slice(-2) + "/" + 
            ("0" + this.state.eventMain.date.getDate()).slice(-2) + "/" + 
            this.state.eventMain.date.getFullYear();
            eventTime = 
            ("0" + this.state.eventMain.timeFrom.hours).slice(-2) + ":" + 
            ("0" + this.state.eventMain.timeFrom.minutes).slice(-2) + 
            (this.state.eventMain.timeFrom.am ? " AM": " PM") + ' - ' +
            ("0" + this.state.eventMain.timeTo.hours).slice(-2) + ":" + 
            ("0" + this.state.eventMain.timeTo.minutes).slice(-2) + 
            (this.state.eventMain.timeTo.am ? " AM": " PM");
            if(this.props.store.eventTypes.length > 0){
                eventType = this.props.store.eventTypes.find(element => element.id === this.state.eventMain.eventType).title;
            }
        }
        let eventStatus = this.state.eventMain.eventStatus;
        if (eventStatus === undefined) {eventStatus = "draft"}
        return (
            <div className='pages-wsm-wrapper ipw-1000' >
                {this.state.loading && <Loader/>}
                <div className='second-nav-wrapper'>
                    <div className='ipw-1000'>
                        <div className='flex-nowrap justify-center align-center'>
                            {this.state.eventMain.date > new Date() && <div className='flex-nowrap justify-center align-center'><span style={{ 'textTransform': "uppercase", 'marginRight': "0.5em", "fontWeight": "500" }}>Attend</span>
                                <TabComponent
                                    style={{ 'fontSize': '0.85rem', 'height': '24px' }}
                                    tabList={["yes", "no"]}
                                    wasSelected={(index) => {
                                        if (index == 0) {
                                            this.onAttendanceChanged(0);
                                        } else this.setState({ showAlert: true });
                                    }}
                                    activeTabIndex={this.state.eventMain.curentUserAttends ? 0 : 1}
                                /></div>}
                        </div>
                        <div>
                            {user && (user.authType == "Admin" || (user.authType == "Secretary" && user.chapterId == this.state.eventMain.site)) &&
                                <button 
                                    className='round-button medium-round-button outline-on-hover' 
                                    onClick={() => this.navigateToEventEdit(this.state.eventId)}
                                >
                                    <EditUpSVG />
                                    <span>Edit</span>
                                </button>
                            }
                        </div>
                    </div>
                </div>
                <h2 className='flex-nowrap align-center mb-2'>{this.state.eventMain.name}</h2>
                {user && (user.authType == "Admin" || (user.authType == "Secretary" && user.chapterId == this.state.eventMain.site)) &&
                <div className='flex-wrap flex-flow-column mb-3'>
                    <TabComponent
                        fixedHeight={true}
                        tabList={['information', 'attendees', 'budget', 'pictures']}
                        wasSelected={(index) => this.setActiveStep(index)}
                        activeTabIndex={this.state.activeTabIndex}
                    />
                </div>}
                {this.state.activeTabIndex === 0 && 
                    <div className='flex-wrap flex-flow-column justify-center align-center'>
                        <div className='flex-nowrap justify-space-between align-top w-100'>
                            <ul className='icon-text-set mb-1'>
                                {user && (user.authType == "Admin" || (user.authType == "Secretary" && user.chapterId == this.state.eventMain.site)) &&
                                    <li> <Status eventStatus={eventStatus} /> </li>
                                }
                                <li>
                                    <DateUpSVG />
                                    <span>{eventDate}</span>
                                </li>
                                <li>
                                    <TimeUpSVG />
                                    <span>{eventTime}</span>
                                </li>
                                <li>
                                    <ChaptersUpSVG />
                                    <span className='chapter'>{chapter.name !== undefined && chapter.name}</span>
                                </li>
                                <li>
                                    <EventUpSVG />
                                    <span>{eventType}</span>
                                </li>
                            </ul>
                            {/*<button style={{"flex": "0 0 auto"}} class="medium-static-button static-button">Attend</button>*/}
                            {/*user && (user.authType == "Admin" || (user.authType == "Secretary" && user.chapterId == this.state.eventMain.site)) &&
                                <Status eventStatus={eventStatus} />
                            */}
                        </div>
                        <span className='mb-1'>{this.state.eventMain.description}</span>
                    </div>
                }
                {this.state.activeTabIndex === 1 && <EventAttendees eventId={this.state.eventId} attendees={this.state.members} editsPermitted={false} showAttended={user && (user.authType == "Secretary" || user.authType == "Admin") && this.state.eventMain.date < new Date()}/> }
                {this.state.activeTabIndex === 2 && <EventBudget eventId={this.state.eventId} editsPermitted={false} projectedCost={this.state.eventMain.projectedCost}/>}
                {this.state.activeTabIndex === 3 && <EventPictures eventId={this.state.eventId} editsPermitted={false} />}
                {!(user && (user.authType == "Admin" || (user.authType == "Secretary" && user.chapterId == this.state.eventMain.site))) && <EventPictures eventId={this.state.eventId} editsPermitted={false} />}
                {/*<div className='flex-wrap'>
                    {this.state.activeTabIndex > 0 &&
                        <button className='medium-static-button static-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex-1})}>Back</button>
                    }
                    {this.state.activeTabIndex < 2 &&
                        <button className='medium-static-button static-button default-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex+1})}>Next</button>
                    }
                </div>*/}
                {this.state.showAlert && 
                    <Alert 
                        headerText = 'cancel'
                        text = "Are you sure you do not want to attend the event?"
                        onClose = {()=>this.setState({showAlert: false})}
                        mode = 'warning'
                        showOkCancelButtons = {true}
                        onCancelButtonClick = {()=>this.setState({showAlert: false})}
                        onOkButtonClick={() => { this.setState({ showAlert: false }); this.onAttendanceChanged(1); }}
                        cancelButtonText = "Attend"
                        okButtonText = "Not Attend"
                    >
                        <h4>{this.state.eventMain.name}</h4>
                    </Alert>
                }
                {this.state.showMessage && 
                    <Alert 
                        headerText = 'Success'
                        text = "You signed up to attend the event"
                        onClose = {()=>this.setState({showMessage: false})}
                        mode = 'success'
                        showOkButton = {true}
                        onOkButtonClick={() => this.setState({ showMessage: false })}
                        okButtonText = "Ok"
                    >
                        <h4>{this.state.eventMain.name}</h4>
                    </Alert>
                }
            </div>
        );
    }
}

export default withStore(EventDemo);