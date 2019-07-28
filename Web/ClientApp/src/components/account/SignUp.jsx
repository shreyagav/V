import React, { Component } from 'react';
import { withStore } from './../store';
import LogoSVG from '../../svg/LogoSVG';

class SignUp extends Component {
    static displayName = SignUp.name;

    constructor(props) {
        super(props);
        this.state = {
            waitingForServer: false,
            signUpInfo: {
                Email: "",
                Password: "",
                PasswordRepeat: "",
                FirstName: "",
                LastName: "",
                Phone: "",
                Zip:""
            }
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
    }

    handleTextChange(evt) {
        let tmp = this.state.signUpInfo;
        tmp[evt.target.name] = evt.target.value;
        this.setState({ signUpInfo: tmp });
    }
    submitSignUp() {
        this.setState({ waitingForServer: true });
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
                    this.setState({ waitingForServer: false, error: json.error });
                } else {
                    this.props.history.push(this.props.location.state && this.props.location.state.redirectUrl ? this.props.location.state.redirectUrl : '/');
                }
            })
            .catch(err => this.setState({ waitingForServer: false, error: err }));
    }

    render() {
        return (
            <div className='centered login-form'>
                <div className='flex-nowrap align-center justify-center'>
                    <a href="http://www.teamriverrunner.org" target="_self">
                        <LogoSVG />
                    </a>
                </div>
                {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                <h2 className='mb-2 mt-2 flex-nowrap justify-center'><strong>Sign Up</strong></h2>
                    <div>
                    <input className='mb-1' name="Email" type='text' placeholder='Email' onChange={this.handleTextChange}></input>
                        <input className='mb-1' name="Password" type='password' placeholder='Password' onChange={this.handleTextChange}></input>
                        <input className='mb-1' name="PasswordRepeat" type='password' placeholder='Repeat Password' onChange={this.handleTextChange}></input>
                        <input className='mb-1' name="FirstName" type='text' placeholder='First Name' onChange={this.handleTextChange}></input>
                        <input className='mb-1' name="LastName" type='text' placeholder='Last Name' onChange={this.handleTextChange}></input>
                        <input className='mb-1' name="Phone" type='text' placeholder='Phone' onChange={this.handleTextChange}></input>
                    <input className='mb-1' name="Zip" type='text' placeholder='Zip' onChange={this.handleTextChange}></input>
                    </div>
                <div className='flex-wrap justify-center mt-2'>
                    <button className='medium-static-button static-button' onClick={this.submitSignUp}>Submit</button>
                        <button className='medium-static-button static-button default-button' onClick={() => this.props.history.push('/')}>Home</button>
                    </div>
            </div>
        );
    }
}
export default withStore(SignUp);
