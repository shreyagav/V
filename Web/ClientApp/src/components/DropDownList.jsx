import React, { Component } from 'react';
import CheckBoxSVG from '../svg/CheckBoxSVG';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import { withDropDownStore } from './DropDownStore';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class DropDownList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openStateIndex: [],
        };
        this.lastOpenState = null;
        this.simpleBarRef = null;
        this.simpleBarWrapperRef = null;
        this.simpleBarHeight = '100%';
        this.openStateRef = null;
    }

    componentWillMount(){
        document.addEventListener('wheel', this.handleWheel, false);
        window.addEventListener("resize", () => this.setHeight());
    }

    componentDidMount(){
        this.setHeight();
    }

    componentDidUpdate(){
        this.setHeight();
        /* scroll last openned object into view */
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
        document.removeEventListener('wheel', this.handleWheel, false);
        window.removeEventListener("resize", () => this.setHeight());
    }

    setHeight(){
        if(this.simpleBarWrapperRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let top = this.simpleBarWrapperRef.getBoundingClientRect().top;
            let toBottom = windowHeight - top;
            if (this.props.toggleable) {
                this.simpleBarHeight = ((Math.floor((toBottom - 16)/45))*45-1).toString() + 'px';
            }
            else {
                this.simpleBarHeight = (Math.floor(toBottom)).toString() + 'px';
            }
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

    toggler(index) {
        let openStateIndex = this.state.openStateIndex;
        if (openStateIndex['_'+index.toString()] === true){
            delete openStateIndex['_'+index.toString()];
        }
        else { 
            openStateIndex['_'+index.toString()]=true;
            this.lastOpenState = index;
        }
        this.setState(()=>({openStateIndex: openStateIndex}));
    }

    setUpRef(el, index){
        if (this.lastOpenState === index) {this.openStateRef = el;}
    }

    render() { 
        return (
            <div ref={el => this.simpleBarWrapperRef=el}>
            <SimpleBar style={this.props.toggleable && !this.props.store.isOpen ? {"display":"none"} : {'height':this.simpleBarHeight}}>
            <ul className='drop-down-list' ref={el => this.simpleBarRef=el} style={{'height':this.simpleBarHeight}}>
                {this.props.store.modifiedList.map((element, index) =>
                {
                    let isOpen = (this.state.openStateIndex["_"+index.toString()] === true);
                    return(
                    <li key={index} className={isOpen ? 'openChapter' : ''}>
                        <div>
                            <label>
                                <input type="checkbox" checked={element.state.checked} onChange={() => this.props.store.onCheckBoxChange(index, -1)}/>
                                <CheckBoxSVG />
                            </label>
                            <button onClick={() => this.toggler(index)}>
                                <span>{element.state.name}</span>
                                <ArrowUpSVG svgClassName={isOpen ? 'flip90' : 'flip270'}/>
                            </button>
                        </div>
                        {isOpen && 
                            <ul className='drop-down-list' ref={(el) => this.setUpRef(el,index)}>
                                {element.chapters.map((el, innerIndex) =>
                                    <li key={el.name} className='openChapter'>
                                        <label>
                                            <input type="checkbox" checked={el.checked} onChange={() => this.props.store.onCheckBoxChange(index, innerIndex)}/>
                                            <CheckBoxSVG />
                                        </label>
                                        <span>{el.name}</span>
                                    </li>
                                )}
                            </ul>
                        }
                    </li>)}
                )}
            </ul>
            </SimpleBar>
            </div>
        )
    }
}
export default withDropDownStore(DropDownList);