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
            onFocus: false,
            /* STORE */
                list: [],
                modifiedList: [],
                value: [],
                placeholder: '',
                expandBy: false,
                textProperty:'',
                keyProperty:'',
                expandedTextProperty: '',
                expandedKeyProperty: '',
                expandedMultiSelect: 'false',
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
    }

    componentWillMount() {
        this.fillStore(this.props); /* STORE */

        /* LIST */
        let toggleable = true;
        if (this.props.hideHeader || this.props.hideList) { toggleable = false }
        else {if (this.props.toggleable) {
            toggleable = this.props.toggleable
        }}
        if(toggleable){
            this.setState({onFocus: true});
            document.addEventListener('wheel', this.handleWheel, {passive : false});
        } 
        else document.addEventListener("mousedown", this.handleClick, false);
        window.addEventListener("resize", this.setHeight);
    }

    componentWillReceiveProps(props) {
        this.fillStore(props); /* STORE */
    }

    /*componentWillUpdate(){ 
        debugger
        if(!this.state.toggleable || (this.state.toggleable && this.state.isOpen)) {
            this.setHeight();
         }
    }*/

    componentWillUnmount(){
        /* LIST */
        if(this.state.toggleable){
            document.removeEventListener('wheel', this.handleWheel, {passive : false});
        }
        else document.removeEventListener("mousedown", this.handleClick, false);
        window.removeEventListener("resize", this.setHeight);
    }

    componentDidMount(){
        //debugger
        if(!this.state.toggleable || (this.state.toggleable && this.state.isOpen)) {
            this.setHeight(); 
        }
    }

    componentDidUpdate(){
        /* LIST */
        if(this.state.onFocus) {
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
        //debugger
        if(!this.state.toggleable || (this.state.toggleable && this.state.isOpen)) {
            this.setHeight();
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
        let modifiedList = this.state.modifiedList;
        let value = this.state.value;
        let multiSelect = this.state.multiSelect;
        let expandBy = this.state.expandBy;
        let keyProperty = this.state.keyProperty;
        let textProperty = this.state.textProperty;
        let expandedMultiSelect = this.state.expandedMultiSelect;
        let expandedKeyProperty = this.state.expandedKeyProperty;
        let expandedTextProperty = this.state.expandedTextProperty;
        let headerList = [];
        if(expandBy){
            //2 level array
            if(expandedMultiSelect){
                for(var i=0; i < modifiedList.length; i++){
                    var modifiedListElement = modifiedList[i];
                    if (modifiedListElement.checked === 1 || modifiedListElement.checked === true) {
                        headerList.push({"parentElement" : modifiedListElement, "parentElementIndex" : i});
                    }
                    else {
                        let innerArray = modifiedListElement[expandBy];
                        for (let j=0; j < innerArray.length; j++){
                            let innerArrayElement = innerArray[j];
                            if (innerArrayElement.checked){
                                headerList.push({"childElement": innerArrayElement, "childElementIndex":j, "parentElement" : modifiedListElement, "parentElementIndex" : i});
                            }
                        }
                    }
                }
            }
            else {
                for(var i=0; i < modifiedList.length; i++){
                    var modifiedListElement = modifiedList[i];
                    let innerArray = modifiedListElement[expandBy];
                    for (let j=0; j < innerArray.length; j++){
                        let innerArrayElement = innerArray[j];
                        if (innerArrayElement[expandedKeyProperty] === value){
                            headerList.push({"childElement": innerArrayElement, "childElementIndex":j, "parentElement" : modifiedListElement, "parentElementIndex" : i});
                        }
                    }
                }
            }
        }
        else {
            //1 level multiselect
            if(multiSelect){
                for(let i=0; i < modifiedList.length; i++){
                    let modifiedListElement = modifiedList[i];
                    if (modifiedListElement.checked){
                        headerList.push({"parentElement" : modifiedListElement, "parentElementIndex" : i});
                    }
                }
            }
            //1 level 1 value
            else {
                for(var i=0; i < modifiedList.length; i++){
                    var modifiedListElement = modifiedList[i];
                    if (modifiedListElement[keyProperty] === value){
                        headerList.push({"parentElement" : modifiedListElement, "parentElementIndex" : i});
                    }
                }
            }
        }
        return headerList;
    }

    /* STORE */

    get = (key) => {
        return this.state[key]
    }

    set = (key, value) => {
        const state = this.state
        state[key] = value
        this.setState(state)
    }

    remove = key => {
        const state = this.state
        delete state[key]
        this.setState(state)
    }

    setObject = obj => {
        const state = this.state;
        for(var key in obj){
            state[key] = obj[key];
        }
        this.setState(state);
    }

    onCheckBoxChange = (index, innerIndex) => {
        this.checkBoxChange(index, innerIndex);
    }

    unselect = (e, element) => {
        let index = element.parentElementIndex;
        let innerIndex = -1;
        if(element.childElementIndex){
            innerIndex = element.childElementIndex;
        }
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
        if(this.state.expandBy){
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
        let modifiedList = this.state.modifiedList;
        let defaultValue = this.state.value;
        let expandBy = this.state.expandBy;
        let keyProperty = this.state.keyProperty;
        let textProperty = this.state.textProperty;
        let expandedKeyProperty = this.state.expandedKeyProperty;
        let expandedTextProperty = this.state.expandedTextProperty;
        if (this.state.expandBy) {
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
            if(this.state.multiSelect){
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

    checkBoxChange = (index, innerIndex) => {
        let value = this.state.value;
        let dropDownList = this.state.modifiedList;
        let keyProperty = this.state.keyProperty;
        let textProperty = this.state.textProperty;
        let expandBy = this.state.expandBy;
        let expandedTextProperty = this.state.expandedTextProperty;
        let expandedKeyProperty = this.state.expandedKeyProperty;
        let listElement = dropDownList[index];
        let listElementInnerList = listElement[expandBy];
        if (this.state.multiSelect && innerIndex < 0) {
            if (listElement.checked === true || listElement.checked === false) {
                listElement.checked = !listElement.checked;
                // add or remove value
                if (listElement.checked) {value.push(listElement[keyProperty]);}
                else {value = this.arrayRemove(value, listElement[keyProperty]);}

                /* should I remove next step ??? 
                if(expandBy) {
                    listElementInnerList.forEach(element => {element.checked = listElement.checked});
                }*/
            }
            else {
                if (listElement.checked === 1 || listElement.checked === 0) {
                    listElement.checked = -1;
                    /*if(expandBy) {*/
                    listElementInnerList.forEach(element => {
                        element.checked = false;
                        value = this.arrayRemove(value, element[expandedKeyProperty]); // remove all inner elements from value list
                    });/*}*/
                }
                else //listElement.checked === -1 
                {
                    listElement.checked = 1;
                    if(expandBy) {listElementInnerList.forEach(element => {
                        element.checked = true;
                        value.push(element[expandedKeyProperty]); // add all inner elements to value list
                    });}
                };
            }
        }
        if (this.state.expandedMultiSelect && innerIndex > -1) {
            listElementInnerList[innerIndex].checked = !listElementInnerList[innerIndex].checked;
            if(listElementInnerList[innerIndex].checked){
                value.push(listElementInnerList[innerIndex][expandedKeyProperty]); // add value
                let allChaptersChecked = true; /*  */
                for(let i=0; i < listElementInnerList.length; i++){
                    if (!listElementInnerList[i].checked) {
                        allChaptersChecked = false;
                    }
                }
                if (allChaptersChecked) {
                    listElement.checked = 1;
                }
                else {listElement.checked = 0;}
            }
            else {
                value = this.arrayRemove(value, listElementInnerList[innerIndex][expandedKeyProperty]); // remove value from list
                if(listElement.checked > -1 ){
                    //check if there are any chepters checked
                    let noChaptersChecked = true;
                    for(let i=0; i < listElementInnerList.length; i++){
                        if (listElementInnerList[i].checked) {
                            noChaptersChecked = false;
                        }
                    }
                    if (noChaptersChecked) {
                        listElement.checked = -1;
                    }
                    else {listElement.checked = 0;}
                }
            }
        }
        this.setState({modifiedList: dropDownList, value: value});
        this.props.onDropDownValueChange(value);
    }

    arrayRemove = (arr, value) => {
        return arr.filter(element => {
            return element !== value;
        });
    }

    /* LIST */

    handleClick(e) {
        if (this.simpleBarWrapperRef !== null && !this.simpleBarWrapperRef.contains(e.target)){
            this.setState({onFocus: false});
        }
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
        if(this.simpleBarWrapperRef !== null){
            /*if (this.props.flexibleParent === true){
                this.simpleBarHeight = '269px';
                this.className = "drop-down-list-wrapper";
                this.style = {"height": this.simpleBarHeight, "position": "relative", "borderColor":"#999999"};
            }
            else { */
                let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                let dropDownHeaderHeight = 0;
                if(this.dropDownHeaderRef !== null){
                    dropDownHeaderHeight = this.dropDownHeaderRef.getBoundingClientRect().height;
                    if (dropDownHeaderHeight !== this.state.dropDownHeaderHeight){
                        this.setState({dropDownHeaderHeight: dropDownHeaderHeight});
                    }
                }
                let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
                let bottom = top + dropDownHeaderHeight;
                let toTop = top - 56 - dropDownHeaderHeight; /* 56 - NAVBAR HEIGHT */
                let toBottom = windowHeight - bottom + dropDownHeaderHeight;
                let coeff = 0;
                let openStateIndex = Object.keys(this.state.openStateIndex);
                openStateIndex.forEach(element => {  
                    let ind = parseInt(element.slice(1));
                    coeff = coeff + this.state.modifiedList[ind][this.state.expandBy].length;
                })
                let regularHeight = 45*(this.state.modifiedList.length + coeff);
                let simpleBarHeight = 0;
                if (this.state.toggleable) {
                    if (toTop > toBottom){
                        //* OPENS UP *//
                        this.opensDown = false;
                        //simpleBarHeight = Math.floor(toTop);
                        simpleBarHeight = (Math.floor(toTop/45))*45-1;
                        if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                        this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                        this.className = "drop-down-list-wrapper";
                        this.style = {"height":this.simpleBarHeight, "bottom":(dropDownHeaderHeight).toString()+'px', "marginBottom":"-1px", "boxShadow": "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                    }
                    else {
                        /* OPENS DOWN */
                        this.opensDown = true;
                        //simpleBarHeight = Math.floor(toBottom);
                        simpleBarHeight = (Math.floor(toBottom/45))*45-1;
                        if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                        this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                        this.className = "drop-down-list-wrapper";
                        this.style = {"height":this.simpleBarHeight, "top": "0px", "marginTop":"-1px", "boxShadow": "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                    }
                    //simpleBarHeight = (Math.floor((toBottom - 16)/45))*45-1;
                }
                else {
                    simpleBarHeight = Math.floor(toBottom);
                    if(this.props.substractHeight){
                        if(simpleBarHeight < regularHeight + this.props.substractHeight) {
                            simpleBarHeight = Math.floor((simpleBarHeight - this.props.substractHeight)/45)*45-1;
                            //this.style = {"height":'calc('+ this.simpleBarHeight + ' - ' + this.props.substractHeight + ')'};
                        }
                        else {
                            simpleBarHeight = Math.floor(regularHeight/45)*45-1;
                        }
                    } 
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.style = {"height":this.simpleBarHeight};
                }
            /*} */
        }
    }

    checkBoxSelected(index, innerIndex) {
        this.onCheckBoxChange(index, innerIndex);
        if (this.props.onSelectionChanged) {
            var list = this.state.modifiedList;
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
            if (this.state.toggleable && this.state.isOpen) {
                this.toggle();
            }
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
        if (this.lastOpenState === index) {this.openStateRef = el;}
    }

    keyDownHandler(e, index, innerIndex, element){
        switch (e.keyCode){
            case 13: //ENTER
                if(this.props.expandBy){
                    // 2 layer element
                    if(innerIndex > -1){
                        // 2 layer element has been pressed
                        if(!this.state.expandedMultiSelect){
                            this.set("value", element[this.state.expandedKeyProperty]);
                            this.props.onDropDownValueChange(element[this.state.expandedKeyProperty]);
                            this.toggle();//
                        }
                    }
                    else {
                        // 1st layer element has been pressed
                        this.toggler(index);
                    }
                }
                else{
                    if(!this.state.multiSelect){
                        this.set("value", element[this.state.keyProperty]);
                        this.props.onDropDownValueChange(element[this.state.keyProperty]);
                        this.set("setFocusToIndex", 0);
                        this.toggle();
                    }
                }
                break;
            case 32: //Space
                this.checkBoxSelected(index, innerIndex);
                e.preventDefault();
                break;
            case 27://ESC
                if(this.state.toggleable){
                    this.setObject({"setFocusToIndex": 0,"setFocusToInnerIndex": -1,"openStateIndex":[]});
                    this.toggle();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(innerIndex > -1) {
                    // IT IS CHAPTER
                    if(innerIndex > 0) {
                        // NOT FIRST CHAPTER
                        this.setObject({"setFocusToIndex": index,"setFocusToInnerIndex": (innerIndex-1)});
                    }
                    else {
                        // FIRST CHAPTER
                        this.setObject({"setFocusToIndex": index,"setFocusToInnerIndex": -1});
                    }
                }
                else {
                    // IT IS STATE
                    if(this.state.openStateIndex["_"+(index-1).toString()] === true){
                        //previous state is open
                        this.setObject({"setFocusToIndex": (index-1),"setFocusToInnerIndex": this.state.modifiedList[index-1].chapters.length-1});
                    }
                    else{
                        //previous state is closed
                        this.setObject({"setFocusToIndex": (index-1),"setFocusToInnerIndex": -1});
                    }
                }
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(this.state.openStateIndex["_"+index.toString()] === true){
                    // STATE IS OPEN
                    if (innerIndex > -1){
                        // IT IS CHAPTER
                        if (innerIndex < this.state.modifiedList[index].chapters.length-1){ 
                            // NOT LAST CHAPTER
                            this.setObject({"setFocusToIndex": index,"setFocusToInnerIndex": innerIndex+1});
                        }
                        else {
                            // LAST CHAPTER
                            if (index < this.state.modifiedList.length-1) {
                                //NOT LAST STATE
                                this.setObject({"setFocusToIndex": index+1,"setFocusToInnerIndex": -1});
                            }
                        }
                    }
                    else {
                        // IT IS STATE 
                        this.setObject({"setFocusToIndex": index,"setFocusToInnerIndex": 0});
                    }
                }
                else {
                    // STATE IS CLOSED
                    if (index < this.state.modifiedList.length-1) {
                        //NOT LAST STATE
                        this.setObject({"setFocusToIndex": index+1,"setFocusToInnerIndex": -1});
                    }
                }
                break;
            case 9: // TAB
                if(!this.state.toggleable && this.props.passFocusForward !== false) {
                    let x = this.props.passFocusForward(e);
                    if(x) {this.setState({onFocus: false});}
                }
                e.preventDefault();
                break;
            default: break;
        }
    }

    renderListItem(element, index, style){
        let isOpen = (this.state.openStateIndex["_"+index.toString()] === true);
        return(
            <li key={index} className={isOpen ? 'openChapter' : ''} style={style}>
                <div
                    ref={el => {if(index === this.state.setFocusToIndex){this.setFocusToRef = el}}}
                    tabIndex='0'
                    onKeyDown = {(e) => this.keyDownHandler(e, index, -1, element)}
                >
                    {this.props.multiSelect && this.props.expandBy &&
                        <label>
                            <input 
                                type="checkbox" 
                                checked={(element.checked === true || element.checked === 1 || element.checked === 0) ? true : false}
                                onChange={() => {
                                    this.checkBoxSelected(index, -1); 
                                    this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                                }} 
                            />
                            {(element.checked === true || element.checked === 1 || element.checked === -1) ? <CheckBoxSVG /> : <CheckBoxSquareSVG />}
                        </label>
                    }
                    <button onClick={() => {
                        if (this.props.expandBy) {this.toggler(index, true)}
                        else {
                            if(!this.state.multiSelect){
                                this.setState(() => ({value: element[this.state.keyProperty]}));
                                this.props.onDropDownValueChange(element[this.state.keyProperty]);
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
                                    checked={(element.checked === true || element.checked === 1 || element.checked === 0) ? true : false}
                                    onChange={() => {
                                        this.checkBoxSelected(index, -1); 
                                        this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                                    }} 
                                />
                                {(element.checked === true || element.checked === 1 || element.checked === -1) ? <CheckBoxSVG /> : <CheckBoxSquareSVG />}
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
                                    {this.props.expandedMultiSelect && 
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                checked={el.checked}
                                                onChange={() => { 
                                                    this.checkBoxSelected(index, innerIndex);
                                                    this.setState(() => ({setFocusToIndex: index, setFocusToInnerIndex: -1}));
                                                }}
                                            />
                                            <CheckBoxSVG />
                                        </label>
                                    }
                                    <button onClick={() => {
                                        if(!this.state.multiSelect){
                                            this.setState(() => ({value: el[this.state.expandedKeyProperty]}));
                                            this.props.onDropDownValueChange(el[this.state.expandedKeyProperty]);
                                            this.toggle();
                                        }
                                    }}>
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
        /* header */
        const setStyle = () => {
            if (this.state.toggleable === true){
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
                    tabIndex={this.state.toggleable ? '0':'-1'} 
                    className='drop-down-header'
                    style={style}
                    onClick={() => { if (!this.props.disabled) this.toggle(); }}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                >
                    <ul 
                        ref={e => this.headerRef = e} 
                        onClick={(e) => this.headerClickHandler(e)}
                        className={(this.state.multiSelect || this.state.expandedMultiSelect) ? "multi-level-list" : "simple-list"}
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
                                        element.childElement[this.state.expandedTextProperty] + ', ' + element.parentElement[this.state.textProperty]
                                        :
                                        element.parentElement[this.state.textProperty]
                                    }</span>
                                    {(this.state.multiSelect || this.state.expendedMultiSelect) &&
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
                                <li className={(this.state.multiSelect || this.state.expendedMultiSelect)? 'inverted' :'placeholder'}>
                                    <span>{this.state.placeholder}</span>
                                </li>
                            }
                    </ul>
                    {this.state.toggleable &&
                        <button disabled className='arrow-button' >
                            <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                        </button>
                    }
                </div>
                }
                {/* DROP DOWN LIST */}
                {!this.props.hideList &&
                    <div ref={el => this.simpleBarWrapperRef = el} style={{"position":"relative"}}>
                    <div
                        className={this.className + ' ovfx-auto ovfx-hidden'}
                        style={this.state.isOpen || !this.state.toggleable ? this.style : {"display":"none"}}
                        onFocus = {() => {if(this.state.onFocus !== true){ this.setState({onFocus: true}) }}}
                    >
                        {/*<SimpleBar>*/}
                        <ul className='drop-down-list' 
                            ref={ el => this.simpleBarRef = el} 
                            /*style={{'height':this.simpleBarHeight}} */
                        >   
                            { this.props.expandBy || this.state.modifiedList.length < 100 
                                ? this.state.modifiedList.map((element, index) => this.renderListItem(element, index)) 
                                : <VirtualList
                                    width='100%'
                                    height={(this.simpleBarHeight.slice(0, this.simpleBarHeight.length - 2))*1}
                                    itemCount={this.state.modifiedList.length}
                                    itemSize={45} // Also supports variable heights (array or function getter)
                                    renderItem={({index, style}) =>
                                    {
                                        var element = this.state.modifiedList[index];
                                        return this.renderListItem(element, index, style);
                                    }}
                                />
                            }
                            {/*(this.state.modifiedList.length < 100 || this.props.expandBy) && this.state.modifiedList.map((element, index) => this.renderListItem(element, index))*/}
                            {/*(!this.props.expandBy || this.state.modifiedList.length >= 100) && 
                                <VirtualList
                                    width='100%'
                                    height={(this.simpleBarHeight.slice(0, this.simpleBarHeight.length - 2))*1}
                                    itemCount={this.state.modifiedList.length}
                                    itemSize={45} // Also supports variable heights (array or function getter)
                                    renderItem={({index, style}) =>
                                    {
                                        var element = this.state.modifiedList[index];
                                        return this.renderListItem(element, index, style);
                                    }}
                                />
                            */}
                        </ul>
                        {/*</SimpleBar>*/}
                    </div>
                    </div>
                }
            </div>
        )
    }
}
export default MultiDropDown;