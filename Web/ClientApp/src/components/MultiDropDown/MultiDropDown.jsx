import React, { Component } from 'react'
import './MultiDropDown.css'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { combineReducers } from 'redux'
import CloseSVG from '../../svg/CloseSVG'
import ArrowUpSVG from '../../svg/ArrowUpSVG'
import MultiDropDownList from './MultiDropDownList'
import SearchInput from '../SearchInput'

class MultiDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            secondaryList: [],
            isOpen: false,
            isActive: false,
            search: '',
            /* List Props */
            openStateIndex: [],
            setFocusToIndex: 0,
            setFocusToInnerIndex: -1,
        };
        this.simpleBarWrapperRef = null; //?
        this.dropDownHeaderRef = null;
        this.dropDownRef = null;
        this.toggleable = true;
        this.thereIsSearchInput = false;
        this.onFocusRef = null;
        this.searchInputRef = null;
        this.toggleButtonRef = null;

        this.afterGetListAsync = this.afterGetListAsync.bind(this);
        this.setToState = this.setToState.bind(this);
        this.toggler = this.toggler.bind(this);
        this.toggle = this.toggle.bind(this);
        this.headerOnClick = this.headerOnClick.bind(this);
        this.onClearValueButtonClick = this.onClearValueButtonClick.bind(this);
        this.returnFocusToParent = this.returnFocusToParent.bind(this);
        this.getPropperList = this.getPropperList.bind(this);
        this.onInputClick = this.onInputClick.bind(this);
    }

    componentWillMount() {
        // check if toggleable
        if (this.props.hideHeader || this.props.hideList) { this.toggleable = false }
        else {
            if (this.props.toggleable) { this.toggleable = this.props.toggleable }
            else this.toggleable = true;
        }
        //check if there is search input
        if(typeof(this.props.search) == "function" || typeof(this.props.getListAsync) == "function") {
            this.thereIsSearchInput = true;
        }
    }

    afterGetListAsync(data){
        this.setState({list: data});
    }

    componentDidMount() {
        if(typeof(this.props.getListAsync) == "function"){
            this.props.getListAsync(this.state.search).then(this.afterGetListAsync);
        }
    }

    setToState(obj) {
        let newState = this.state;
        let keys = Object.keys(obj);
        keys.forEach(key => newState[key] = obj[key]);
        this.setState(newState);
    }

    headerKeyDownHandler(e, element){
        switch (e.keyCode){
            case 13: //enter
                if(e.target.classList.contains('unselectButton')){ this.unselect(e, element) }
                if(e.target.classList.contains('drop-down-header')){ this.toggle() }
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.toggle();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.toggle();}
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.toggle();}
                break;
            default: break;
        }
    }

    createList(list) {
        //debugger
        let headerList = [];
        if (!this.props.expandBy) { 
            if(this.props.multiSelect){ // one level multiselect
                this.props.defaultValue.forEach(value => {
                    headerList.push({"parentElement": list.find(el => value === el[this.props.keyProperty])});
                })
            }
            else { // one level 1 value
                let tempElement = list.find(element => this.props.defaultValue === element[this.props.keyProperty]);
                if (tempElement){
                    headerList.push({"parentElement": tempElement});
                }
            }
        }
        else { // two levels multiselect
            if(this.props.expandedMultiSelect && this.props.defaultValue.length > 0){
                list.forEach(element => {
                    let thereAreSomeChecked = false;
                    let theyAllAreChecked = true;
                    let tempHeaderList = [];
                    element[this.props.expandBy].forEach( innerElement => {
                        let checked = this.props.defaultValue.indexOf(innerElement[this.props.expandedKeyProperty]);
                        if ( checked < 0) { theyAllAreChecked = false; }
                        else { 
                            tempHeaderList.push({
                                "childElement": innerElement,
                                "parentElement": element
                            });
                            thereAreSomeChecked = true; 
                        }
                    })
                    if (theyAllAreChecked) {
                        headerList.push({
                            "parentElement": element
                        });
                    }
                    else {
                        if (thereAreSomeChecked) {
                            headerList = headerList.concat(tempHeaderList);
                        }
                    }
                })
            }
            else { // two level one value
                let parentElement;
                let childElement;
                let findChild = (list) => {
                    childElement = list[this.props.expandBy].find(element => element[this.props.expandedKeyProperty] === this.props.defaultValue);
                    if(childElement !== undefined){ return true }
                    return false;
                }
                parentElement = list.find(listElement => findChild(listElement));
                if (parentElement && childElement){
                    headerList.push({
                        "childElement": childElement,
                        "parentElement": parentElement
                    });
                }
            }
        }
        return headerList;
    }

    unselect = (e, element) => {
        let index = this.props.list.indexOf(element.parentElement);
        let innerIndex = -1;
        if(element.childElement){innerIndex = element.parentElement[this.props.expandBy].indexOf(element.childElement)}
        this.checkBoxChange(index, innerIndex);
        e.stopPropagation();
    }

    getPropperList = () => {
        if(this.state.search !== ''){
            return this.state.secondaryList;
        } else return this.props.list;
    }

    checkBoxChange = (index, innerIndex) => {
        let value = this.props.defaultValue;
        let list = this.getPropperList();
        let element = list[index];
        /*if (this.props.multiSelect || this.props.expandedMultiSelect ) { */
            if (this.props.expandedMultiSelect){
                if (innerIndex < 0) { // 1st level check box was checked
                    let allAreSelected = true;
                    let someAreSelected = false;
                    element[this.props.expandBy].forEach(element => {
                        if( this.props.defaultValue.indexOf(element[this.props.expandedKeyProperty]) > -1 ){
                            someAreSelected = true;
                        } else {allAreSelected = false}
                    })
                    if (allAreSelected || someAreSelected) { //delete all inner elements
                        element[this.props.expandBy].forEach(element => value = this.arrayRemove(value, element[this.props.expandedKeyProperty]))
                    }
                    else { //add all inner elements
                        element[this.props.expandBy].forEach(element => value.push(element[this.props.expandedKeyProperty]));
                    }
                } 
                else { // 2nd level check box was checked
                    let innerElement = element[this.props.expandBy][innerIndex];
                    if( this.props.defaultValue.indexOf(innerElement[this.props.expandedKeyProperty]) > -1 ){
                        value = this.arrayRemove(value, innerElement[this.props.expandedKeyProperty]);
                    } else value.push(innerElement[this.props.expandedKeyProperty]);
                }
            }
            else {
                if( this.props.defaultValue.indexOf(element[this.props.keyProperty]) > -1 ){
                    value = this.arrayRemove(value, element[this.props.keyProperty]) 
                }
                else value.push(element[this.props.keyProperty])
            }
        /*} */
        this.onDropDownValueChange(value);
    }

    onDropDownValueChange(value){
        if(this.fakeValueRef){ 
            this.fakeValueRef.classList.remove('opacity05') 
        };
        this.props.onDropDownValueChange(value);
        if (this.thereIsSearchInput){
            if(!(this.props.multiSelect || this.props.expandedMultiSelect)){
                // 1 value search
                this.setState({search: ''});
            }
        }

    }

    arrayRemove = (arr, value) => {
        return arr.filter(element => {
            return element !== value;
        });
    }

    returnFocusToParent(){
        if(this.toggleable){
            if(this.thereIsSearchInput){ // return focus to SEARCH INPUT
                this.searchInputRef.focus({preventScroll: true});
                if(this.fakeValueRef){
                    this.fakeValueRef.classList.remove('opacity05');
                }
            } else { // return focus to TOGGLE BUTTON
                this.toggleButtonRef.focus({preventScroll: true})
            }
        } else { // return focus to WRAPPER ELEMENT
            this.simpleBarWrapperRef.focus({preventScroll: true});
        }
    }

    toggle = () => {
        if(!this.props.disabled){
            if (this.state.isOpen) {
                // on drop down CLOSES
                if(this.onFocusRef) {this.onFocusRef.classList.remove('onFocus')};
                this.setState({
                    isOpen: false, 
                    openStateIndex: [], 
                    setFocusToIndex: 0, 
                    setFocusToInnerIndex: -1
                }, () => {
                    if(!this.thereIsSearchInput && this.toggleButtonRef){
                        this.toggleButtonRef.focus({preventScroll: true});
                    }});
            }
            else {
                if(this.getPropperList().length > 0 || this.thereIsSearchInput){
                // on drop down OPENS
                    this.setState({isOpen: true}, () => {
                        if(this.searchInputRef) {
                            this.searchInputRef.focus({preventScroll: true});
                        } else {
                            this.simpleBarWrapperRef.focus({preventScroll: true});
                        }
                    });
                }
            }
        }
    }

    toggler(index) {
        if(this.props.expandBy){
            let openStateIndex = this.state.openStateIndex;
            if (openStateIndex['_'+index.toString()] === true){
                delete openStateIndex['_'+index.toString()];
                this.setState({openStateIndex: openStateIndex, setFocusToIndex: index, setFocusToInnerIndex: -1});
            }
            else { 
                openStateIndex['_'+index.toString()]=true;
                this.setState({openStateIndex: openStateIndex, setFocusToIndex: index, setFocusToInnerIndex: 0});
                this.lastOpenState = index;
            }
        }
    }

    walkDownTheList(e){
        let index = this.state.setFocusToIndex;
        let innerIndex = this.state.setFocusToInnerIndex;
        let list = this.getPropperList();
        switch (e.keyCode){
            case 13: //ENTER
                if(this.state.isOpen || this.state.isActive){
                    if(this.props.expandBy){
                        // 2 layer element
                        if(innerIndex > -1){
                            // 2 layer element has been pressed
                            if(!this.props.expandedMultiSelect){
                                this.onDropDownValueChange(list[index][this.props.expandBy][innerIndex][this.props.expandedKeyProperty]);
                                this.toggle();
                            }
                        }
                        else { // 1st layer element has been pressed
                            this.onFocusRef.classList.remove('onFocus');
                            this.toggler(index);
                        }
                    }
                    else{
                        if(!(this.props.multiSelect || this.props.expandedMultiSelect)){
                            this.onDropDownValueChange(list[index][this.props.keyProperty]);
                            if(this.thereIsSearchInput){this.setState({search: ""})}
                            this.toggle();
                        }
                    }
                } else {
                    this.toggle();
                }
                e.preventDefault();
                break;
            case 32: //Space
                this.checkBoxChange(index, innerIndex);
                e.preventDefault();
                break;
            case 27://ESC
                if(this.toggleable){
                    this.toggle();
                }
                e.preventDefault();
                break;
            case 38: //Up Arrow
                if(this.state.isOpen || this.state.isActive){
                    e.preventDefault();
                    if(innerIndex > -1) {
                        // IT IS CHAPTER
                        if(innerIndex > 0) {
                            // NOT FIRST CHAPTER
                            this.onFocusRef.classList.remove('onFocus');
                            this.setState({setFocusToIndex: index, setFocusToInnerIndex: innerIndex-1});
                        }
                        else {
                            // FIRST CHAPTER
                            this.onFocusRef.classList.remove('onFocus');
                            this.setState({setFocusToIndex: index, setFocusToInnerIndex: -1});
                        }
                    }
                    else {
                        // IT IS STATE
                        if(this.state.openStateIndex["_"+(index-1).toString()] === true){
                            //previous state is open
                            this.onFocusRef.classList.remove('onFocus');
                            this.setState({setFocusToIndex: index-1, setFocusToInnerIndex: list[index-1][this.props.expandBy].length-1});
                        }
                        else{
                            //previous state is closed or the first one
                            if (index > 0) {
                                // NOT FIRST STATE
                                this.onFocusRef.classList.remove('onFocus');
                                this.setState({setFocusToIndex: index-1, setFocusToInnerIndex: -1});
                            }
                        }
                    }
                } else { if(this.toggleable){this.toggle()} }
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(this.state.isOpen || this.state.isActive){
                    if(this.state.openStateIndex["_"+index.toString()] === true){
                        // STATE IS OPEN
                        if (innerIndex > -1){
                            // IT IS CHAPTER
                            if (innerIndex < list[index][this.props.expandBy].length-1){
                                // NOT LAST CHAPTER
                                this.onFocusRef.classList.remove('onFocus');
                                this.setState({setFocusToIndex: index, setFocusToInnerIndex: innerIndex+1});
                            }
                            else {
                                // LAST CHAPTER
                                if (index < list.length-1) {
                                    //NOT LAST STATE
                                    this.onFocusRef.classList.remove('onFocus');
                                    this.setState({setFocusToIndex: index+1, setFocusToInnerIndex: -1});
                                }
                            }
                        }
                        else {
                            // IT IS STATE 
                            this.onFocusRef.classList.remove('onFocus');
                            this.setState({setFocusToIndex: index, setFocusToInnerIndex: 0});
                        }
                    }
                    else {
                        // STATE IS CLOSED
                        if (index < list.length-1) {
                            //NOT LAST STATE
                            this.onFocusRef.classList.remove('onFocus');
                            this.setState({setFocusToIndex: index+1, setFocusToInnerIndex: -1});
                        }
                    }
                } else { if(this.toggleable){this.toggle()} }
                break;
            case 9: // TAB
                if(this.state.isOpen) {this.toggle()}
                break;
            default: break;
        }
    }

    headerOnClick = () => {
        if (this.thereIsSearchInput) {
            this.searchInputRef.focus();
        } else { this.toggle() }
    }

    onClearValueButtonClick = (e) => {
        if(this.timeoutVar) { clearTimeout(this.timeoutVar) }
        this.setState({search: "", setFocusToIndex: 0, setFocusToInnerIndex: -1});
        e.stopPropagation();
    }

    searchWithTimeOut(list, filter, params){
        this.timeoutVar = setTimeout(() => {
            let newList = this.props.search(list, filter, params);
            this.setState({secondaryList: newList});
        }, 150);
    }

    onSearchInputValueChange(value){
        clearTimeout(this.timeoutVar);
        if(this.props.searchMinCharacterCount > 1 && value.length < this.props.searchMinCharacterCount){
            this.setState({search: value, secondaryList: this.props.list});
        } else {
            if (value === ''){ this.setState({search: value, secondaryList: this.props.list}) }
            else { 
                this.setState({search: value, isOpen: true});
                this.searchWithTimeOut(this.props.list, value, this.props.searchParams);
            }
        }
    }

    onInputClick(){
        if(this.fakeValueRef && this.fakeValueRef !== null) {
            this.fakeValueRef.classList.add('opacity05')
        };
        if(this.state.isOpen === false) {this.toggle()} 
    }

    /*onSearchInputWrapperClick(e){
        //if(!this.state.isOpen){ this.toggle() };
        e.stopPropagation()
    }*/

    onDropDownBlur = () => {
        if(!this.state.isOpen && this.thereIsSearchInput && !(this.props.multiSelect || this.props.expandedMultiSelect)){ 
            this.setState({search: ""});
        }
    }

    render() {
        const setStyle = () => {
            let style = {};
            if (this.toggleable === true){
                if(this.state.isOpen){
                    style["border"] = "1px solid #0099cc";
                }
            }
            else{
                style["border"] = "0px solid #0099cc";
                /*style["margin"] = "-0.25rem";
                style["paddingTop"] = "1rem";
                style["paddingBottom"] = "1rem";*/
                style["cursor"] = "auto";
            }
            if (/*(this.props.multiSelect || this.props.expandedMultiSelect) &&*/ this.thereIsSearchInput) {
                style["cursor"] = "text";
            }
            return style;
        }
        let style = setStyle();
        const list = this.createList(this.props.list);
        const propperList = this.getPropperList();
        return (
            <div className='drop-down' ref={el => this.dropDownRef = el} onBlur = {() => this.onDropDownBlur()}>
                {!this.props.hideHeader && 
                <div ref={el => this.dropDownHeaderRef = el}
                    tabIndex={-1} 
                    className='drop-down-header flex-flow-column justify-stretch'
                    style={style}
                    onClick={this.headerOnClick}
                    onFocus={() => {this.dropDownHeaderRef.classList.add("ddhOnFocus")}}
                    onBlur={() => {this.dropDownHeaderRef.classList.remove("ddhOnFocus");}}
                >
                    <div className='flex-nowrap justify-stretch'>
                        <ul 
                            ref={e => this.headerRef = e}
                            className={(this.props.multiSelect || this.props.expandedMultiSelect) ? "multi-level-list" : "simple-list"}
                        >
                            {list.length > 0 && (!this.thereIsSearchInput || (this.props.multiSelect || this.props.expandedMultiSelect)) &&
                                list.map((element, index) => {
                                    let targetElement;
                                    if(element.childElement !== undefined){targetElement = element.childElement}
                                    else {targetElement = element.parentElement}
                                    return <li key={index}>
                                        {targetElement.color && 
                                            <span 
                                                className='colorIndicator'
                                                style={{"backgroundColor": targetElement.color, "marginRight":"0.5rem"}}>
                                            </span>
                                        }
                                        {targetElement.img && <span className='drop-down-icon'>{targetElement.img}</span>}
                                        <span>{
                                            element.childElement 
                                            ? 
                                            element.childElement[this.props.expandedTextProperty] + ', ' + element.parentElement[this.props.textProperty]
                                            :
                                            element.parentElement[this.props.textProperty]
                                        }</span>
                                        {(this.props.multiSelect || this.props.expandedMultiSelect) &&
                                            <button className='unselectButton'
                                                onClick={(e) => this.unselect(e, element)}
                                                onKeyDown={(e) => this.headerKeyDownHandler(e, element)}
                                            >
                                                <CloseSVG />
                                            </button>
                                        }
                                    </li>
                                })
                            }
                            {this.thereIsSearchInput && 
                                <li 
                                    className={this.props.multiSelect || this.props.expandedMultiSelect ? 'liSearchWrapper liSearchWrapperMultiSelect' : 'liSearchWrapper'} 
                                    style={{"flex": "1 1 auto"}} 
                                >
                                    <SearchInput
                                        setInputRef = {el => this.searchInputRef = el}
                                        setFakeValueRef = {el => this.fakeValueRef = el}
                                        dynamicWidth={true}
                                        placeholder={this.props.placeholder}
                                        autocompleteOff={true}
                                        value={this.state.search}
                                        inputKeyDownHandler={(e) => this.walkDownTheList(e)}
                                        //onWrapperClick={(e) => this.onSearchInputWrapperClick(e)}
                                        onInputClick={this.onInputClick}
                                        onValueChange={(value) => this.onSearchInputValueChange(value)}
                                        //onClearValueButtonClick={(e) => this.onSearchInputValueChange('')}
                                        headerRef={this.headerRef}
                                        multiSelect={this.props.multiSelect === true || this.props.expandedMultiSelect === true}
                                        dropDownValue={this.props.defaultValue}
                                        toggle={() => this.toggle()}
                                    />
                                </li>
                                }
                                {list.length === 0 && !this.thereIsSearchInput &&
                                    <li className={(this.props.multiSelect || this.props.expandedMultiSelect)? 'inverted' :'placeholder'}>
                                        <span>{this.props.placeholder}</span>
                                    </li>
                            }
                        </ul>
                        {this.toggleable /*&& !this.thereIsSearchInput */ &&
                            <button 
                                tabIndex = {this.thereIsSearchInput && !(this.props.multiSelect || this.props.expandedMultiSelect) ? -1 : 0}
                                className={(this.props.multiSelect || this.props.expandedMultiSelect) && list.length !== 0 ? 'arrow-button' : 'arrow-button onFocusWithDDH'} 
                                onClick={() => {this.toggle()}}
                                ref={el => this.toggleButtonRef = el}
                                onKeyDown={(e) => this.walkDownTheList(e)}
                            >
                                <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                            </button>
                        }
                    </div>
                </div>
                }
                <div ref={el => {
                        this.simpleBarWrapperRef = el;
                        if(!this.state.simpleBarWrapperRef){
                            this.setState({simpleBarWrapperRef:el})
                        }
                    }}
                    style={{"position":"relative"}} 
                    tabIndex={(this.isOpen || !this.toggleable) ? 0 : -1}
                    onKeyDown={(e) => this.walkDownTheList(e)}
                    className='123'
                    onFocus = {() => {
                        if(!this.toggleable){
                            this.setState({isActive: true})
                        }
                    }}
                    onBlur = {() => {
                        if(!this.toggleable){
                            if(this.onFocusRef !== null){
                                this.onFocusRef.classList.remove("onFocus");
                            };
                            this.setState({isActive: false})
                        }
                    }}
                >
                    {this.state.simpleBarWrapperRef && (propperList.length > 0 || this.state.search.length > 0) && (!this.toggleable || (this.toggleable && this.state.isOpen)) && !this.props.hideList &&
                        <MultiDropDownList
                            //General props
                            list = {propperList}
                            toggleable = {this.toggleable}
                            multiSelect={this.props.multiSelect}
                            keyProperty={this.props.keyProperty}
                            textProperty={this.props.textProperty}
                            expandBy={this.props.expandBy}
                            expandedTextProperty={this.props.expandedTextProperty}
                            expandedKeyProperty={this.props.expandedKeyProperty}
                            expandedMultiSelect={this.props.expandedMultiSelect}
                            defaultValue={this.props.defaultValue}
                            placeholder={this.props.placeholder}
                            onDropDownValueChange = {value => this.onDropDownValueChange(value)}
                            hideList = {this.props.hideList}
                            substractHeight = {this.props.substractHeight}
                            textPropertyRender = {this.props.textPropertyRender}
                            // New Props from Drop Down
                            checkBoxChange = {this.checkBoxChange}
                            dropDownHeaderRef = {this.dropDownHeaderRef}
                            simpleBarWrapperRef = {this.simpleBarWrapperRef}
                            toggle = {this.toggle}
                            toggler = {this.toggler}
                            setToState = {this.setToState}
                            openStateIndex = {this.state.openStateIndex}
                            setFocusToIndex = {this.state.setFocusToIndex}
                            setFocusToInnerIndex = {this.state.setFocusToInnerIndex}
                            isOpen = {this.state.isOpen}
                            isActive = {this.state.isActive}
                            thereIsSearchInput={this.thereIsSearchInput}
                            setFocusToRef={el => this.onFocusRef = el}
                            returnFocusToParent={this.returnFocusToParent}
                        />
                    }
                </div>
            </div>
        )
    }
}
export default MultiDropDown;