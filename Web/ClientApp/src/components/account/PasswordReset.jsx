import React, { Component } from 'react';
import { withStore } from '../store';
import Loader from '../Loader';
import Alert from '../Alert';
import LogoSVG from '../../svg/LogoSVG';
class PasswordReset extends Component {
    static displayName = PasswordReset.name;

    constructor(props) {
        super(props);
        if (props.match.params.token) {
            console.log(props.match.params.token);
        }
        this.state = {
            loading: false,
            error: null,
            message:null,
            passwordReset: {
                Email: "",
                Token: props.match.params.token,
                NewPassword: "",
                NewPasswordRepeat:""
            }
        };
        this.changeEmail = this.changeEmail.bind(this);
        this.changeNewPassword = this.changeNewPassword.bind(this);
        this.changeNewPasswordRepeat = this.changeNewPasswordRepeat.bind(this);
        this.submitChangePasswordInfo = this.submitChangePasswordInfo.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    changeEmail(event) {
        var user = this.state.passwordReset;
        user.Email = event.target.value;
        this.setState({ passwordReset: user });
    }
    changeNewPassword(event) {
        var user = this.state.passwordReset;
        user.NewPassword = event.target.value;
        this.setState({ passwordReset: user });
    }
    changeNewPasswordRepeat(event) {
        var user = this.state.passwordReset;
        user.NewPasswordRepeat = event.target.value;
        this.setState({ passwordReset: user });
    }
    submitChangePasswordInfo() {
        this.setState({ loading: true });
        if (this.state.passwordReset.Token) {
            fetch('/api/account/ResetPassword', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(this.state.passwordReset)
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    if (json.succeeded === true) {
                        this.setState({ loading: false, message: "Password was reset." });
                    } else {
                        this.setState({ loading: false, error: json.errors[0].description });
                    }
                })
                .catch(err => this.setState({ loading: false, error: err }));
        } else {
            fetch('/api/account/SendResetPasswordToken', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ userName: this.state.passwordReset.Email })
            })
                .then(res => res.json())
                .then(json => {
                    if (json.error != null) {
                        this.setState({ loading: false, error: json.error });
                    } else {
                        this.setState({ loading: false, message: "An email with further instructions was sent" });
                    }
                })
                .catch(err => this.setState({ loading: false, error: err }));
        }
    }
    cancel() {
        this.props.history.push('/');
    }
    render() {
        return (
            <div className='centered login-form'>
                <div className='flex-nowrap align-center justify-space-between mb-2'>
                    <h3 className="uppercase-text mb-05">Forgot<strong> Password</strong></h3>
                    <a href="http://www.teamriverrunner.org" target="_self" style={{ "height": "1.5em" }}>
                        <LogoSVG />
                    </a>
                </div>
                {this.state.loading && <Loader />}
                <form className='flex-nowrap flex-flow-column align-center'>
                    {!this.state.message && <section>
                        <ul className='input-fields input-fields-narrow no-uppercase'>
                            <li>
                                <p>Email or Username:</p>
                                <input type='text' placeholder='Email' value={this.state.passwordReset.Email} onChange={this.changeEmail}></input>
                            </li>
                            {this.state.passwordReset.Token && <section> <li>
                                <p>New Password:</p>
                                <input type='password' placeholder='Password' value={this.state.passwordReset.NewPassword} onChange={this.changeNewPassword}></input>
                            </li>
                                <li>
                                    <p>Repeat Password:</p>
                                    <input type='password' placeholder='Password' value={this.state.passwordReset.NewPasswordRepeat} onChange={this.changeNewPasswordRepeat}></input>
                                </li></section>}
                        </ul>

                        <button type="button" className='medium-static-button static-button' style={{ width: "300px" }} onClick={this.submitChangePasswordInfo}>{this.state.passwordReset.Token ? "Reset Password" : "Send reset password link"}</button>
                    </section>}
                    {this.state.message && <p>{this.state.message}</p>}
                    <button type="button" className='medium-static-button static-button' onClick={this.cancel}>Go Home</button>
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
export default withStore(PasswordReset);