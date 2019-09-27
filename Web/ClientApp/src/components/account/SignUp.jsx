import React, { Component } from 'react'
import { withStore } from './../store'
import LogoSVG from '../../svg/LogoSVG'
import Loader from '../Loader';
import { signUpValidators } from './signUpValidators'
import { alertNotValid } from '../alerts'
import Alert from '../Alert'
import PasswordShowUpSVG from '../../svg/PasswordShowUpSVG'
import PasswordHideUpSVG from '../../svg/PasswordHideUpSVG'

class SignUp extends Component {
    static displayName = SignUp.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            signUpInfo: {
                Email: "",
                Password: "",
                PasswordRepeat: "",
                FirstName: "",
                LastName: "",
                Phone: "",
                Zip:""
            },
            showError: false,
            error: null,
            success: null,
        };
        this.passwordInputRef = null;

        this.handleTextChange = this.handleTextChange.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
        this.onChange = this.onChange.bind(this);
        this.checkIfMatches = this.checkIfMatches.bind(this);
        this.checkIfPasswordRepeatValid = this.checkIfPasswordRepeatValid.bind(this);
        this.onPasswordRepeatChange = this.onPasswordRepeatChange.bind(this);
        this.inputTypeToggler = this.inputTypeToggler.bind(this);
        this.checkIfFieldValid = this.checkIfFieldValid.bind(this);
        this.showError = this.showError.bind(this);
        this.onSuccessOkButton = this.onSuccessOkButton.bind(this);
    }

    onSuccessOkButton = () => {
        //this.setState({ success: false });
        this.props.history.push(this.props.location.state && this.props.location.state.redirectUrl ? this.props.location.state.redirectUrl : '/');
    }

    componentWillMount = () => {
        this.validators = signUpValidators();
        this.alertNotValid = alertNotValid(() => this.setState({ showError: false }));
    }

    handleTextChange(evt) {
        let tmp = this.state.signUpInfo;
        tmp[evt.target.name] = evt.target.value;
        this.setState({ signUpInfo: tmp });
    }

    submitSignUp() {
        this.setState({ loading: true });
        fetch('/api/account/signup', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state.signUpInfo)
        })
            .then(res => res.json())
            .then(json => {
                if (json.error != null) {
                    this.setState({ loading: false, error: json.error });
                } else {
                    this.setState({ success: true });
                }
            })
            .catch(err => this.setState({ loading: false, error: err }));
    }

    checkIfFieldValid = (field) => {
        if(this.validators[field].activated === false && this.state.signUpInfo[field] !== ''){
            this.props.store.updateValidators(field, this.state.signUpInfo[field], this.validators);
            let tmp = this.state.signUpInfo;
            this.setState({ signUpInfo: tmp });
        }
    }

    checkIfMatches = (val1, val2) => {return val1 === val2}; 

    checkIfPasswordRepeatValid = (value) => {
        this.props.store.updateValidators("PasswordRepeat", this.checkIfMatches(value, this.state.signUpInfo.Password), this.validators);
        let tmp = this.state.signUpInfo;
        this.setState({ signUpInfo: tmp });
    }

    onChange = (e, field) => {
        /* check validation only if field was previously activated! */
        if(this.validators[field].activated){
            this.props.store.updateValidators(field, e.target.value, this.validators);
        }
        this.handleTextChange(e);
    }

    onPasswordRepeatChange = (e) => {
        /* check validation only if field was previously activated! */
        if(this.validators["PasswordRepeat"].activated){
            this.props.store.updateValidators("PasswordRepeat", this.checkIfMatches(e.target.value, this.state.signUpInfo.Password), this.validators);
        }
        this.handleTextChange(e);
    }

    inputTypeToggler = (inputRef) => {
        if(inputRef !== null){
            let svgs = inputRef.nextSibling.children;
            if(inputRef.type === "password"){
                inputRef.type = 'text';
                svgs[0].classList.add("display-none");
                svgs[0].classList.remove("display-flex");
                svgs[1].classList.add("display-flex");
                svgs[1].classList.remove("display-none");
            }
            else {
                inputRef.type = "password";
                svgs[1].classList.add("display-none");
                svgs[1].classList.remove("display-flex");
                svgs[0].classList.add("display-flex");
                svgs[0].classList.remove("display-none");
            }
        }
    }

    showError = () => { this.setState({showError: true}) }

    render() {
        return (
            <div className='abs-wrapper'>
                <div>
                    <div className='flex-nowrap align-center justify-space-between mt-2 mb-1' >
                        <h1 className="uppercase-text mb-05">Sign<strong> Up</strong></h1>
                        <a href="http://www.teamriverrunner.org" target="_self" style={{ "height": "1.5em" }}>
                            <LogoSVG />
                        </a>
                    </div>
                    {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                    <ul className='input-fields input-fields-narrow no-uppercase'>
                        <li>
                            <p>Email:</p>
                            <div className={'mb-1'+ (this.props.store.checkIfShowError('Email', this.validators) ? ' error-input-wrapper' : '') }>
                                <input 
                                    name="Email" type='text' placeholder='Email'
                                    onChange={(e) => this.onChange(e, "Email")}
                                    onBlur={() => this.checkIfFieldValid('Email')} 
                                />
                                { this.props.store.displayValidationErrors('Email', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p>Password:</p>
                            <div className={'mb-1'+ (this.props.store.checkIfShowError('Password', this.validators) ? ' error-input-wrapper' : '') }>
                                <div className='input-button-wrapper'>
                                    <input 
                                        ref={el => this.passwordInputRef = el}
                                        name="Password" type='password' placeholder='Password'
                                        value={this.state.signUpInfo.Password}
                                        onChange={(e) => {
                                            let password = e.target.value;
                                            let passwordRepeat = this.state.signUpInfo.PasswordRepeat;
                                            if(this.validators["PasswordRepeat"].activated){
                                                let match = this.checkIfMatches(password, passwordRepeat);
                                                this.props.store.updateValidators("PasswordRepeat", match, this.validators);
                                            }
                                            this.onChange(e, "Password");
                                        }}
                                        onBlur={() => {this.checkIfFieldValid('Password')}} 
                                    />
                                    {this.state.signUpInfo.Password.length > 0 &&
                                        <button onClick={() => {this.inputTypeToggler(this.passwordInputRef)}}>
                                            <PasswordShowUpSVG />
                                            <PasswordHideUpSVG svgClassName={"display-none"}/>
                                        </button>
                                    }
                                </div>
                                { this.props.store.displayValidationErrors('Password', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p>Repeat Password:</p>
                            <div className={'mb-1'+ (this.props.store.checkIfShowError('PasswordRepeat', this.validators) ? ' error-input-wrapper' : '') }>
                                <div className='input-button-wrapper'>
                                    <input 
                                        ref={el => this.passwordRepeatInputRef = el}
                                        name="PasswordRepeat" type='password' placeholder='Repeat Password'
                                        value={this.state.signUpInfo.PasswordRepeat} 
                                        onChange={this.onPasswordRepeatChange}
                                        onBlur={() => this.checkIfPasswordRepeatValid(this.state.signUpInfo.PasswordRepeat)} 
                                    />
                                    {this.state.signUpInfo.PasswordRepeat.length > 0 &&
                                        <button onClick={() => {this.inputTypeToggler(this.passwordRepeatInputRef)}}>
                                            <PasswordShowUpSVG />
                                            <PasswordHideUpSVG svgClassName={"display-none"}/>
                                        </button>
                                    }
                                </div>
                                { this.props.store.displayValidationErrors('PasswordRepeat', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p>First Name:</p>
                            <div className={'mb-1'+ (this.props.store.checkIfShowError('FirstName', this.validators) ? ' error-input-wrapper' : '') }>
                                <input 
                                    name="FirstName" type='text' placeholder='First Name'
                                    onChange={(e) => this.onChange(e, "FirstName")}
                                    onBlur={() => this.checkIfFieldValid('FirstName')} 
                                />
                                { this.props.store.displayValidationErrors('FirstName', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p>Last Name:</p>
                            <div className={'mb-1'+ (this.props.store.checkIfShowError('LastName', this.validators) ? ' error-input-wrapper' : '') }>
                                <input 
                                    name="LastName" type='text' placeholder='Last Name'
                                    onChange={(e) => this.onChange(e, "LastName")}
                                    onBlur={() => this.checkIfFieldValid('LastName')} 
                                />
                                { this.props.store.displayValidationErrors('LastName', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p className='mark-optional'>Phone:</p>
                            <div className={'mb-1'+ (this.props.store.checkIfShowError('Phone', this.validators) ? ' error-input-wrapper' : '') }>
                                <input 
                                    name="Phone" type='text' placeholder='Phone'
                                    onChange={(e) => this.onChange(e, "Phone")}
                                    onBlur={() => this.checkIfFieldValid('Phone')} 
                                />
                                { this.props.store.displayValidationErrors('Phone', this.validators) }
                            </div>
                        </li>
                        <li>
                            <p>Zip:</p>
                            <div className={'mb-1'+ (this.props.store.checkIfShowError('Zip', this.validators) ? ' error-input-wrapper' : '') }>
                                <input 
                                    name="Zip" type='text' placeholder='Zip'
                                    onChange={(e) => this.onChange(e, "Zip")}
                                    onBlur={() => this.checkIfFieldValid('Zip')} 
                                />
                                { this.props.store.displayValidationErrors('Zip', this.validators) }
                            </div>
                        </li>
                    </ul>
                    <div className='flex-wrap justify-center mt-1 mb-2'>
                        <button 
                            className='medium-static-button static-button' 
                            onClick={() => this.props.store.performIfValid(this.state.signUpInfo, this.validators, this.submitSignUp, this.showError)}
                        >Submit</button>
                        <button className='medium-static-button static-button default-button' onClick={() => this.props.history.push('/')}>Home</button>
                    </div>
                    {this.state.loading && <Loader/>}
                    {this.state.showError && this.alertNotValid }
                    {this.state.error !=null &&
                        <Alert
                            headerText="Error"
                            text={this.state.error}
                            mode="error"
                            onClose={() => this.setState({ error: null })}
                            showOkButton={true}
                            onOkButtonClick={() => this.setState({ error: null })}
                        />
                    }
                    {this.state.success &&
                        <Alert
                            headerText="Success"
                            text={"Your profile was successfully created"}
                            mode="success"
                            onClose={this.onSuccessOkButton}
                            showOkButton={true}
                            onOkButtonClick={this.onSuccessOkButton}
                        />
                    }
                </div>
            </div>
        );
    }
}
export default withStore(SignUp);
