import React, { Component } from 'react';
import TabComponent from './TabComponent';
import DropDown from './DropDown';
import DatePicker from './DatePicker';
import CloseUpSVG from '../svg/CloseUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';
import ImageGallery from './ImageGallery';

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

    render() {
        const members = this.state.members;
        const budget = this.state.budget;
        const pictures = this.state.formattedPicturesList;
        return (
            <div className='flex-nowrap flex-flow-column align-center pb-2 pt-2'>
                <h1 className='uppercase-text mb-2'>EVENT<strong> DEMO</strong></h1>
                <TabComponent 
                    inheritParentHeight={false}
                    tabList={['info', 'attendees', 'budget', 'pictures']}
                    wasSelected={(index) => this.setState({activeTabIndex: index})}
                    activeTabIndex={this.state.activeTabIndex}
                    tabEqualWidth={true}
                />
                {this.state.activeTabIndex === 0 &&
                    <ul className='input-fields first-child-text-125 mt-3 mb-2 pl-1 pr-1'>
                        <li>
                            <p>Chapter:</p>
                            <DropDown 
                                ref={el => this.chaptersDropDownRef = el}
                                list={this.props.store.chapterList}
                                defaultValue={{name:'National'}}
                            />
                        </li>
                        <li>
                            <p>Start Date:</p>
                            <DatePicker
                                ref={el => this.dateStartDropDownRef = el}
                            />
                        </li>
                        <li>
                            <p></p>
                            <div>
                                <div className='flex-nowrap mb-1'>
                                        <p className='flex11auto'>For repeated events</p>
                                        <button 
                                            disabled
                                            className='arrow-button' 
                                            onClick={() => {this.toggleRepeatedEvents();}}
                                        >
                                            {/*<CloseUpSVG svgClassName={this.state.repeatedEventsIsOpen ? 'flip90' : 'flip270'}/>*/}
                                        </button>
                                </div>
                                {this.state.repeatedEventsIsOpen && 
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
                                }
                            </div>
                        </li>
                        <li>
                            <p>From:</p>
                            <ul className='input-fields-child-ul time-fields'>
                                <li>
                                    <TimePicker 
                                        ref={el => this.timeFromDropDownRef = el}
                                        timePickerMode={true}
                                    />
                                </li>
                                <li><p>to:</p></li>
                                <li>
                                    <TimePicker 
                                        ref={el => this.timeToDropDownRef = el}
                                        timePickerMode={true}
                                    />
                                </li>
                            </ul>
                        </li>
                        <li>
                            <p>Type of event:</p>
                            <DropDown
                                ref={el => this.typeOfEventDropDownRef = el}
                                list={[{name: 'Pool Session'}, {name: 'Flat or White Water Session'}, {name: 'National Event'}, {name: 'Regional Event'}, {name: 'Chapter Planning Party'}]} 
                                defaultValue={{name: 'Pool Session'}}
                            />
                        </li>
                        <li>
                            <p>Color:</p>
                            <DropDown
                                ref={el => this.colorDropDownRef = el}
                                list={this.props.store.colorList} 
                                defaultValue={{name: 'Gray', color: '#666666'}}
                            />
                        </li>
                        <li>
                            <p>Description:</p>
                            <textarea placeholder='Description'/>
                        </li>
                    </ul>
                }
                {this.state.activeTabIndex === 1 && 
                <div style={{"width":"100%", "maxWidth":"600px"}}>
                    <div className="flex-wrap align-center justify-center mt-2 mb-2">
                        <p className='input-label'>ADD ATTENDEES:</p>
                        <span>
                            <button disabled className='big-static-button static-button' >
                                Create New
                            </button>
                            <button disabled className='big-static-button static-button' >
                                Add Member
                            </button>
                        </span>
                    </div>
                    <ul className='table-element mt-1 mb-2'>
                        <li>
                            <ul className='table-element-header table-element-member table-member'>
                                <li>Name</li>
                                <li className='no-break'>Role</li>
                                <li>Phone</li>
                                <li>Email</li>
                                <li></li>
                            </ul>
                        </li>
                        {
                        members.map((element,index) => 
                            <ul key={index} className='table-element-content table-element-member table-member'>
                                <li >{element.firstName + " " + element.lastName}</li>
                                <li className='no-break'>{element.role}</li>
                                <li >{element.phone}</li>
                                <li >{element.email}</li>
                                <li className='no-padding'>
                                <button disabled className='square-button-width'>
                                    <CloseUpSVG svgClassName='flip90'/>
                                </button>
                                </li>
                            </ul>
                            )
                        }
                    </ul>
                </div>
                }
                {this.state.activeTabIndex === 2 && 
                <div style={{"width":"100%", "maxWidth":"600px"}}>

                    <ul className='input-fields first-child-text-240 mt-3 mb-1 pl-1 pr-1'>
                        <li className='number-field'>
                            <p className='input-label'>Entered Projected Cost:</p>
                            <input />
                        </li>
                        <li className='number-field'>
                            <p className='input-label'>Calculated Projected Cost:</p>
                            <input />
                        </li>
                    </ul>
                    <div className="flex-wrap align-center justify-center">
                        <p className='input-label'>ADD NEW ITEM:</p>
                        <button disabled className='big-static-button static-button' >Add Item</button>
                    </div>
                    <ul className='table-element mt-2 mb-2'>
                        <li>
                            <ul className='table-element-header table-element-member table-budget'>
                                <li>Name</li>
                                <li>Description</li>
                                <li>Cost</li>
                                <li></li>
                            </ul>
                        </li>
                        {
                        budget.map((element,index) => 
                            <ul key={index} className='table-element-content table-element-member table-budget'>
                                <li >{element.name}</li>
                                <li >{element.description}</li>
                                <li >{element.cost}</li>
                                <li className='no-padding'>
                                    <button disabled className='square-button-width'>
                                        <CloseUpSVG svgClassName='flip90'/>
                                    </button>
                                </li>
                            </ul>
                            )
                        }
                    </ul>
                </div>
                }
                {this.state.activeTabIndex === 3 && 
                <div style={{"width":"100%", "maxWidth":"600px"}}>
                    <div className="flex-wrap align-center justify-center mt-2">
                        <p className='input-label'>Upload a picture:</p>
                        <button disabled className='big-static-button static-button' >Browse</button>
                    </div>
                    <ImageGallery pictures={this.state.pictures} />
                </div>
                }
                <div className='flex-wrap'>
                    {this.state.activeTabIndex > 0 &&
                        <button className='medium-static-button static-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex-1})}>Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button className='medium-static-button static-button default-button' onClick={() => this.setState({activeTabIndex: this.state.activeTabIndex+1})}>Next</button>
                    }
                    {this.state.activeTabIndex === 3 &&
                        <button className='medium-static-button static-button default-button' disabled >Save</button>
                    }
                </div>
            </div>
        );
    }
}

export default withStore(EventDemo);