import React, { Component } from 'react';
import { withStore } from './../store';
import Loader from '../Loader';
import Alert from '../Alert';
import { alertNotValid } from '../alerts'
import LogoSVG from '../../svg/LogoSVG';
import { signInValidators } from './signUpValidators'
import PasswordComponent from '../PasswordComponent'
import CheckBox from '../CheckBox';

class SignIn extends Component {
    static displayName = SignIn.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showError: null,
            error: null,
            signInData: {
                UserName: "",
                Password: "",
                IsPersistant: false
            }
        };
        this.goToRegister = this.goToRegister.bind(this);
        this.changeIsPersistant = this.changeIsPersistant.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.submitSignInInfo = this.submitSignInInfo.bind(this);
        this.onChange = this.onChange.bind(this);
        this.checkIfFieldValid = this.checkIfFieldValid.bind(this);
        this.showError = this.showError.bind(this);
    }

    showError = () => { this.setState({showError: true}) }

    componentWillMount = () => {
        this.validators = signInValidators();
        this.alertNotValid = alertNotValid(() => this.setState({ showError: false }));
    }

    checkIfFieldValid = (field) => {
        if(this.validators[field].activated === false && this.state.signInData[field] !== ''){
            this.props.store.updateValidators(field, this.state.signInData[field], this.validators);
            let tmp = this.state.signInData;
            this.setState({ signInData: tmp });
        }
    }

    onChange = (e, field) => {
        /* check validation only if field was previously activated! */
        if(this.validators[field].activated){
            this.props.store.updateValidators(field, e.target.value, this.validators);
        }
        this.handleTextChange(e);
    }

    handleTextChange(evt) {
        let tmp = this.state.signInData;
        tmp[evt.target.name] = evt.target.value;
        this.setState({ signInData: tmp });
    }

    changeIsPersistant = () => {
        var user = this.state.signInData;
        user.IsPersistant = !user.IsPersistant;
        this.setState({ signInData: user });
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.props.store.performIfValid(this.state.signInData, this.validators, this.submitSignInInfo, this.showError)
        }
    }

    handleHover = (event) => { 
        event.target.style.background = 'red';
    }
    
    /*changeUserName(event) {
        var user = this.state.signInData;
        user.UserName = event.target.value;
        this.setState({ signInData: user });
    }*/

    changePassword(event) {
        var user = this.state.signInData;
        user.Password = event.target.value;
        this.setState({ signInData: user });
    }
    submitSignInInfo() {
        this.setState({ loading: true });

        fetch('/api/account/signin', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state.signInData)
        })
            .then(res => res.json())
            .then(json => {
                if (json.error != null) {
                    this.setState({ loading: false, error: json.error });
                } else {
                    var userInfo = { userName: json.userName, userRole: json.userRole };
                    this.props.store.set('userInfo', userInfo);
                    this.props.history.push(this.props.location.state && this.props.location.state.redirectUrl ? this.props.location.state.redirectUrl : '/');
                }
            })
            .catch(err => this.setState({ loading: false, error: err }));
    }
    goToRegister() {
        this.props.history.push('/SignUp');
    }
    render() {
        return (
            <div className='abs-wrapper'>

                <div>
                <div className='flex-nowrap align-center justify-space-between mt-2 mb-1'>
                    <h1 className="uppercase-text mb-05">Sign<strong> In</strong></h1>
                    <a href="http://www.teamriverrunner.org" target="_self" style={{ "height": "1.5em" }}>
                        <LogoSVG />
                    </a>
                </div>
                {this.state.loading && <Loader />}
                <ul className='input-fields input-fields-narrow no-uppercase'>
                    <li>
                        <p>Email or Username:</p>
                        <div className={'mb-1'+ (this.props.store.checkIfShowError('UserName', this.validators) ? ' error-input-wrapper' : '') }>
                            <input 
                                name="UserName" type='text' placeholder='Email or Username'
                                value={this.state.signInData.UserName}
                                onChange={(e) => this.onChange(e, "UserName")}
                                onBlur={() => this.checkIfFieldValid('UserName')}
                                onKeyDown={this.handleKeyDown}
                            />
                        { this.props.store.displayValidationErrors('UserName', this.validators) }
                        </div>
                    </li>
                    <li>
                        <p>Password:</p>
                        <div>
                            <PasswordComponent
                                className = 'mb-1'
                                checkIfShowError = {(field, validators) => this.props.store.checkIfShowError(field, validators)}
                                validators = {this.validators}
                                name = "Password"
                                placeholder = 'Password'
                                value = {this.state.signInData.Password}
                                onChange = {(e, name) => this.onChange(e, name)}
                                onBlur = {(name) => this.checkIfFieldValid(name)}
                                displayValidationErrors = {(name, validators) => this.props.store.displayValidationErrors(name, validators)} 
                                onKeyDown = {this.handleKeyDown}
                            />
                            <div className='flex-wrap justify-space-between align-center mt-1'>
                                <CheckBox 
                                    className = 'mb-05'
                                    onClick = {this.changeIsPersistant}
                                    checked = {this.state.signInData.IsPersistant}
                                    labelClassName = 'uppercase-text bold-text'
                                    labelText = 'Remember me'
                                />
                                {/*<span className='flex-nowrap justify-left align-center'>
                                    <label>
                                        <input type="checkbox" checked={this.state.signInData.IsPersistant} onChange={this.changeIsPersistant} />
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 12 12" >
                                            <polygon className='svg' points="5.3,11 4.2,11 0,5.3 1.1,4.4 4.7,9.4 10.9,1 12,1.8 " />
                                        </svg>
                                    </label>
                                    <p className='pl-05' style={{"marginTop":"0px"}}>Remember me</p>
                                </span>*/}
                                <button
                                    type="button" 
                                    className='medium-static-button static-button default-button' 
                                    onMouseOver={handleHover}
                                    onClick={() => this.props.store.performIfValid(this.state.signInData, this.validators, this.submitSignInInfo, this.showError)}
                                >Sign In</button>
                                <a className = 'a' href="/ForgotPassword">Forgot Password?</a>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className = 'flex-nowrap align-center mt-2 w-100'>
                    <span className='line'></span>
                    <p className='pr-05 pl-05' style={{whiteSpace:"nowrap", "lineHeight":"1", "fontWeight":"600"}}>New to TRR?</p>
                    <span className='line'></span>
                </div>
                <div className = 'flex-nowrap justify-center mt-2 w-100'>
                    <button type="button" className='medium-static-button static-button' onClick={this.goToRegister}>Register</button>
                </div>
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
                </div>
            </div>
        );
    }
}
export default withStore(SignIn);