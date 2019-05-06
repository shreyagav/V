import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import EditUpSVG from '../svg/EditUpSVG';

class EditContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contactIsOpen: false,
            contactName: '',
            contactPhone: '',
            contactEmail: '',
        };
        this.nameInputRef = null;
        this.phoneInputRef = null;
        this.emailInputRef = null;
    }

    toggle(){
        this.setState({contactIsOpen: !this.state.contactIsOpen});
    }

    setValue(key, value){
        const state = this.state;
        state[key] = value;
        this.setState(state);
    }

    keyDownHandler(e) {
        switch (e.keyCode) {
            case 13: {
                //enter
                this.toggle();
                break;
            }
            case 27: {
                //esc
                if (this.state.contactIsOpen) {
                    this.toggle();
                }
                break;
            }
        }
    }

    inputKeyDownHandler(e) {
        if (e.shiftKey && e.keyCode == 9 && this.nameInputRef.contains(e.target)) {
            this.toggle();
        }
        if (!e.shiftKey && e.keyCode === 9 && this.emailInputRef.contains(e.target)) {
            this.toggle();
        }
    }

    render() {
        return (
            <li>
                <p>{this.props.header}</p>
                <div className='flex-nowrap flex-flow-column'>
                    <div 
                        tabIndex='0' 
                        className='drop-down-header flex-nowrap align-center'
                        style={this.state.contactIsOpen ? {"borderColor":"#0099cc", "height":"auto", "minHeight":"2.5em"} : {"height":"auto", "minHeight":"2.5em"}}
                        onClick={() => this.toggle()}
                        onKeyDown={(e) => this.keyDownHandler(e)}
                    >
                        <span className='flex11auto pl-025 pt-05 pb-05'>
                            {this.state.contactName !== "" ? <strong className='regular-p pb-05'>{this.state.contactName + ', '}</strong>:''}
                            <p className='regular-p pb-05'>{(this.state.contactPhone !== '' ? (this.state.contactPhone + ', ') : "") + this.state.contactEmail}</p>
                        </span>
                        <button disabled className='arrow-button' >
                            {this.state.contactIsOpen ? <ArrowUpSVG svgClassName='flip90'/> : <EditUpSVG />}
                        </button>
                    </div>
                    {this.state.contactIsOpen && 
                        <ul className='input-fields first-child-text-60 p-1' style={{"border": "1px solid #0099cc", "borderTop":"0px solid #0099cc"}}>
                            <li>
                                <p>Name:</p>
                                <input 
                                    ref={el => this.nameInputRef = el} 
                                    value={this.state.contactName} 
                                    type='text' 
                                    placeholder='' 
                                    onChange={(e) => this.setValue("contactName", e.target.value)}
                                    onKeyDown={(e) => this.inputKeyDownHandler(e)}
                                ></input>
                            </li>
                            <li>
                                <p>Phone:</p>
                                <input 
                                    ref={el => this.phoneInputRef = el} 
                                    value={this.state.contactPhone} 
                                    type='text' placeholder='' 
                                    onChange={(e) => this.setValue("contactPhone", e.target.value)}></input>
                            </li>
                            <li>
                                <p>Email:</p>
                                <input 
                                    ref={el => this.emailInputRef = el} 
                                    value={this.state.contactEmail}
                                    type='text' placeholder=''
                                    onChange={(e) => this.setValue("contactEmail", e.target.value)}
                                    onKeyDown={(e) => this.inputKeyDownHandler(e)}
                                ></input>
                            </li>
                        </ul>
                    }
                </div>
            </li>
        );
    }
}

export default EditContact;