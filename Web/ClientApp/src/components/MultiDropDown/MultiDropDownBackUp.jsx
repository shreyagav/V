import React, { Component } from 'react';
import './MultiDropDown.css'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { combineReducers } from 'redux';
//import { List } from "react-virtualized";
import VirtualList from 'react-tiny-virtual-list';

import CheckBoxSquareSVG from '../../svg/CheckBoxSquareSVG';
import CloseSVG from '../../svg/CloseSVG';
import CheckBoxSVG from '../../svg/CheckBoxSVG';
import ArrowUpSVG from '../../svg/ArrowUpSVG';

class MultiDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           //onFocus: false,
            isOpen: false,
            openStateIndex: [],
            setFocusToIndex: 0,
            setFocusToInnerIndex: 0,
        };

        this.lastOpenState = null;
        this.simpleBarRef = null;
        this.simpleBarWrapperRef = null;
        this.dropDownHeaderRef = null;
        this.dropDownRef = null;

        this.simpleBarHeight = '100%';
        this.opensDown = true;
        this.openStateRef = null;
        this.setFocusToRef = null;
        this.simpleList = false;

        this.setHeight = this.setHeight.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.className = '';
        this.style = {dropDownHeaderHeight: 0};
        this.checkBoxSelected = this.checkBoxSelected.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.toggleable = true;
    }

    componentWillMount() {
        //console.log("component Will Mount");
        //this.setState({onFocus: true});
        this.toggleable = this.checkIfTogglable();
        if(this.toggleable){document.addEventListener('wheel', this.handleWheel, {passive : false})} 
        else {
            document.addEventListener('wheel', this.handleWheel, {passive : false});
            /*document.addEventListener('keydown', (e) => this.tabHandler(e), false);*/
        }
        window.addEventListener("resize", this.setHeight);
    }

    componentWillUpdate(){
        //console.log("component Will Update");
        this.setHeight(); 
    }

    /*
    tabHandler(e){
        debugger
        if (document.activeElement === this.simpleBarWrapperRef) {
            debugger
        }
    }*/

    componentWillUnmount(){
        if(this.toggleable){
            document.removeEventListener('wheel', this.handleWheel, {passive : false});
            /*document.removeEventListener('keydown', (e) => this.tabHandler(e), false);*/
        }
        else document.removeEventListener("mousedown", this.handleClick, false);
        window.removeEventListener("resize", this.setHeight);
    }

    componentDidMount(){
        //console.log("component Did Mount");
        /*
        if(!this.toggleable || (this.toggleable && this.state.isOpen)) {
            this.setHeight(); 
        }*/
    }

    componentDidUpdate(){
        //console.log("component Did Update");
        if(!this.toggleable || (this.toggleable && this.state.isOpen)) {
            this.setFocus();
        };
        /*scroll last openned object into view */
        if(this.openStateRef !== null){
            var elem = this.openStateRef;
            var elemBottom = elem.getBoundingClientRect().bottom;
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if(elemBottom > windowHeight){
                elem.scrollIntoView(false);
            }
        }
        this.setHeight();
        /*
        if(!this.toggleable || (this.toggleable && this.state.isOpen)) {
            this.setHeight();
        }*/
    }

    checkIfTogglable = () => {
        if (this.props.hideHeader || this.props.hideList) { return false }
        else {
            if (this.props.toggleable) { return this.props.toggleable }
            else return true;
        }
    }

    /* HEADER */

    headerClickHandler(e) {
        if (e.target === this.headerRef && !this.props.disabled) {
            this.toggle();
        }
    }

    headerKeyDownHandler(e, element){
        switch (e.keyCode){
            case 13: //enter
                if(e.target.className === 'unselectButton'){this.unselect(e, element);}
                if(e.target.className === 'drop-down-header'){this.toggle();}
                this.dropDownHeaderRef.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.toggle();
                    this.dropDownHeaderRef.focus();
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

    createList() {
        let headerList = [];
        if (!this.props.expandBy) { 
            if(this.props.multiSelect){ // one level multiselect
                this.props.defaultValue.forEach(value => {
                    headerList.push({"parentElement": this.props.list.find(el => value === el[this.props.textProperty])});
                })
            }
            else { // one level 1 value
                let tempElement = this.props.list.find(element => this.props.defaultValue === element[this.props.keyProperty]);
                if (tempElement){
                    headerList.push({"parentElement": tempElement});
                }
            }
        }
        else { // two levels multiselect
            if(this.props.expandedMultiSelect && this.props.defaultValue.length > 0){
                this.props.list.forEach(element => {
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
                parentElement = this.props.list.find(listElement => findChild(listElement));
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

    toggle = () => {
        let isOpenWas = this.state.isOpen;
        if (isOpenWas) {
            this.setState(() => ({isOpen: !this.state.isOpen, openStateIndex: []}));
            this.dropDownHeaderRef.focus();
        }
        else {this.setState(() => ({isOpen: !this.state.isOpen}));}
    }

    toggler(index) {
        if(this.props.expandBy){
            let openStateIndex = this.state.openStateIndex;
            if (openStateIndex['_'+index.toString()] === true){
                delete openStateIndex['_'+index.toString()];
                this.setState(()=>({openStateIndex: openStateIndex, setFocusToIndex: index, setFocusToInnerIndex: -1}));
            }
            else { 
                openStateIndex['_'+index.toString()]=true;
                this.setState(()=>({openStateIndex: openStateIndex, setFocusToIndex: index, setFocusToInnerIndex: 0}));
                this.lastOpenState = index;
            }
        }
    }

    ifCheckParent(element, expandBy){
        let checkParent = true;
        let subArray = element[expandBy];
        for (let i=0; i < subArray.length; i++){
            if (!subArray[i].checked){
                checkParent = false;
            }
        }
        return checkParent;
    }

    /*
    fillStore(props) {
        if (props.list !== undefined) {
            let toggleable = true;
            if (props.hideHeader || props.hideList) {
                toggleable = false;
            } else {if (props.toggleable) {toggleable = props.toggleable}}
            let isOpen = false;
            if(props.toggleable === false){isOpen = true}
            let value = [];
            let openStateIndex = this.state.openStateIndex;
            if (props.defaultValue !== undefined){
                value = props.defaultValue;
                if ((value == null || value.length === 0) && Object.keys(this.state.openStateIndex).length > 0){
                    openStateIndex = [];
                }
            }
            let placeholder = '';
            if(props.placeholder){placeholder = props.placeholder;}
            let multiSelect = false;
            if (props.multiSelect){multiSelect = props.multiSelect};
            let keyProperty = props.keyProperty;
            let textProperty = props.textProperty;
            let expandBy = false;
            if(props.expandBy){expandBy = props.expandBy};
            let expandedMultiSelect = false;
            if(props.expandedMultiSelect) {expandedMultiSelect = props.expandedMultiSelect};
            let expandedTextProperty = false;
            if(props.expandedTextProperty){expandedTextProperty = props.expandedTextProperty}
            let expandedKeyProperty = false;
            if(props.expandedKeyProperty) {expandedKeyProperty = props.expandedKeyProperty};
            //modified list creation
            let list = [];
            props.list.forEach(element => {
                let clone = Object.assign({},element);//JSON.parse(JSON.stringify(element))
                if (expandedMultiSelect) {
                    clone.checked = -1;
                    clone[expandBy].map(subElement => {
                        subElement.checked = false;
                    });
                }
                else {
                    if(multiSelect){clone.checked = false;}
                }
                list.push(clone);
            });
            this.setState({ 
                isOpen: isOpen,
                modifiedList: list,
                value: value,
                openStateIndex: openStateIndex,
                placeholder: placeholder,
                multiSelect: multiSelect,
                keyProperty: keyProperty,
                textProperty: textProperty,
                expandBy: expandBy,
                expandedMultiSelect: expandedMultiSelect,
                expandedTextProperty: expandedTextProperty,
                expandedKeyProperty: expandedKeyProperty,
                toggleable: toggleable
            },this.setDefaultValue);
        }
    }

    setDefaultValue() {
        let modifiedList = this.props.list;
        let defaultValue = this.props.defaultValue;
        let expandBy = this.props.expandBy;
        let keyProperty = this.props.keyProperty;
        let textProperty = this.props.textProperty;
        let expandedKeyProperty = this.props.expandedKeyProperty;
        let expandedTextProperty = this.props.expandedTextProperty;
        if (this.props.expandBy) {
            // 2 level list
            for (let i=0; i < modifiedList.length; i++){
                let modifiedListElement = modifiedList[i];
                let subArray = modifiedListElement[expandBy];
                for (let j=0; j < subArray.length; j++){
                    let element = subArray[j];
                    if (defaultValue != null) {
                        for (let x = 0; x < defaultValue.length; x++) {
                            if (element[expandedKeyProperty] === defaultValue[x]) {
                                element.checked = true;
                                modifiedListElement.checked = 0; // some children are checked
                            }
                        }
                    }
                }
                // check if parent should be checked as well
                if(this.ifCheckParent(modifiedListElement, expandBy)){
                    modifiedListElement.checked = 1; //all children are checked
                }
            }
        }
        else {
            if(this.props.multiSelect){
                // 1 level list
                for (let i=0; i < modifiedList.length; i++){
                    let modifiedListElement = modifiedList[i];
                    for (let x=0; x < defaultValue.length; x++){ 
                        if(modifiedListElement[keyProperty] === defaultValue[x]){
                            modifiedListElement.checked = true;
                        }
                    }
                }
            } 
        }
        this.setState({modifiedList: modifiedList});
    }
    */

    checkIfInnerCheckboxChecked = (index, innerIndex) => {
        let element = this.props.list[index];
        let subElement = element[this.props.expandBy][innerIndex];
        let checked = this.props.defaultValue.indexOf(subElement[this.props.expandedKeyProperty]);
        if ( checked > -1 ) {return true} else return false
    }

    checkIfCheckboxChecked = (index) => {
        if(this.props.multiSelect){
            let element = this.props.list[index];
            if (!this.props.expandBy) { // one level list
                if ( this.props.defaultValue.indexOf(element[this.props.keyProperty]) > -1 ) {
                    return true;
                } else return false;
            }
            else { // two level list
                let thereAreSomeChecked = false;
                let theyAllAreChecked = true;
                element[this.props.expandBy].forEach(element => {
                    let checked = this.props.defaultValue.indexOf(element[this.props.expandedKeyProperty]);
                    if ( checked < 0) { theyAllAreChecked = false; }
                    else { thereAreSomeChecked = true; }
                })
                if (theyAllAreChecked) {return 1}
                else {
                    if (thereAreSomeChecked) {return 0}
                    else return -1;
                }
            }
        }
    }
    
    checkBoxChange = (index, innerIndex) => {
        let value = this.props.defaultValue;
        let element = this.props.list[index];
        if (this.props.multiSelect /*&& innerIndex < 0 */) {
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
        }
        this.props.onDropDownValueChange(value);

    }

    arrayRemove = (arr, value) => {
        return arr.filter(element => {
            return element !== value;
        });
    }

    handleClick(e) {
        /*
        if (this.simpleBarWrapperRef !== null && !this.simpleBarWrapperRef.contains(e.target)){
            this.setState({onFocus: false});
        }*/
    }

    setFocus(){
        if(this.setFocusToRef !== null){
            var list = this.simpleBarRef;
            var parentTop = list.parentElement.getBoundingClientRect().top;
            //var top = list.getBoundingClientRect().top;
            var elem = this.setFocusToRef;
            var elemTop = elem.getBoundingClientRect().top;
            var elemBottom = elem.getBoundingClientRect().bottom;
            var parentBottom = list.parentElement.getBoundingClientRect().bottom;
            if(parentTop > elemTop){
                list.parentElement.scrollTop = list.parentElement.scrollTop - (parentTop - elemTop);
            }
            if(elemBottom > parentBottom){
                list.parentElement.scrollTop = elemBottom - parentBottom + list.parentElement.scrollTop;
            }
            elem.focus({preventScroll: true});
        }
    }

    setHeight(){
        //console.log("SET HEIGHT");
        if(this.simpleBarWrapperRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let dropDownHeaderHeight = 0;
            if(this.dropDownHeaderRef !== null){
            dropDownHeaderHeight = this.dropDownHeaderRef.getBoundingClientRect().height;
            /* if (dropDownHeaderHeight !== this.state.dropDownHeaderHeight){
                this.setState({dropDownHeaderHeight: dropDownHeaderHeight});
            } */
            }
            let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
            let bottom = top + dropDownHeaderHeight;
            let toTop = top - 56 - dropDownHeaderHeight; /* 56 - NAVBAR HEIGHT */
            let toBottom = windowHeight - bottom + dropDownHeaderHeight;
            let coeff = 0;
            let openStateIndex = Object.keys(this.state.openStateIndex);
            openStateIndex.forEach(element => {  
                let ind = parseInt(element.slice(1));
                coeff = coeff + this.props.list[ind][this.props.expandBy].length;
            })
            let regularHeight = 45*(this.props.list.length + coeff);
            let simpleBarHeight = 0;
            if (this.toggleable) {
                if (toTop > toBottom){ //* OPENS UP *//
                    this.opensDown = false;
                    //simpleBarHeight = Math.floor(toTop);
                    simpleBarHeight = (Math.floor(toTop/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    this.style = {"height":this.simpleBarHeight, "bottom":(dropDownHeaderHeight).toString()+'px', "marginBottom":"-1px", "boxShadow": "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                }
                else { /* OPENS DOWN */
                    this.opensDown = true;
                    //simpleBarHeight = Math.floor(toBottom);
                    simpleBarHeight = (Math.floor(toBottom/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    this.style = {"height":this.simpleBarHeight, "top": "0px", "marginTop":"-1px", "boxShadow": "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                }
            }
            else {
                simpleBarHeight = Math.floor(toBottom);
                if(this.props.substractHeight){
                    if(simpleBarHeight < regularHeight + this.props.substractHeight) {
                        simpleBarHeight = Math.floor((simpleBarHeight - this.props.substractHeight)/45)*45-1;
                    }
                    else {simpleBarHeight = Math.floor(regularHeight/45)*45-1}
                } 
                this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                this.style = {"height":this.simpleBarHeight};
            }
        }
    }

    checkBoxSelected(index, innerIndex) {
        this.checkBoxChange(index, innerIndex);
        if (this.props.onSelectionChanged) {
            var list = this.props.list;
            if (list && list.length && list.length > 0) {
                if (this.props.expandBy) {
                    var temp = [];
                    list.forEach(a => {
                           temp = temp.concat(a.chapters.filter(b => b.checked));
                    });
                    this.props.onSelectionChanged(temp);
                } else {
                    this.props.onSelectionChanged(list.filter(a=>a.checked));
                }
            }
        }
    }

    handleWheel = (e) => {
        if (this.simpleBarRef === null || !(this.simpleBarRef.contains(e.target))) {
            if (this.toggleable && this.state.isOpen) {this.toggle();}
            return;
        }
        var cancelScrollEvent = function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            e.returnValue = false;
            return false;
        };
        this.hoverAllowed = true;
        var elem = this.simpleBarRef;
        var wheelDelta = e.deltaY;
        var scrollHeight = elem.scrollHeight;
        var scrolleableElement = this.simpleBarRef.parentElement;
        // Height is different with and without scrollbar
        //var height = elem.clientHeight; // WITH SIMPLE SCROLLBAR
        var height = scrolleableElement.clientHeight; // WITHOUT SIMPLE SCROLLBAR
        var parentTop = scrolleableElement.getBoundingClientRect().top;
        var top = this.simpleBarRef.getBoundingClientRect().top;
        var scrollTop = parentTop - top;
        var isDeltaPositive = wheelDelta > 0;
        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            this.simpleBarRef.parentElement.scrollTop = scrollHeight;
            return cancelScrollEvent(e);
        }
        else {
            if (!isDeltaPositive && -wheelDelta > scrollTop) {
                this.simpleBarRef.parentElement.scrollTop = 0;
                return cancelScrollEvent(e);
            }
        }
    }

    setUpRef(el, index){
        if (this.lastOpenState === index) {
            this.openStateRef = el;
        }
    }

    keyDownHandler(e, index, innerIndex, element){
        switch (e.keyCode){
            case 13: //ENTER
                if(this.props.expandBy){
                    // 2 layer element
                    if(innerIndex > -1){
                        // 2 layer element has been pressed
                        if(!this.props.expandedMultiSelect){
                            this.props.onDropDownValueChange(element[this.props.expandedKeyProperty]);
                            this.toggle();
                        }
                    }
                    else { // 1st layer element has been pressed
                        this.toggler(index);
                    }
                }
                else{
                    if(!this.props.multiSelect){
                        this.props.onDropDownValueChange(element[this.props.keyProperty]);
                        this.setState({setFocusToIndex: 0});
                        this.toggle();
                    }
                }
                break;
            case 32: //Space
                this.checkBoxSelected(index, innerIndex);
                e.preventDefault();
                break;
            case 27://ESC
                if(this.toggleable){
                    this.setState({setFocusToIndex: 0, setFocusToInnerIndex: -1, openStateIndex:[]});
                    this.toggle();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(innerIndex > -1) {
                    // IT IS CHAPTER
                    if(innerIndex > 0) {
                        // NOT FIRST CHAPTER
                        this.setState({setFocusToIndex: index, setFocusToInnerIndex: innerIndex-1});
                    }
                    else {
                        // FIRST CHAPTER
                        this.setState({setFocusToIndex: index, setFocusToInnerIndex: -1});
                    }
                }
                else {
                    // IT IS STATE
                    if(this.state.openStateIndex["_"+(index-1).toString()] === true){
                        //previous state is open
                        this.setState({setFocusToIndex: index-1, setFocusToInnerIndex: this.props.list[index-1].chapters.length-1});
                    }
                    else{
                        //previous state is closed
                        this.setState({setFocusToIndex: index-1, setFocusToInnerIndex: -1});
                    }
                }
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(this.state.openStateIndex["_"+index.toString()] === true){
                    // STATE IS OPEN
                    if (innerIndex > -1){
                        // IT IS CHAPTER
                        if (innerIndex < this.props.list[index].chapters.length-1){ 
                            // NOT LAST CHAPTER
                            this.setState({setFocusToIndex: index, setFocusToInnerIndex: innerIndex+1});
                        }
                        else {
                            // LAST CHAPTER
                            if (index < this.props.list.length-1) {
                                //NOT LAST STATE
                                this.setState({setFocusToIndex: index+1, setFocusToInnerIndex: -1});
                            }
                        }
                    }
                    else {
                        // IT IS STATE 
                        this.setState({setFocusToIndex: index, setFocusToInnerIndex: 0});
                    }
                }
                else {
                    // STATE IS CLOSED
                    if (index < this.props.list.length-1) {
                        //NOT LAST STATE
                        this.setState({setFocusToIndex: index+1, setFocusToInnerIndex: -1});
                    }
                }
                break;
            case 9: // TAB
                if(!this.toggleable && this.props.passFocusForward !== false) {this.props.passFocusForward(e)}
                e.preventDefault();
                break;
            default: break;
        }
    }

    renderListItem(element, index, style){
        let checked = this.checkIfCheckboxChecked(index);
        let isOpen = (this.state.openStateIndex["_"+index.toString()] === true);
        return(
            <li key={index} className={isOpen ? 'openChapter' : ''} style={style}>
                <div
                    ref={el => {if(index === this.state.setFocusToIndex){
                        this.setFocusToRef = el;
                        //console.log("REF");
                        //console.log(this.setFocusToRef);
                    }}}
                    tabIndex='0'
                    onKeyDown = {(e) => this.keyDownHandler(e, index, -1, element)}
                >
                    {this.props.multiSelect && this.props.expandBy &&
                        <label>
                            <input 
                                type="checkbox" 
                                checked={(checked === true || checked === 1 || checked === 0) ? true : false}
                                onChange={() => {
                                    this.checkBoxSelected(index, -1); 
                                    this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                                }} 
                            />
                            {(checked === true || checked === 1 || checked === -1) ? <CheckBoxSVG /> : <CheckBoxSquareSVG />}
                        </label>
                    }
                    <button onClick={() => {
                        if (this.props.expandBy) {this.toggler(index, true)}
                        else {
                            if(!this.props.multiSelect){
                                this.setState(() => ({value: element[this.props.keyProperty]}));
                                this.props.onDropDownValueChange(element[this.props.keyProperty]);
                                this.toggle();
                            }
                            else {
                                this.checkBoxSelected(index, -1); 
                                this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1})); 
                            }
                        }
                    }}>
                        {this.props.multiSelect && !this.props.expandBy &&
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={(checked === true || checked === 1 || checked === 0) ? true : false}
                                    disabled
                                    /*onChange={() => {
                                        debugger
                                        this.checkBoxSelected(index, -1); 
                                        this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                                    }}*/ 
                                />
                                {(checked === true || checked === 1 || checked === -1) ? <CheckBoxSVG /> : <CheckBoxSquareSVG />}
                            </label>
                        }
                        {element.color !== undefined && <span className='colorIndicator' style={{"backgroundColor":element.color, "marginRight":"0.5rem"}}></span>}
                        {element.img && <span className='drop-down-icon'>{element.img}</span>}
                        {this.props.textPropertyRender!== undefined 
                            ? this.props.textPropertyRender(element, this.props.textProperty)
                            : <span>{element[this.props.textProperty]}</span>
                        }
                        {this.props.expandBy && <ArrowUpSVG svgClassName={isOpen ? 'flip90' : 'flip270'}/>}
                    </button>
                </div>
                {isOpen && 
                    <ul className='drop-down-list' ref={(el) => this.setUpRef(el,index)}>
                        {element[this.props.expandBy].map((el, innerIndex) =>
                            <li key={innerIndex} className='openChapter'>
                                <div tabIndex='0'
                                    ref={el => {if(index === this.state.setFocusToIndex && innerIndex === this.state.setFocusToInnerIndex){this.setFocusToRef = el}}}
                                    onKeyDown = {(e) => {this.keyDownHandler(e, index, innerIndex, el);}}
                                >
                                    <button onClick={() => {
                                        if(this.props.expandedMultiSelect) {
                                            this.checkBoxSelected(index, innerIndex);
                                            this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                                        }
                                        else {
                                            this.setState(() => ({value: el[this.props.expandedKeyProperty]}));
                                            this.props.onDropDownValueChange(el[this.props.expandedKeyProperty]);
                                            this.toggle();
                                        }
                                    }}>
                                        {this.props.expandedMultiSelect && 
                                            <label>
                                                <input 
                                                    type="checkbox" disabled
                                                    checked={this.checkIfInnerCheckboxChecked(index, innerIndex) ? true : false}
                                                    /*onChange={() => { 
                                                        this.checkBoxSelected(index, innerIndex);
                                                        this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                                                    }}*/
                                                />
                                                <CheckBoxSVG />
                                            </label>
                                        }
                                        {el.color !== undefined && <span className='colorIndicator' style={{"backgroundColor":el.color, "marginRight":"0.5rem"}}></span>}
                                        {el.img && <span className='drop-down-icon'>{el.img}</span>}
                                        <span>{el[this.props.expandedTextProperty]}</span>
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                }
            </li>
        );
    }

    render() {
        const setStyle = () => {
            if (this.toggleable === true){
                if(this.state.isOpen){return {"border":"1px solid #0099cc"}}
            }
            else{
                return {
                    "border":"0px solid #0099cc",
                    "margin": "-0.25rem",
                    "paddingTop": "1rem",
                    "paddingBottom": "1rem",
                    "cursor": "auto"
                }
            }
        }
        let style = setStyle();
        const list = this.createList();
        return (
            <div className='drop-down' ref={el => this.dropDownRef = el}>
                {!this.props.hideHeader && 
                    <div
                    ref={el => this.dropDownHeaderRef = el}
                    tabIndex={this.toggleable ? '0':'-1'} 
                    className='drop-down-header'
                    style={style}
                    onClick={() => { if (!this.props.disabled) this.toggle(); }}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                >
                    <ul 
                        ref={e => this.headerRef = e} 
                        onClick={(e) => this.headerClickHandler(e)}
                        className={(this.props.multiSelect || this.props.expandedMultiSelect) ? "multi-level-list" : "simple-list"}
                    >
                            {list.length > 0 && list.map((element, index) => {
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
                                }
                            )}
                            {list.length === 0 &&
                                <li className={(this.props.multiSelect || this.props.expandedMultiSelect)? 'inverted' :'placeholder'}>
                                    <span>{this.props.placeholder}</span>
                                </li>
                            }
                    </ul>
                    {this.toggleable &&
                        <button disabled className='arrow-button' >
                            <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                        </button>
                    }
                </div>
                }
                {/* DROP DOWN LIST */}
                <div 
                    ref={el => this.simpleBarWrapperRef = el} 
                    style={{"position":"relative"}}
                    tabindex = {0}
                >
                    {!this.props.hideList &&
                    <div
                        className={this.className + ' ovfx-auto ovfx-hidden'}
                        style={this.state.isOpen || !this.toggleable ? this.style : {"display":"none"}}
                        //onFocus = {() => {if(this.state.onFocus !== true){ this.setState({onFocus: true}) }}}
                    >
                        {/*<SimpleBar>*/}
                        <ul className='drop-down-list' 
                            ref={ el => this.simpleBarRef = el} 
                            /*style={{'height':this.simpleBarHeight}} */
                        >   
                            { this.props.expandBy || this.props.list.length < 100 
                                ? this.props.list.map((element, index) => this.renderListItem(element, index)) 
                                : <VirtualList
                                    width='100%'
                                    height={(this.simpleBarHeight.slice(0, this.simpleBarHeight.length - 2))*1}
                                    itemCount={this.props.list.length}
                                    itemSize={45} // Also supports variable heights (array or function getter)
                                    renderItem={({index, style}) => {
                                        var element = this.props.list[index];
                                        return this.renderListItem(element, index, style);
                                    }}
                                />
                            }
                        </ul>
                        {/*</SimpleBar>*/}
                    </div>
                }
                </div>
            </div>
        )
    }
}
export default MultiDropDown;