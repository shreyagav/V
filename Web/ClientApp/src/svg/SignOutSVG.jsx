import React, { Component } from 'react';

class SignOutSVG extends React.Component {
    render() {
        return (
            <div className='no-outline-button' style={{"height":"1rem", "width":"auto", "marginRight":"0.5em"}}>
                <svg style={{'height' : '100%'}} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                    <path className="svg" d="M23.8,12.5c0,0.2-0.2,0.4-0.4,0.5l-7,7c-0.5,0.5-1.6,0.5-2.2,0c-0.5-0.5-0.5-1.6,0-2.2l4.3-4.3h-2.3h-3.8h-6
	c-0.9,0-1.6-0.7-1.6-1.4s0.7-1.4,1.6-1.4h6.1h3.8h2.3l-4.3-4.3c-0.5-0.5-0.5-1.6,0-2.2c0.5-0.5,1.6-0.5,2.2,0l7,7
	c0.2,0.2,0.2,0.4,0.4,0.5C24,11.8,24,12.2,23.8,12.5z M8.5,21.2H4.7c-1.6,0-2.9-1.3-2.9-2.9V5.7c0-1.6,1.3-2.9,2.9-2.9h3.8
	c0.5,0,0.9-0.4,0.9-0.9S9,1,8.5,1H4.7C2.2,1,0,3,0,5.7v12.6C0,21,2.2,23,4.7,23h3.8c0.5,0,0.9-0.4,0.9-0.9C9.4,21.6,9,21.2,8.5,21.2
	z"/>
                </svg>
            </div>
        );
    }
}

export default SignOutSVG;