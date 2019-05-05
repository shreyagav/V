import React, { Component } from 'react';
import TabComponent from '../TabComponent';
import EventAttendees from './EventAttendees';
import EventPictures from './EventPictures';
import { withStore } from '../store';
import TimeUpSVG from '../../svg/TimeUpSVG';
import DateUpSVG from '../../svg/DateUpSVG';

class EventDemo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            repeatedEventsIsOpen: true,
            activeTabIndex: 0,
            members: [],
            budget: [],
            pictures: [],
        };
    }

    componentDidMount(){
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
        const members = this.state.members;
        const budget = this.state.budget;
        const pictures = this.state.formattedPicturesList;
        return (
            <div className='flex-nowrap flex-flow-column justify-center align-center pr-1 pl-1' >

                <h1 className='mb-2'>OJT Admin - OJT Weekly Hours Rep</h1>
                <TabComponent 
                    inheritParentHeight={false}
                    tabList={['description', 'attendees', 'pictures']}
                    wasSelected={(index) => this.setState({activeTabIndex: index})}
                    activeTabIndex={this.state.activeTabIndex}
                    tabEqualWidth={true}
                />
                {this.state.activeTabIndex === 0 && 
                    <div className='flex-wrap flex-flow-column justify-center align-center mt-2' style={{"maxWidth":"900px"}}>
                        <ul className='icon-text-set mt-1 mb-2'>
                            <li>
                                <DateUpSVG />
                                <span>05/12/2019</span>
                            </li>
                            <li>
                                <TimeUpSVG />
                                <span>08:00 AM - 09:00 AM</span>
                            </li>
                            <li>
                                <span><strong>Chapter:</strong></span>
                                <span className='chapter'>PA - SUSQUEHANNA VALLEY</span>
                            </li>
                            <li>
                                <span><strong>Type of Event:</strong></span>
                                <span>Flat or White Water Something Event</span>
                            </li>
                        </ul>
                        <span className='mb-3'>
                            Here goes some quite long event description. And some more words to show how long the description can actually be. Here goes some quite long event description. And some more words to show how long the description can actuallu be.
                        </span>
                    </div>
                }
                {this.state.activeTabIndex === 1 && <EventAttendees eventId={this.state.eventId} editsPermitted={false}/> }
                {this.state.activeTabIndex === 2 && <EventPictures eventId={this.state.eventId} editsPermitted={false}/> }
                <div className='flex-wrap'>
                    {this.state.activeTabIndex > 0 &&
                        <button className='medium-static-button static-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex-1})}>Back</button>
                    }
                    {this.state.activeTabIndex < 2 &&
                        <button className='medium-static-button static-button default-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex+1})}>Next</button>
                    }
                </div>
            </div>
        );
    }
}

export default withStore(EventDemo);