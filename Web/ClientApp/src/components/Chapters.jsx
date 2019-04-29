import React, { Component } from 'react';
import DropDown from './DropDown';
import MultiDropDown from './MultiDropDown/MultiDropDown';
import DatePicker from './DatePicker';
import CloseUpSVG from '../svg/CloseUpSVG';
import TimePicker from './TimePicker';
import { withStore } from './store';
import { Service } from './ApiService';
import Table from './Table';

import VolunteerUpSVG from '../svg/VolunteerUpSVG';
import VeteranUpSVG from '../svg/VeteranUpSVG';

class Chapters extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stateFilter1: [],
            stateFilter2: 8,
            stateFilter3: [2, 3, 4],
            stateFilter4: 'Veteran',
            stateFilter5: '#666666',
        };
        this.chaptersDropDownRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount(){document.addEventListener("mousedown", this.handleClick, false);
        console.log('mount');
        var me = this;
        setTimeout(()=>{console.log('set state');me.setState({stateFilter1:[401, 354]});},2000);}
    componentWillUnmount(){document.removeEventListener("mousedown", this.handleClick, false);}

    handleClick(e) {
        if(this.chaptersDropDownRef.state.isOpen && !this.chaptersDropDownRef.chaptersPickerRef.dropDownRef.contains(e.target)){
            this.chaptersDropDownRef.state.toggle();
        }
    }

    renderStateColumn (value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{"alignItems":"stretch"}}>
                {row['state'].name}
            </li>
        );
    }

    renderChaptersList(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{"alignItems":"stretch"}}>
                <ul>
                    {row['chapters'].map(element => 
                        <li style={{"fontSize":"1.1em"}} key={index + element['name']}><a href='/new-chapter'>{element['name']}</a></li>
                    )}
                </ul>
            </li>
        );
    }

    filterList() {
        let list = this.props.store.chapterList;
        if (this.state.stateFilter !== "" && this.state.stateFilter !== "National") {
            const newList = this.props.store.chapterList.filter(element => 
                (element.state === this.state.stateFilter.name)
            );
            list = newList;
        }
        return list;
    }

    render() {
        /*const chapterList = this.filterList();*/
        const stateList = Array.from(this.props.store.chapterList, element => {return {"name":element.state.name}});
        const columns=[
            {title:"State", accesor:"state", className:"borders-when-display-block chapter", render: this.renderStateColumn},
            {title:"Chapters", accesor:"chapters", render: this.renderChaptersList}
        ];
        
        
        const newChapterList = [
            {"state": "Alabama", "id":1, "chapters": [{"name":"South Alabama"}]},
            {"state": "California", "id":2, "chapters": [{"name":"American River"}, {"name":"Palo Alto"}, {"name":"San Diego"}]},
            {"state": "Colorado", "id":3, "chapters": [{"name":"Denver"}, {"name":"Ft. Carson/Colorado Springs","checked":false},{"name":"Fort Collins","checked":false},{"name":"Grand Junction","checked":false},{"name":"Montrose"}]},
            {"state": "District of Columbia", "id":4, "chapters": [{"name":"Washington, DC"}]},
            {"state": "Florida", "id":5, "chapters": [{"name":"St. Cloud","checked":false},{"name":"St. Augustine","checked":false},{"name":"Tampa Bay","checked":false}]},
            {"state": "Georgia", "id":6, "chapters": [{"name":"Atlanta","checked":false},{"name":"Savannah – Ft. Stewart"}]},
            {"state":"Idaho", "id":7, "chapters": [{"name":"Boise"}]},
            {"state":"Illinois", "id":8, "chapters": [{"name":"Decatur"}]},
            {"state":"Indiana", "id":9, "chapters": [{"name":"Northwest Indiana","checked":false},{"name":"Indiana State","checked":false},{"name":"Indianapolis"}]},
            {"state":"Iowa", "id":10, "chapters": [{"name":"Des Moines"}]},
            {"state":"Kentucky", "id":11, "chapters": [{"name":"Ft. Campbell","checked":false},{"name":"Lexington","checked":false}]},
            {"state":"Maine", "id":12, "chapters": [{"name":"Maine"}]},
            {"state":"Maryland", "id":13, "chapters": [{"name":"Walter Reed National Military Medical Center","checked":false},{"name":"Perry Point VA","checked":false},{"name":"Southern Maryland"},{"name":"University of Maryland"}]},
            {"state":"Massachusetts", "id":14, "chapters": [{"name":"Boston"}]},
            {"state":"Michigan", "id":15, "chapters": [{"name":"Battle Creek"}]},
            {"state":"Minnesota", "id":16, "chapters": [{"name":"Minneapolis"}]},
            {"state":"Missouri", "id":17, "chapters": [{"name":"St. Louis","checked":false},{"name":"Springfield – Missouri State University","checked":false}]},
            {"state":"Montana", "id":18, "chapters": [{"name":"Bozeman"}]},
            {"state":"North Carolina", "id":19, "chapters": [{"name":"Asheville","checked":false},{"name":"Charlotte","checked":false},{"name":"Raleigh-Durham","checked":false},{"name":"Winston Salem, Greensboro, High Point"}]},
            {"state":"New Hampshire", "id":20, "chapters": [{"name":"NEHSA"}]},
            {"state":"Nevada", "id":21, "chapters": [{"name":"Reno"}]},
            {"state":"New York", "id":22, "chapters": [{"name":"Northport VA","checked":false}, {"name":"Buffalo"}]},
            {"state":"Ohio", "id":23, "chapters": [{"name":"Cincinnati"},{"name":"Ironton","checked":false},{"name":"North East & Central Ohio"}]},
            {"state":"Oregon", "id":24, "chapters": [{"name":"Portland"}]},
            {"state":"Pennsylvania", "id":25, "chapters": [{"name":"Butler","checked":false},{"name":"Lehigh Valley","checked":false},{"name":"Ohiopyle","checked":false},{"name":"Southeast PA","checked":false},{"name":"Susquehanna Valley"}]},
            {"state":"South Carolina", "id":26, "chapters": [{"name":"Columbia","checked":false},{"name":"Charleston","checked":false},{"name":"Clemson"}]},
            {"state":"Tennessee", "id":27, "chapters": [{"name":"Austin Peay State University","checked":false},{"name":"Chattanooga","checked":false},{"name":"Johnson City/Tricities Northern TN","checked":false},{"name":"Memphis","checked":false},{"name":"Nashville"}]},
            {"state":"Texas", "id":28, "chapters": [{"name":"San Antonio","checked":false}, {"name":"Houston"}]},
            {"state":"Utah", "id":29, "chapters": [{"name":"Salt Lake City"}]},
            {"state":"Virginia", "id":30, "chapters": [{"name":"Blue Ridge","checked":false},{"name":"Fort Belvoir","checked":false},{"name":"Richmond","checked":false},{"name":"Fredericksburg"}]},
            {"state":"Washington", "id":31, "chapters": [{"name":"Seattle","checked":false}, {"name":"Spokane"}]},
            {"state":"West Virginia", "id":32, "chapters": [{"name":"Beckley","checked":false}, {"name":"Shepherd","checked":false}]},
            {"state":"Wisconsin", "id":33, "chapters": [{"name":"Green Bay","checked":false}, {"name":"Milwaukee"}]},
            {"state":"International", "id":34, "chapters": [{"name":"Italy – Camp Ederle"}]}
        ]

        return (
            <div className='flex-nowrap justify-center'>
                <div className='flex-nowrap flex-flow-column align-center mt-3 pb-2 mediaMin500-pl-pr-025' style={{"width":"600px"}}>
                    <div className="flex-wrap align-center justify-space-between w-100 mb-2 mediaMax500-pl-pr-025">
                        <h1 className='uppercase-text'><strong>Chapters</strong></h1>
                        <a className='big-static-button static-button' href="/new-chapter"><p>ADD NEW CHAPTER</p></a>
                    </div>
                    <div className="label-input-wrapper mediaMax500-pl-pr-025">
                        <p>CHAPTER:</p>
                       
                        <MultiDropDown 
                            ref={el => this.chaptersDropDownRef = el}
                            list={this.props.store.chapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            expandBy='chapters'
                            expandedTextProperty='name'
                            expandedKeyProperty='id'
                            expandedMultiSelect={true}
                            defaultValue={this.state.stateFilter1}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter1: value})}
                        />

                        <MultiDropDown 
                            list={this.props.store.chapterList}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter2}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter2: value})}
                        />
                        
                        <MultiDropDown 
                            list={newChapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter3}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter3: value})}
                        />

                        <MultiDropDown
                            list={[{name: 'Veteran', img: <VeteranUpSVG />},{name: 'Volunteer', img: <VolunteerUpSVG />}]}
                            keyProperty='name'
                            textProperty='name'
                            defaultValue={this.state.stateFilter4}
                            placeholder='Role'
                            onDropDownValueChange = {value => this.setState({stateFilter4: value})}
                        />

                        <MultiDropDown
                            list={this.props.store.colorList} 
                            keyProperty='color'
                            textProperty='name'
                            defaultValue={this.state.stateFilter5}
                            placeholder='Color'
                            onDropDownValueChange = {value => this.setState({stateFilter5: value})}
                        />

                    </div>
                    <button onClick={()=>console.log(this.state)}>check state</button>
                    {/*<Table columns={columns} data={chapterList}/>*/}
                </div>
            </div>
        );
    }
}

export default withStore(Chapters);