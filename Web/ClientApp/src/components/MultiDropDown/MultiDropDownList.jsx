import React, { Component } from 'react';
import './MultiDropDown.css'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { combineReducers } from 'redux';
import VirtualList from 'react-tiny-virtual-list';

import CheckBoxSquareSVG from '../../svg/CheckBoxSquareSVG';
import CloseSVG from '../../svg/CloseSVG';
import CheckBoxSVG from '../../svg/CheckBoxSVG';
import ArrowUpSVG from '../../svg/ArrowUpSVG';

class MultiDropDownList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            style: {},
            openStateIndex: [],
            setFocusToIndex: 0,
            setFocusToInnerIndex: 0,
        };

        this.lastOpenState = null;
        this.simpleBarRef = null;
        this.simpleBarHeight = '100%';
        this.opensDown = true;
        this.openStateRef = null;
        this.setFocusToRef = null;
        this.simpleList = false;

        this.className = '';

        this.setHeight = this.setHeight.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.checkBoxSelected = this.checkBoxSelected.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        if(this.props.toggleable){ 
            document.addEventListener('wheel', this.handleWheel, {passive : false});
            document.addEventListener("mousedown", this.handleClick, false);
        } 
        window.addEventListener("resize", this.setHeight);
    }

    componentDidMount() {
        this.setHeight();
        // set height
        //this.setState({style: this.setHeight()});
    }

    componentDidUpdate(){
        this.setHeight();
        //let style = this.setHeight();
        //if(this.state.style.height !== style.height) { /* wrong height, set a right one */
            //this.setState({style: style});
        //}
        //else { /* Propper height is set already, no need to set it again */
            if(!this.props.toggleable || (this.props.toggleable && this.props.isOpen)) {
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
        //}
    }

    componentWillUnmount(){
        if(this.props.toggleable){
            document.removeEventListener('wheel', this.handleWheel, {passive : false});
            document.removeEventListener("mousedown", this.handleClick, false);
        }
        window.removeEventListener("resize", this.setHeight);
    }

    handleClick(e) {
        if(!(this.props.dropDownHeaderRef.contains(e.target) || this.props.simpleBarWrapperRef.contains(e.target))){ this.props.toggle() }
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
        if(this.props.simpleBarWrapperRef !== null){
            let style = {};
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let dropDownHeaderHeight = 0;
            if(this.props.dropDownHeaderRef !== null){
            dropDownHeaderHeight = this.props.dropDownHeaderRef.getBoundingClientRect().height;
            /* if (dropDownHeaderHeight !== this.state.dropDownHeaderHeight){
                this.setState({dropDownHeaderHeight: dropDownHeaderHeight});
            } */
            }
            let top = this.props.simpleBarWrapperRef.getBoundingClientRect().top;
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
            if (this.props.toggleable) {
                if (toTop > toBottom){ //* OPENS UP *//
                    this.opensDown = false;
                    //simpleBarHeight = Math.floor(toTop);
                    simpleBarHeight = (Math.floor(toTop/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    style = {"height":this.simpleBarHeight, "bottom":(dropDownHeaderHeight).toString()+'px', "marginBottom":"-1px", "boxShadow": "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                }
                else { /* OPENS DOWN */
                    this.opensDown = true;
                    //simpleBarHeight = Math.floor(toBottom);
                    simpleBarHeight = (Math.floor(toBottom/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    style = {"height":this.simpleBarHeight, "top": "0px", "marginTop":"-1px", "boxShadow": "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)"};
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
                style = {"height":this.simpleBarHeight};
            }
            // check if to recet the height in state
            if(this.state.style.height !== style.height) { /* wrong height, set a right one */
                this.setState({style: style});
            }
            //return style;
        }
    }

    checkBoxSelected(index, innerIndex) {
        this.props.checkBoxChange(index, innerIndex);
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
            if (this.props.toggleable && this.props.isOpen) {this.props.toggle();}
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
                            this.props.toggle();
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
                        this.props.toggle();
                    }
                }
                break;
            case 32: //Space
                this.checkBoxSelected(index, innerIndex);
                e.preventDefault();
                break;
            case 27://ESC
                if(this.props.toggleable){
                    this.setState({setFocusToIndex: 0, setFocusToInnerIndex: -1, openStateIndex:[]});
                    this.props.toggle();
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
                if(!this.props.toggleable && this.props.passFocusForward !== false) {this.props.passFocusForward(e)}
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
                                this.props.toggle();
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
                                            this.props.toggle();
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
        /*
        const setStyle = () => {
            if (this.props.toggleable === true){
                if(this.props.isOpen){return {"border":"1px solid #0099cc"}}
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
        } */

        return (
            <div
                className={this.className + ' ovfx-auto ovfx-hidden'}
                style={this.props.isOpen || !this.props.toggleable ? this.state.style : {"display":"none"}}
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
        )
    }
}
export default MultiDropDownList;