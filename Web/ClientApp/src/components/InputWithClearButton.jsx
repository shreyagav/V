import React, { Component } from 'react'
import CloseUpSVG from '../svg/CloseUpSVG'

class InputWithClearButton extends Component {

    constructor(props) {
        super(props);
        
        this.inputRef = null;
    }

    render() {
        return (
            <div className='input-button-wrapper'>
                <input 
                    ref = {el => this.inputRef = el}
                    type={this.props.type}
                    placeholder={this.props.placeholder}
                    value = {this.props.value}
                    onChange={(e) => this.props.onChange(e)}
                />
                {this.props.value.length > 0 &&
                    <button onClick={() => {
                        this.props.onClearValue();
                        this.inputRef.focus();
                    }}>
                        <CloseUpSVG />
                    </button>
                }
            </div>
        );
    }
}

export default InputWithClearButton;