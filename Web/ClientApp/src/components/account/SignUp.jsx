import React, { Component } from 'react';

export class SignUp extends Component {
    static displayName = SignUp.name;

    constructor(props) {
        super(props);
        this.state = {
            waitingForServer: false
        };
        
    }

    render() {
        return (
            <div className='centered login-form'>
                <div className='flex-nowrap align-center justify-center'>
                    <img src="images/logo.svg" />
                </div>
                <h2 className='mb-2 mt-2 flex-nowrap justify-center'><strong>Sign Up</strong></h2>
                <form>
                    <div>
                        <input className='mb-1' type='text' placeholder='Email'></input>
                        <input className='mb-1' type='password' placeholder='Password'></input>
                        <input className='mb-1' type='password' placeholder='Repeat Password'></input>
                        <input className='mb-1' type='text' placeholder='Zip'></input>
                    </div>
                    <div className='flex-wrap justify-center mt-2'>
                        <button className='medium-static-button static-button'>Submit</button>
                        <button className='medium-static-button static-button default-button' onClick={() => this.props.history.push('/')}>Home</button>
                    </div>
                </form>
            </div>
        );
    }
}
