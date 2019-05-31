import React, { Component } from 'react'
import CloseUpSVG from '../svg/CloseUpSVG';
import CheckBoxSVG from '../svg/CheckBoxSVG';
import './Modal.css'
import ExclamationSVG from '../svg/ExclamationSVG';

class Alert extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.singleOkButtonRef = null;
        this.okButtonRef = null;
        this.cancelButtonRef = null;
        this.closeButtonRef = null;
        this.setFocusTo = null;
    }

    componentDidMount() {
        if (this.singleOkButtonRef !== null){
            this.setFocusTo = this.singleOkButtonRef;
        }
        else {
            if (this.cancelButtonRef !== null){
                this.setFocusTo = this.cancelButtonRef;
            }
            else {
                if (this.closeButtonRef !== null){
                    this.setFocusTo = this.closeButtonRef;
                }
            }
        }
        if (this.setFocusTo !== null){
            this.setFocusTo.focus();
        }
    }

    render() {
        return (
            <div>
                <div className='modal-shadow'></div>
                <div className = {this.props.mode ? 'modal-body ' + this.props.mode : 'modal-body'}>
                    <button 
                        ref = {el => this.closeButtonRef = el}
                        className='modal-close-button' 
                        onClick = {this.props.onClose}
                    >
                        <CloseUpSVG />
                    </button>
                    {this.props.mode === 'error' &&
                        <div className='modal-img-wrapper mb-1'>
                            <CloseUpSVG />
                        </div>
                    }
                    {this.props.mode === 'warning' &&
                        <div className='modal-img-wrapper mb-1'>
                            <ExclamationSVG />
                        </div>
                    }
                    {this.props.mode === 'success' &&
                        <div className='modal-img-wrapper mb-1'>
                            <CheckBoxSVG />
                        </div>
                    }
                    <div className = 'modal-content mb-1'>
                        {this.props.headerText && <h3>{this.props.headerText}</h3>}
                        {this.props.text && <p className='mt-05 alertText'>{this.props.text}</p>}
                    </div>
                    <div className = 'modal-content mb-1'>{this.props.children}</div>
                    {this.props.showOkButton &&
                        <button 
                            ref = {el => this.singleOkButtonRef = el}
                            className = 'medium-static-button static-button default-button' 
                            onClick = {this.props.onOkButtonClick} 
                            style={{"marginBottom":"0em"}}
                        >
                            {this.props.buttonText ? this.props.buttonText : "OK"}
                        </button>
                    }
                    {this.props.showOkCancelButtons &&
                        <div className='flex-nowrap' style={{"marginBottom":"-0.5em"}}>
                            <button 
                                ref = {el => this.okButtonRef = el}
                                className='regular-button medium-static-button static-button' 
                                onClick={this.props.onOkButtonClick}
                            >
                                    {this.props.okButtonText ? this.props.okButtonText : "OK"}
                            </button>
                            <button 
                                ref = {el => this.cancelButtonRef = el}
                                className='medium-static-button static-button default-button'
                                onClick={this.props.onCancelButtonClick}
                            >
                                {this.props.cancelButtonText ? this.props.cancelButtonText : "Cancel"}
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Alert
