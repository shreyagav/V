import React, { Component } from 'react'
import CloseUpSVG from '../svg/CloseUpSVG'
import SearchUpSVG from '../svg/SearchUpSVG'
import './SearchInput.css'

class SearchInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 10,
            style: {},
            inputOnFocus: false,
        };
        this.fakeInputRef = null;
        this.inputRef = null;
        this.wrapperRef = null;
        this.inputValue = null;
        this.inputPlaceholder = null; 
    }

    componentDidMount(){
        if(this.inputRef !== null){
            let inputStyle = window.getComputedStyle(this.inputRef);
            let newStyle = {}
            let keyArray = ['padding', 'margin', 'fontSize', 'fontWeight', 'textDecoration', 'textTransform', 'lineHeight', 'textOverflow']
            keyArray.forEach(key => {newStyle[key] = inputStyle[key]});
            this.setState({style: newStyle});
        }
    }

    componentDidUpdate(){
        if(this.fakeValueRef && this.fakeValueRef !== null){
            if(this.props.value === ''){
                this.fakeValueRef.classList.remove('hidden')
            } else {
                this.fakeValueRef.classList.add('hidden')
            }
        }
        if (this.props.dynamicWidth){
            let width = this.fakeInputRef.offsetWidth + 1;
            let inputLeft = this.inputRef.getBoundingClientRect().left;
            let wrapperRight = this.props.headerRef.getBoundingClientRect().right;
            let maxInputWidth;
            if(this.props.multiSelect === true){ 
                maxInputWidth = this.props.headerRef.offsetWidth - 10;
            } 
            else { maxInputWidth = wrapperRight - inputLeft }
            if(width >= maxInputWidth) { width = maxInputWidth }
            if (this.state.width !== width){
                this.setState({width: width});
            } 
        }
    }

    getPropperStyle(){
        let style = {};
        if(this.props.dynamicWidth){ style["width"] = Math.round(this.state.width) + 'px' }
        return style
    }

    setValue(){
        if(this.props.multiSelect === false){ // SINGLE value 
            if(this.props.dropDownValue !== null && this.props.dropDownValue !== ''){ // There is DropDown Value
                if(this.state.inputOnFocus === true){ // Input ON FOCUS
                    this.inputValue = this.props.value;
                    this.inputPlaceholder = this.props.dropDownValue;
                } else {
                    this.inputValue = this.props.dropDownValue;
                    //this.inputPlaceholder = "doesn't matter";
                }
            } else {
                this.inputValue = this.props.value;
                this.inputPlaceholder = this.props.placeholder;
            }
        } else {
            this.inputValue = this.props.value;
            this.inputPlaceholder = this.props.placeholder;
        }
    }

    onInputKeyDown(e){
        if(e.keyCode === 32 && !this.props.multiSelect){/* SPACE */ e.stopPropagation()}
        else {
            if(typeof(this.props.inputKeyDownHandler) === 'function') {
                this.props.inputKeyDownHandler(e);
            }
        }
    }

    render() {
        const style = this.getPropperStyle();
        this.setValue();
        return (
            <div ref={el => this.wrapperRef = el}
                className={this.props.wrapperClassName ? 'search-wrapper input-button-wrapper ' + this.props.wrapperClassName : 'search-wrapper input-button-wrapper'}
                style = { this.props.dynamicWidth ? {"width": "100%", "position": "relative"} : {"position": "relative"}}
                onClick={e => {
                    this.inputRef.focus();
                    /*if(typeof(this.props.onWrapperClick) == "function" ){
                        if(this.fakeValueRef && this.fakeValueRef !== null) {this.fakeValueRef.classList.add('opacity05')}
                        this.props.onWrapperClick(e)
                    }*/
                }}
            >
                {this.props.dynamicWidth &&
                    <span className='fake-input hidden'
                        style={this.state.style}
                        ref={el => this.fakeInputRef = el}
                    >
                        {this.props.value.length > 0 ? this.props.value : this.props.placeholder}
                    </span>
                }
                {this.props.dynamicWidth && !this.props.multiSelect &&
                    <input 
                        ref={el => {
                            this.fakeValueRef = el;
                            if (this.props.setFakeValueRef) {this.props.setFakeValueRef(el)}; 
                        }}
                        className = 'search-input fake-input'
                        style={style}
                        value={this.props.dropDownValue}
                        placeholder={this.props.placeholder}
                        disabled
                    />
                }
                <input 
                    ref={el => { this.inputRef = el; if (this.props.setInputRef) {this.props.setInputRef(el)}}}
                    className = {this.props.dynamicWidth ? 'search-input' : 'search-input pl25'}
                    style={style}
                    value={this.props.value}
                    placeholder={!this.props.dynamicWidth ? this.inputPlaceholder : ''}
                    onChange={(e) => this.props.onValueChange(e.target.value)}
                    autoComplete={this.props.autocompleteOff === true ? 'nope' : 'on' }
                    onKeyDown={(e) => this.onInputKeyDown(e)}
                    onClick={this.props.onInputClick && this.props.onInputClick}
                    onFocus={() => {
                        if(this.fakeValueRef && this.fakeValueRef !== null) { this.fakeValueRef.classList.add('opacity05') }
                        if(this.props.toggle) { this.props.toggle() }
                    }}
                    onBlur={() => {if(this.fakeValueRef && this.fakeValueRef !== null) { this.fakeValueRef.classList.remove('opacity05') }}}
                />
                {!this.props.dynamicWidth && <SearchUpSVG svgClassName='icon'/>}
                {!this.props.dynamicWidth && this.props.value.length > 0 &&
                <button onClick={(e) => this.props.onClearValueButtonClick(e)}>
                    <CloseUpSVG />
                </button>
                }
            </div>
        );
    }
}

export default SearchInput;