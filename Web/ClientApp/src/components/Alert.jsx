import React, { Component } from 'react'
import CloseUpSVG from '../svg/CloseUpSVG';
import CheckBoxSVG from '../svg/CheckBoxSVG';
import './Modal.css'
import ExclamationSVG from '../svg/ExclamationSVG';

class Alert extends Component {

    render() {
        return (
            <div>
                <div className='modal-shadow'></div>
                <div className = {this.props.mode ? 'modal-body ' + this.props.mode : 'modal-body'}>
                    <button 
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
                    {this.props.headerText &&
                        <h3>{this.props.headerText}</h3>
                    }
                    <div className = 'mb-1'>{this.props.children}</div>
                    {this.props.showOkButton &&
                        <button 
                            ref = {el => this.buttonRef = el}
                            className = 'ok-button medium-static-button static-button default-button mt-1' 
                            onClick = {this.props.onClose} 
                        >
                            ok
                        </button>
                    }
                </div>
            </div>
        )
    }
}

export default Alert
