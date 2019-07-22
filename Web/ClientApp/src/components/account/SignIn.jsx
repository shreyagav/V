import React, { Component } from 'react';
import { withStore } from './../store';
import Loader from '../Loader';
import Alert from '../Alert';
class SignIn extends Component {
    static displayName = SignIn.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            signInData: {
                UserName: "",
                Password: "",
                IsPersistant: false
            }
        };
        this.goToRegister = this.goToRegister.bind(this);
        this.changeIsPersistant = this.changeIsPersistant.bind(this);
        this.changeUserName = this.changeUserName.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.submitSignInInfo = this.submitSignInInfo.bind(this);
    }
    changeIsPersistant(event) {
        var user = this.state.signInData;
        user.IsPersistant = event.target.checked;
        this.setState({ signInData: user });
    }
    changeUserName(event) {
        var user = this.state.signInData;
        user.UserName = event.target.value;
        this.setState({ signInData: user });
    }
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
            <div className='centered login-form'>
                <div className='flex-nowrap align-center justify-space-between mb-2'>
                    <h1 class="uppercase-text mb-05">Sign<strong> In</strong></h1>
                    <img src="images/logo.svg" style={{"height":"1.5em"}} />
                </div>
                {this.state.loading && <Loader />}
                    <form className='flex-nowrap flex-flow-column align-center'>
                        <ul className='input-fields input-fields-narrow no-uppercase'>
                            <li>
                                <p>Email or Username:</p>
                                <input type='text' placeholder='Email' value={this.state.signInData.UserName} onChange={this.changeUserName}></input>
                            </li>
                            <li>
                                <p>Password:</p>
                                <div>
                                    <input type='password' placeholder='Password' value={this.state.signInData.Password} onChange={this.changePassword}></input>
                                    <div className='flex-wrap justify-space-between align-center'>
                                            <span className='flex-nowrap justify-left align-center'>
                                                <label>
                                                    <input type="checkbox" checked={this.state.signInData.IsPersistant} onChange={this.changeIsPersistant} />
                                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 12 12" >
                                                        <polygon className='svg' points="5.3,11 4.2,11 0,5.3 1.1,4.4 4.7,9.4 10.9,1 12,1.8 " />
                                                    </svg>
                                                </label>
                                                <p className='pl-05' style={{"marginTop":"0px"}}>Remeber me</p>
                                            </span>
                                            <button type="button" className='medium-static-button static-button default-button' onClick={this.submitSignInInfo}>Sign In</button>
                                            <a href="/ForgotPassword">Forgot Password?</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        
                        {/*<div>
                            <p className='mb-1'><strong>Sign In using your existing account:</strong></p>
                            <input className='mb-1' type='text' placeholder='Email' value={this.state.signInData.UserName} onChange={this.changeUserName}></input>
                            <input className='mb-1' type='password' placeholder='Password' value={this.state.signInData.Password} onChange={this.changePassword}></input>
                        </div>
                        <div className='flex-wrap justify-space-between align-center'>
                            <span className='flex-nowrap justify-left align-center mb-05'>
                                <label>
                                    <input type="checkbox" checked={this.state.signInData.IsPersistant} onChange={this.changeIsPersistant} />
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 12 12" >
                                        <polygon className='svg' points="5.3,11 4.2,11 0,5.3 1.1,4.4 4.7,9.4 10.9,1 12,1.8 " />
                                    </svg>
                                </label>
                                <p className='pl-05'><strong>Remeber me</strong></p>
                            </span>
                            <a className='mb-05' href="/ForgotPassword"><strong>Forgot Password?</strong></a>
                        </div>*/}
                        <div className = 'flex-nowrap align-center mt-2 mb-2' style={{"width":"100%"}}>
                            <span className='line'></span>
                                <p className='pr-05 pl-05' style={{"white-space":"nowrap", "lineHeight":"1", "fontWeight":"600"}}>New to TRR?</p>
                            <span className='line'></span>
                        </div>
                        <button type="button" className='medium-static-button static-button' onClick={this.goToRegister}>Register</button>
                        {/*<div className='flex-wrap justify-center mt-2'>
                            <button type="button" className='medium-static-button static-button' onClick={this.goToRegister}>Create Account</button>
                            <button type="button" className='medium-static-button static-button default-button' onClick={this.submitSignInInfo}>Sign In</button>
                        </div>*/}
                    </form>
                {this.state.error !=null &&
                    <Alert
                    headerText="Error"
                    text={this.state.error}
                    mode="error"
                    onClose={() => this.setState({ error: null })}
                    showOkButton={true}
                    onOkButtonClick={() => this.setState({ error: null })}
                    >
                    </Alert>
                }
            </div>
        );
    }
}
export default withStore(SignIn);