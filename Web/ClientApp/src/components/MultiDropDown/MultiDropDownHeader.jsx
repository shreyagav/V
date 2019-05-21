import React, { Component } from 'react';
import ArrowUpSVG from '../../svg/ArrowUpSVG';
import { withMultiDropDownStore } from './MultiDropDownStore';
import CloseSVG from '../../svg/CloseSVG';

class MultiDropDownHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.headerRef = null;
        this.dropDownHeaderRef = null;
    }

    componentWillMount() {
        this.props.multiDropDownStore.set("value", this.props.defaultValue);
    }

    componentDidMount(){
        this.props.multiDropDownStore.set('dropDownHeaderRef', this.dropDownHeaderRef);
    }

    headerClickHandler(e) {
        if (e.target === this.headerRef){
            this.props.multiDropDownStore.toggle();
        }
    }

    headerKeyDownHandler(e, element){
        switch (e.keyCode){
            case 13: //enter
                if(e.target.className === 'unselectButton'){this.props.multiDropDownStore.unselect(e, element);}
                if(e.target.className === 'drop-down-header'){this.props.multiDropDownStore.toggle();}
                this.dropDownHeaderRef.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.props.multiDropDownStore.toggle();
                    this.dropDownHeaderRef.focus();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.props.multiDropDownStore.toggle();}
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.props.multiDropDownStore.toggle();}
                break;
            default: break;
        }
    }

    createList() {
        let modifiedList = this.props.multiDropDownStore.modifiedList;
        let value = this.props.multiDropDownStore.value;
        let multiSelect = this.props.multiDropDownStore.multiSelect;
        let expandBy = this.props.multiDropDownStore.expandBy;
        let keyProperty = this.props.multiDropDownStore.keyProperty;
        let textProperty = this.props.multiDropDownStore.textProperty;
        let expandedMultiSelect = this.props.multiDropDownStore.expandedMultiSelect;
        let expandedKeyProperty = this.props.multiDropDownStore.expandedKeyProperty;
        let expandedTextProperty = this.props.multiDropDownStore.expandedTextProperty;
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

    render() {
        const setStyle = () => {
            if (this.props.toggleable === true){
                if(this.props.multiDropDownStore.isOpen){return {"border":"1px solid #0099cc"}}
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
            <div
                ref={el => this.dropDownHeaderRef = el}
                tabIndex={this.props.toggleable ? '0':'-1'} 
                className='drop-down-header'
                style={style}
                onClick={() => this.props.multiDropDownStore.toggle()}
                onKeyDown={(e) => this.headerKeyDownHandler(e)}
            >
                <ul 
                    ref={e => this.headerRef = e} 
                    onClick={(e) => this.headerClickHandler(e)}
                    className={(this.props.multiDropDownStore.multiSelect || this.props.multiDropDownStore.expandedMultiSelect) ? "multi-level-list" : "simple-list"}
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
                                    element.childElement[this.props.multiDropDownStore.expandedTextProperty] + ', ' + element.parentElement[this.props.multiDropDownStore.textProperty]
                                    :
                                    element.parentElement[this.props.multiDropDownStore.textProperty]
                                }</span>
                                {(this.props.multiDropDownStore.multiSelect || this.props.multiDropDownStore.expendedMultiSelect) &&
                                    <button className='unselectButton'
                                        onClick={(e) => this.props.multiDropDownStore.unselect(e, element)}
                                        onKeyDown={(e) => this.headerKeyDownHandler(e, element)}
                                    >
                                        <CloseSVG />
                                    </button>
                                }
                            </li>
                            }
                        )}
                        {list.length === 0 &&
                            <li className={(this.props.multiDropDownStore.multiSelect || this.props.multiDropDownStore.expendedMultiSelect)? 'inverted' :'placeholder'}>
                                <span>{this.props.multiDropDownStore.placeholder}</span>
                            </li>
                        }
                </ul>
                {this.props.toggleable &&
                    <button disabled className='arrow-button' >
                        <ArrowUpSVG svgClassName={this.props.multiDropDownStore.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                }
            </div>
        )
    }
}
export default withMultiDropDownStore(MultiDropDownHeader);