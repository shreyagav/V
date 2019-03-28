import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import './DropDown.css'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import ReportsSVG from '../svg/ReportsSVG';

class DropDownSimple extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: {},
            setFocusTo: 0,
            isOpen: false,
        };
        this.list = null;
        this.modifiedList = null;
        this.simpleBarWrapperRef = null;
        this.simpleBarRef = null;
        this.simpleBarHeight = '100%';
        this.onFocusRef=null;
        this.dropDownSimpleRef = null;
        this.dropDownHeader = null;
        this.toggle = this.toggle.bind(this);
    }

    componentWillMount(){
        this.setState({value: this.props.defaultValue[0]});
        this.list = this.props.list;
        this.modifiedList = this.modifyList(this.props.list, this.props.defaultValue[0]);
        document.addEventListener('wheel', this.handleWheel, false);
        window.addEventListener("resize", () => this.setHeight());
    }

    componentDidMount() {
        this.setHeight();
        this.setFocus();
    }

    componentDidUpdate(){
        this.setHeight();
        this.modifiedList = this.modifyList(this.list, this.state.value);
        this.setFocus();
    }

    componentWillUnmount(){
        document.removeEventListener('wheel', this.handleWheel, false);
        window.removeEventListener("resize", () => this.setHeight());
    }

    setFocus(){
        if(this.state.isOpen && this.onFocusRef !==null){
            this.onFocusRef.focus();
        }
    }

    modifyList(list, defaultValue) {
        let newList = list.filter(element => {return element.value !== defaultValue.value});
        return newList;
    }

    toggle() {
        this.setState(() => ({isOpen: !this.state.isOpen, setFocusTo: 0}));
    }

    setHeight(){
        if(this.simpleBarWrapperRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
            let toBottom = windowHeight - top;
            let simpleBarHeight = ((Math.floor((toBottom - 16)/45))*45-1);
            let regularHeight = 45*this.modifiedList.length;
            if (simpleBarHeight > regularHeight) {
                simpleBarHeight = regularHeight;
            }
            this.simpleBarHeight = simpleBarHeight.toString() + 'px';
        }
    }

    handleWheel = (e) => {
        if (!this.simpleBarRef.contains(e.target)) {return;}
        var cancelScrollEvent = function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            e.returnValue = false;
            return false;
        };
        this.hoverAllowed = true;
        var elem = this.simpleBarRef;
        var wheelDelta = e.deltaY;
        var height = elem.clientHeight;
        var scrollHeight = elem.scrollHeight;
        var parentTop = this.simpleBarRef.parentElement.getBoundingClientRect().top;
        var top = this.simpleBarRef.getBoundingClientRect().top;
        var scrollTop = parentTop - top;
        var isDeltaPositive = wheelDelta > 0;
        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            elem.scrollTop = scrollHeight;
            return cancelScrollEvent(e);
        }
        else {
            if (!isDeltaPositive && -wheelDelta > scrollTop) {
                elem.scrollTop = 0;
                return cancelScrollEvent(e);
            }
        }
    }

    listKeyDownHandler(e, index, element){
        switch (e.keyCode){
            case 9: // tab on last element => return focus to header
                e.preventDefault();
                this.toggle();
                this.dropDownHeader.focus();
                break;
            case 13: //enter 
                this.setState({value: element});
                this.toggle();
                this.dropDownHeader.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.toggle();
                    this.dropDownHeader.focus();
                }
                break;
            case 32: //Space
                e.preventDefault();
                break;
              //case 39: // Right Arrow
                //break;
              //case 37: //Left arrow
                //break;
            case 38: //Up Arrow
                e.preventDefault();
                if (index > 0){
                    this.setState({setFocusTo: index-1});
                }
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if (index < this.modifiedList.length-1){
                    this.setState({setFocusTo: index+1});
                }
                break;
            default: break;
        }
    }

    headerKeyDownHandler(e){
        switch (e.keyCode){
            case 13: //enter
                this.toggle();
                this.dropDownHeader.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.toggle();
                    this.dropDownHeader.focus();
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

    render() {
        return (
            <div 
                className='drop-down' 
                ref={el => this.dropDownSimpleRef = el} 
            >
                <div
                    ref = {el => this.dropDownHeader = el}
                    tabIndex='0'
                    className='drop-down-header' 
                    onClick={this.toggle}
                    onKeyDown={(e) => this.headerKeyDownHandler(e)}
                    style={this.state.isOpen ? {"border":"1px solid #0099cc"} : {}}
                >
                    <div className='flex-nowrap align-center justify-left'>
                        {this.state.value.color !== undefined && <span className='colorIndicator' style={{"backgroundColor":this.state.value.color, "marginRight":"0.5rem"}}></span>}
                        <span>{this.state.value.value}</span>
                    </div>
                    <button disabled className='drop-down-header-button' >
                        <ArrowUpSVG svgClassName={this.state.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                </div>
                <div 
                    ref={el => this.simpleBarWrapperRef = el}
                    style={this.state.isOpen ? {"border":"1px solid #0099cc", "borderTop":"0px solid #666666"} : {}}
                >
                    <SimpleBar style={!this.state.isOpen ? {"display":"none"} : {'height':this.simpleBarHeight}}>
                        <ul className='drop-down-list' ref={el => this.simpleBarRef=el} style={{'height':this.simpleBarHeight}}>
                            {this.modifiedList.map((element, index) => 
                                <li 
                                    ref={(el) => {if(this.state.setFocusTo === index) {this.onFocusRef = el}}}
                                    key={index} 
                                    tabIndex='0'
                                    onClick={() => {this.setState({value: element}); this.toggle();}}
                                    onKeyDown={(e) => this.listKeyDownHandler(e, index, element)}
                                >
                                    <div className='flex-nowrap align-center justify-left'>
                                        {element.color !== undefined && <span className='colorIndicator' style={{"backgroundColor":element.color, "marginRight":"0.5rem"}}></span>}
                                        <span>{element.value}</span>
                                    </div>
                                </li>)
                            }
                        </ul>
                    </SimpleBar>
                </div>
            </div>
        )
    }
}
export default DropDownSimple;