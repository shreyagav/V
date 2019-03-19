import React, { Component } from 'react';
import CheckBoxSVG from '../svg/CheckBoxSVG';
import ArrowUpSVG from '../svg/ArrowUpSVG';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

class ChapterList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            openStateIndex: [],
            chapterList: [],
        };
        this.lastOpenState = null;
        this.simpleBarRef = null;
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

    componentWillReceiveProps(props){
        this.setState(() => ({chapterList: props.chapterList}));
    }

    componentWillUnmount(){
        document.removeEventListener('wheel', this.handleWheel, false);
        window.removeEventListener("resize", () => this.setHeight());
    }

    setHeight(){
        if(this.simpleBarRef !== null){
            let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let top = this.simpleBarRef.getBoundingClientRect().top;
            let toBottom = windowHeight - top;
            this.simpleBarHeight = toBottom.toString() + 'px';
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

    onStateCheckBoxChecked(index){
        let chapterList = this.state.chapterList;
        chapterList[index].state.checked = !chapterList[index].state.checked;
        if(chapterList[index].state.checked) {
            chapterList[index].chapters.forEach(element => {
                element.checked = true;
            });
        }
        else {
            chapterList[index].chapters.forEach(element => element.checked = false)
        }
        this.setState(()=>({chapterList: chapterList}));
    }

    onChapterCheckBoxChecked(index, innerIndex){
        debugger;
        let chapterList = this.state.chapterList;
        chapterList[index].chapters[innerIndex].checked = !chapterList[index].chapters[innerIndex].checked;
        if(!chapterList[index].chapters[innerIndex].checked && chapterList[index].state.checked){
            chapterList[index].state.checked = false;
        }
        if(chapterList[index].chapters[innerIndex].checked){
            if(chapterList[index].chapters.length === 1){
                chapterList[index].state.checked = true;
            }
            else {
                let marker = true;
                for(let i=0; i<chapterList[index].chapters.length; i++){
                    if (!chapterList[index].chapters[i].checked) {
                        marker = false;
                    }
                }
                if(marker) {
                    chapterList[index].state.checked = true;
                }
            }
        }
        this.setState(()=>({chapterList: chapterList}));
    }

    setUpRef(el, index){
        if (this.lastOpenState === index) {this.openStateRef = el;}
    }

    render() { 
        return (
            <SimpleBar style={{'height':this.simpleBarHeight}}>
            <ul className='list-of-chapters' ref={el => this.simpleBarRef=el} style={{'height':this.simpleBarHeight}}>
                {this.state.chapterList.map((element, index) =>
                {
                    let isOpen = (this.state.openStateIndex["_"+index.toString()] === true);
                    return(
                    <li key={index} className={isOpen ? 'openChapter' : ''}>
                        <div>
                            <label>
                                <input type="checkbox" checked={element.state.checked} onChange={() => this.onStateCheckBoxChecked(index)}/>
                                <CheckBoxSVG />
                            </label>
                            <button onClick={() => this.toggler(index)}>
                                <span>{element.state.name}</span>
                                <ArrowUpSVG svgClassName={isOpen ? 'flip90' : 'flip270'}/>
                            </button>
                        </div>
                        {isOpen && 
                            <ul className='list-of-chapters' ref={(el) => this.setUpRef(el,index)}>
                                {element.chapters.map((el, innerIndex) =>
                                    <li key={el.name} className='openChapter'>
                                        <label>
                                            <input type="checkbox" checked={el.checked} onChange={() => this.onChapterCheckBoxChecked(index, innerIndex)}/>
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
        )
    }
}
export default ChapterList;