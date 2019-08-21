import React, { Component } from 'react';
import { withStore } from './store';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import EditUpSVG from '../svg/EditUpSVG';

class EditContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contactIsOpen: false,
        };
    }

    componentDidUpdate(){
        if(!this.props.isFormValid(this.props.validators, this.props.value) && !this.state.contactIsOpen){
            this.setState({contactIsOpen: true})
        }
    }

    toggle(){
        if(this.state.contactIsOpen) {
            if(this.props.isFormValid(this.props.validators, this.props.value)){
                this.setState({contactIsOpen: !this.state.contactIsOpen})
            } else {this.props.showError()}
        } else this.setState({contactIsOpen: !this.state.contactIsOpen});
    }

    keyDownHandler(e) {
        switch (e.keyCode) {
            case 13: { /* ENTER */
                this.toggle();
                break;
            }
            case 27: { /* ESC */
                if (this.state.contactIsOpen) {this.toggle()}
                break;
            }
            default: break;
        }
    }

    renderName(){
        if(this.props.value.name) {
            let str1 = this.props.value.name;
            let str2 = '';
            if(this.props.value.phone || this.props.value.email) {str2 = ','}
            return <p className='regular-p'><strong>{str1 + str2}</strong></p>
        }
    }

    renderPhone(){
        if(this.props.value.phone) {
            let str1 = this.props.value.phone;
            let str2 = '';
            if(this.props.value.email) {str2 = ','}
            return <p className='regular-p' style={{"fontSize":"0.9rem"}}>{str1 + str2}</p>
        }
    }

    renderEmail(){
        if(this.props.value.email) return <p className='regular-p' style={{"fontSize":"0.9rem"}}>{this.props.value.email}</p> 
    }

    render() {
        const name = this.renderName();
        const phone = this.renderPhone();
        const email = this.renderEmail();
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
                        <div className='flex11auto pl-05 pt-05 pb-05 '>
                            {name && name}
                            <span className='flex-wrap'>
                                {phone && phone}
                                {email && email}
                            </span>
                        </div>
                        <button disabled className='arrow-button' >
                            {this.state.contactIsOpen ? <ArrowUpSVG svgClassName='flip90'/> : <EditUpSVG />}
                        </button>
                    </div>
                    {this.state.contactIsOpen && 
                        <ul className='input-fields first-child-text-60 p-1' style={{"border": "1px solid #0099cc", "borderTop":"0px solid #0099cc"}}>
                            <li>
                                <p>Name:</p>
                                <div className={this.props.store.checkIfShowError('name', this.props.validators) ? 'error-input-wrapper' : '' }>
                                    <input 
                                        autoComplete = 'nope'
                                        value={this.props.value.name} 
                                        type='text' 
                                        placeholder='Name' 
                                        onChange={(e) => this.props.onInputValueChange('name', e.target.value)}
                                        onKeyDown={(e) => { if (e.shiftKey && e.keyCode === 9) {this.toggle()}}}
                                        onBlur={() => this.props.updateValidators("name")}
                                    />
                                    { this.props.store.displayValidationErrors('name', this.props.validators) }
                                </div>
                            </li>
                            <li>
                                <p>Phone:</p>
                                <div  className={this.props.store.checkIfShowError('phone', this.props.validators) ? 'error-input-wrapper' : '' } >
                                    <input 
                                        autoComplete = 'nope'
                                        value={this.props.value.phone}
                                        type='text' placeholder='Phone'
                                        onChange={(e) => this.props.onInputValueChange('phone', e.target.value)}
                                        onBlur={() => this.props.updateValidators('phone')} 
                                    />
                                    { this.props.store.displayValidationErrors('phone', this.props.validators) }
                                </div>
                            </li>
                            <li>
                                <p>Email:</p>
                                <div className={this.props.store.checkIfShowError('email', this.props.validators) ? 'error-input-wrapper' : '' }>
                                    <input 
                                        autoComplete = 'nope'
                                        value={this.props.value.email}
                                        type='text' placeholder='Email'
                                        onChange={(e) => this.props.onInputValueChange('email', e.target.value)}
                                        onKeyDown={(e) => { if (!e.shiftKey && e.keyCode === 9) {this.toggle()} }}
                                        onBlur={() => this.props.updateValidators('email')} 
                                    />
                                    { this.props.store.displayValidationErrors('email', this.props.validators) }
                                </div>
                            </li>
                        </ul>
                    }
                </div>
                {this.state.showError && this.alertNotValid }
            </li>
        );
    }
}

export default withStore(EditContact);