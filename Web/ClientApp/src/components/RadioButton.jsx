import React, { Component } from 'react';
import RadioBoxSVG from '../svg/RadioBoxSVG';

class RadioButton extends Component {

    render() {
        return (
            <div 
                tabIndex={0} 
                style = {this.props.style}
                className = {this.props.className ? this.props.className + ' checkBox-wrapper' : 'checkBox-wrapper'}
                onClick = {() => {
                    //let radioGroupElement = this.props.radioGroupElement;
                    //Object.keys(radioGroupElement).forEach(element => {
                    //    radioGroupElement[element] = false
                    //});
                    //radioGroupElement[this.props.radioButtonValue] = true;
                    //this.props.onClick(radioGroupElement);
                    this.props.onClick(this.props.radioButtonValue);
                }}
                onKeyDown={(e) => {
                    if(e.keyCode === 32){
                        /* SPACE BAR */ 
                        //let radioGroupElement = this.props.radioGroupElement;
                        //Object.keys(radioGroupElement).forEach(element => {
                        //    radioGroupElement[element] = false
                        //});
                        //radioGroupElement[this.props.radioButtonValue] = true;
                        //this.props.onClick(radioGroupElement);
                        this.props.onClick(this.props.radioButtonValue);
                        e.preventDefault();
                }}}
            >
                <label className='radio'>
                    <input type="radio" disabled checked={this.props.radioButtonValue === this.props.radioGroupElement}/>
                    <RadioBoxSVG />
                </label>
                <span className = {this.props.labelClassName}>{this.props.labelText}</span>
            </div>
        );
    }
}

export default RadioButton;