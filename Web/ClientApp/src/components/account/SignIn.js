import React, { Component } from 'react';

export class SignIn extends Component {
    static displayName = SignIn.name;

  constructor (props) {
      super(props);
      this.state = {
          waitingForServer: false,
          signInData: {
              UserName: "",
              Password: "",
              IsPersistant:false
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
        this.setState({ waitingForServer: true });
        fetch('/api/account/signin', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state.signInData)
        })
            .then(res => res.json())
            .then(json => { console.log(json); this.setState({ waitingForServer: false }); if (this.props.location.state && this.props.location.state.redirectUrl) this.props.history.push(this.props.location.state.redirectUrl); else this.props.history.push('/')  })
            .catch(err => this.setState({ waitingForServer: false }));
    }
    goToRegister() {
        this.props.history.push('/SignUp');
    }
  render () {
      return (
          <div className='centered login-form'>
              <div className='flex-nowrap align-center justify-center'>
                  <img src="images/logo.svg" />
              </div>
              <h2 className='mb-2 mt-2 flex-nowrap justify-center'><strong>Sign In</strong></h2>
              {this.state.waitingForServer ? (<p>Authenticating</p>) : (
                  <form>
                      <div>
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
                      </div>
                      <div className='flex-wrap justify-center mt-2'>
                          <button type="button" className='medium-static-button static-button' onClick={this.goToRegister}>Register</button>
                          <button type="button" className='medium-static-button static-button default-button' onClick={this.submitSignInInfo}>Sign In</button>
                      </div>
                  </form>)}
              
          </div>
    );
  }
}
