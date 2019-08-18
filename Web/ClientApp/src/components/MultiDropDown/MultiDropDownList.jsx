import React, { Component } from 'react';
import './MultiDropDown.css'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { combineReducers } from 'redux';
import VirtualList from 'react-tiny-virtual-list';
import CheckBoxSquareSVG from '../../svg/CheckBoxSquareSVG';
import CheckBoxSVG from '../../svg/CheckBoxSVG';
import ArrowUpSVG from '../../svg/ArrowUpSVG';

class MultiDropDownList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            style: {},
        };

        this.lastOpenState = null;
        this.simpleBarRef = null;
        this.simpleBarHeight = '100%';
        this.opensDown = true;
        this.openStateRef = null;
        this.simpleList = false;
        this.onFocusRef = null; // parent also needs onFocusRef!!!!
        this.className = '';
        this.setHeight = this.setHeight.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
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
    }

    componentDidUpdate(){
        this.setHeight();
        if(this.props.toggleable && this.props.isOpen || !this.props.toggleable && this.props.isActive) {
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
    }

    componentWillUnmount(){
        if(this.props.toggleable){
            document.removeEventListener('wheel', this.handleWheel, {passive : false});
            document.removeEventListener("mousedown", this.handleClick, false);
        }
        window.removeEventListener("resize", this.setHeight);
    }

    handleClick(e) {
        if(!(this.props.dropDownHeaderRef.contains(e.target) || this.props.simpleBarWrapperRef.contains(e.target))){ 
            this.props.toggle() 
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
        if(this.onFocusRef !== null){
            var list = this.simpleBarRef;
            var parentTop = list.parentElement.getBoundingClientRect().top;
            //var top = list.getBoundingClientRect().top;
            var elem = this.onFocusRef;
            var elemTop = elem.getBoundingClientRect().top;
            var elemBottom = elem.getBoundingClientRect().bottom;
            var parentBottom = list.parentElement.getBoundingClientRect().bottom;
            if(parentTop > elemTop){
                list.parentElement.scrollTop = list.parentElement.scrollTop - (parentTop - elemTop);
            }
            if(elemBottom > parentBottom){
                list.parentElement.scrollTop = elemBottom - parentBottom + list.parentElement.scrollTop;
            }
            elem.classList.add("onFocus");
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
            let openStateIndex = Object.keys(this.props.openStateIndex);
            openStateIndex.forEach(element => {  
                let ind = parseInt(element.slice(1));
                coeff = coeff + this.props.list[ind][this.props.expandBy].length;
            })
            let xxx = this.simpleBarRef.offsetHeight;
            let regularHeight = 45*(this.props.list.length + coeff);
            if(regularHeight === 0) {regularHeight = 45 + coeff;}
            let simpleBarHeight = 0;
            if (this.props.toggleable) {
                if (toTop > toBottom){ //* OPENS UP *//
                    this.opensDown = false;
                    simpleBarHeight = Math.floor(toTop);
                    //simpleBarHeight = (Math.floor(toTop/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    style = {"height":this.simpleBarHeight, "bottom":(dropDownHeaderHeight).toString()+'px', "marginBottom":"-2px", "boxShadow": "0em -1em 2em #ffffff, 0em -0.25em 0.25em rgba(0, 0, 0, 0.19)"};
                }
                else { /* OPENS DOWN */
                    this.opensDown = true;
                    simpleBarHeight = Math.floor(toBottom);
                    //simpleBarHeight = (Math.floor(toBottom/45))*45-1;
                    if (simpleBarHeight > regularHeight && regularHeight > 0) {simpleBarHeight = regularHeight;}
                    this.simpleBarHeight = (simpleBarHeight).toString() + 'px';
                    this.className = "drop-down-list-wrapper";
                    style = {"height":this.simpleBarHeight, "top": "0px", "marginTop":"-2px", "boxShadow": "0em 1em 2em #ffffff, 0em 0.25em 0.25em rgba(0, 0, 0, 0.19)"};
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

    renderListItem(element, index, style){
        let checked = this.checkIfCheckboxChecked(index);
        let isOpen = (this.props.openStateIndex["_"+index.toString()] === true);
        return(
            <li key={index} className={isOpen ? 'openChapter' : ''} style={style} >
                <div
                    ref={el => {
                        if(index === this.props.setFocusToIndex){
                        this.props.setFocusToRef(el);
                        this.onFocusRef = el;
                    }}}
                >
                    {this.props.multiSelect && this.props.expandBy &&
                        <label>
                            <input 
                                tabIndex={-1}
                                type="checkbox" 
                                checked={(checked === true || checked === 1 || checked === 0) ? true : false}
                                onChange={() => {
                                    this.props.checkBoxChange(index, -1); 
                                    this.props.setToState({
                                        setFocusToIndex: index, 
                                        setFocusToInnerIndex: -1
                                    }, this.props.returnFocusToParent());
                                }} 
                            />
                            {(checked === true || checked === 1 || checked === -1) ? <CheckBoxSVG /> : <CheckBoxSquareSVG />}
                        </label>
                    }
                    <button 
                        tabIndex={-1}
                        onClick={() => {
                            if (this.props.expandBy) {
                                this.props.toggler(index, true);
                                this.lastOpenState = index;
                            }
                            else {
                                if(!this.props.multiSelect){
                                    //this.setState(() => ({value: element[this.props.keyProperty]}));
                                    this.props.onDropDownValueChange(element[this.props.keyProperty]);
                                    this.props.toggle();
                                }
                                else {
                                    this.props.checkBoxChange(index, -1); 
                                    this.props.setToState({setFocusToIndex: index, setFocusToInnerIndex: -1}); 
                                }
                            }
                            this.props.returnFocusToParent();
                        }}
                    >
                        {this.props.multiSelect && !this.props.expandBy &&
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={(checked === true || checked === 1 || checked === 0) ? true : false}
                                    disabled
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
                    <ul className='drop-down-list' ref={(el) => {if(index === this.lastOpenState){this.openStateRef = el}}}>
                        {element[this.props.expandBy].map((el, innerIndex) =>
                            <li key={innerIndex} className='openChapter'>
                                <div ref={el => {
                                        if(index === this.props.setFocusToIndex && innerIndex === this.props.setFocusToInnerIndex){
                                            this.props.setFocusToRef(el);
                                            this.onFocusRef = el;
                                        }}}
                                >
                                    <button 
                                        tabIndex={-1}
                                        onClick={() => {
                                            if(this.props.expandedMultiSelect) {
                                                this.props.checkBoxChange(index, innerIndex);
                                                this.props.setToState({setFocusToIndex: index, setFocusToInnerIndex: -1});
                                            }
                                            else {
                                                this.props.onDropDownValueChange(el[this.props.expandedKeyProperty]);
                                                this.props.toggle();
                                            }
                                            this.props.returnFocusToParent();
                                        }}
                                    >
                                        {this.props.expandedMultiSelect && 
                                            <label>
                                                <input 
                                                    type="checkbox" disabled
                                                    checked={this.checkIfInnerCheckboxChecked(index, innerIndex) ? true : false}
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
        return (
            <div
                ref={ el => this.xxx = el}
                className={this.className + ' ovfx-auto ovfx-hidden'}
                style={this.props.isOpen || !this.props.toggleable ? this.state.style : {"display":"none"}}
            >
                {/*<SimpleBar>*/}
                <div style={{"height": "100%"}} data-simplebar >
                <ul className='drop-down-list' 
                    ref={ el => this.simpleBarRef = el} 
                    /*style={{'height':this.simpleBarHeight}} */
                >   
                    {this.props.list.length === 0 
                        ?
                        <li style={{"alignItems": "center"}}>
                            <div className = 'notes ws-nowrap'>{"No results found"}</div>
                        </li>
                        :
                        (this.props.expandBy || this.props.list.length < 100 
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
                        )
                    }
                </ul>
                </div>
                {/*</SimpleBar>*/}
            </div>
        )
    }
}
export default MultiDropDownList;