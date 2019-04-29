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
        let expandedKeyProperty = this.props.multiDropDownStore.expandedKeyProperty;
        let expandedTextProperty = this.props.multiDropDownStore.expandedTextProperty;
        let headerList = [];
        if(expandBy){
            //2 level array
            for(var i=0; i < modifiedList.length; i++){
                var modifiedListElement = modifiedList[i];
                if (modifiedListElement.checked === 1 || modifiedListElement.checked === true) {
                    headerList.push({"textProperty": modifiedListElement[textProperty], "element":modifiedListElement});
                }
                else {
                    let innerArray = modifiedListElement[expandBy];
                    for (let j=0; j < innerArray.length; j++){
                        let innerArrayElement = innerArray[j];
                        if (innerArrayElement.checked){
                            headerList.push({"textProperty": (innerArrayElement[expandedTextProperty] + ', ' + modifiedListElement[textProperty]), "element":modifiedListElement});
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
                        headerList.push({"textProperty": modifiedListElement[textProperty], "element":modifiedListElement});
                    }
                }
            }
            //1 level 1 value
            else {
                for(var i=0; i < modifiedList.length; i++){
                    var modifiedListElement = modifiedList[i];
                    if (modifiedListElement[keyProperty] === value){
                        headerList.push({"textProperty": modifiedListElement[textProperty], "element":modifiedListElement});
                    }
                }
            }
        }
        return headerList;
    }

    render() {
        const setStyle = () => {
            if (this.props.toggleable){
                if(this.props.multiDropDownStore.isOpen){return {"border":"1px solid #0099cc"}}
            }
            else return {"border":"0px solid"}
        }
        let style = setStyle();
        const list = this.createList();
        console.log("LIST");
        console.log(list);
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
                            return <li key={index}>
                                {element["element"].color && 
                                    <span 
                                        className='colorIndicator'
                                        style={{"backgroundColor": element["element"].color, "marginRight":"0.5rem"}}>
                                    </span>
                                }
                                {element["element"].img && <span className='drop-down-icon'>{element["element"].img}</span>}
                                <span>{element["textProperty"]}</span>
                                {(this.props.multiDropDownStore.multiSelect || this.props.multiDropDownStore.expendedMultiSelect) &&
                                    <button className='unselectButton'
                                        onClick={(e) => this.props.multiDropDownStore.unselect(e, element["element"])}
                                        onKeyDown={(e) => this.headerKeyDownHandler(e, element["element"])}
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