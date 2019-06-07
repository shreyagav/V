import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import EventAttendees from './EventAttendees';
import EventPictures from './EventPictures';
import EventBudget from './EventBudget';
import { withStore } from '../store';
import TimeUpSVG from '../../svg/TimeUpSVG';
import DateUpSVG from '../../svg/DateUpSVG';
import Loader from '../Loader';
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
        };
    }

    componentDidMount() {
        var component = this;
        if (this.state.eventId != 0) {
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

    /*componentDidMount(){
        var component = this;
        fetch('/Members.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({members: jjson})
        });
        fetch('/Budget.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({budget: jjson})
        });
        fetch('/Pictures.json')
        .then(function(data){return data.json();})
        .then(function(jjson){
          component.setState({pictures: jjson})
        });
    } */

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
            <div className='flex-nowrap flex-flow-column justify-center align-center pt-2 pb-2 pr-1 pl-1' >
                {this.state.loading && <Loader/>}
                <h1 className='mb-2'>{this.state.eventMain.name}</h1>
                {user && (user.authType == "Admin" || (user.authType == "Secretary" && user.chapterId == this.state.eventMain.site)) &&
                    <div className='flex-wrap flex-flow-column mb-3'>
                    <div className='status-wrapper mb-2'>
                        <div className={eventStatus + ' status-indicator ml-025 mt-025'}>{eventStatus}</div>
                        <div className='flex-wrap align-center'>
                            <button className='round-button medium-round-button grey-outline-button ml-025 mt-025' onClick={() => this.navigateToEventEdit(this.state.eventId)}>
                                Edit Event
                            </button>
                        </div>
                    </div>
                    <TabComponent
                        fixedHeight={true}
                        tabList={['information', 'attendees', 'budget', 'pictures']}
                        wasSelected={(index) => this.setActiveStep(index)}
                        activeTabIndex={this.state.activeTabIndex}
                    />
                </div>}
                {this.state.activeTabIndex === 0 && 
                    <div className='flex-wrap flex-flow-column justify-center align-center' style={{"maxWidth":"900px"}}>
                        <ul className='icon-text-set mb-1'>
                            <li>
                                <DateUpSVG />
                                <span>{eventDate}</span>
                            </li>
                            <li>
                                <TimeUpSVG />
                                <span>{eventTime}</span>
                            </li>
                            <li>
                                <span><strong>Chapter:</strong></span>
                                <span className='chapter'>{chapter.name !== undefined && chapter.name}</span>
                            </li>
                            <li>
                                <span><strong>Type of Event:</strong></span>
                                <span>{eventType}</span>
                            </li>
                        </ul>
                        <span className='mb-3'>
                            Here goes some quite long event description. And some more words to show how long the description can actually be. Here goes some quite long event description. And some more words to show how long the description can actuallu be.
                        </span>
                    </div>
                }
                {this.state.activeTabIndex === 1 && <EventAttendees eventId={this.state.eventId} attendees={this.state.members} editsPermitted={false}/> }
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
            </div>
        );
    }
}

export default withStore(EventDemo);