import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import EditUpSVG from '../svg/EditUpSVG';

class EditContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contactIsOpen: false,
        };
    }

    toggle(){
        this.setState({contactIsOpen: !this.state.contactIsOpen});
    }

    keyDownHandler(e) {
        switch (e.keyCode) {
            case 13: {
                /* ENTER */
                this.toggle();
                break;
            }
            case 27: {
                /* ESC */
                if (this.state.contactIsOpen) {this.toggle();}
                break;
            }
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
                        <span className='flex11auto pl-5 pt-05 pb-05 '>
                            {this.props.value.name !== "" ? <strong className='regular-p'>{this.props.value.name}</strong>:''}
                            {this.props.value.name !== "" && (this.props.value.phone !== '' || this.props.value.email !== '') && <strong className='regular-p'>{', '}</strong>}
                            <p className='regular-p' style={{"fontSize":"0.9rem"}}>{this.props.value.phone !== '' && this.props.value.phone}</p>
                            {this.props.value.phone !== '' && this.props.value.email !== '' && <p className='regular-p' style={{"fontSize":"0.9rem"}}>{', '}</p>}
                            <p className='regular-p' style={{"fontSize":"0.9rem"}}>{this.props.value.email !== '' && this.props.value.email}</p>
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
                                    value={this.props.value.name} 
                                    type='text' 
                                    placeholder='Name' 
                                    onChange={(e) => {
                                        let value = this.props.value;
                                        value.name = e.target.value;
                                        this.props.onValueChange(value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.shiftKey && e.keyCode === 9) {this.toggle();}
                                    }}
                                />
                            </li>
                            <li>
                                <p>Phone:</p>
                                <input 
                                    value={this.props.value.phone}
                                    type='text' placeholder='Phone'
                                    onChange={(e) => {
                                        let value = this.props.value;
                                        value.phone = e.target.value;
                                        this.props.onValueChange(value);
                                    }}
                                />
                            </li>
                            <li>
                                <p>Email:</p>
                                <input 
                                    value={this.props.value.email}
                                    type='text' placeholder='Email'
                                    onChange={(e) => {
                                        let value = this.props.value;
                                        value.email = e.target.value;
                                        this.props.onValueChange(value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (!e.shiftKey && e.keyCode === 9) {this.toggle()}
                                    }}
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