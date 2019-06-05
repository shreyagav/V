import React, { Component } from 'react';

class SignInSVG extends React.Component {
    render() {
        return (
            <div className='no-outline-button' style={{"height":"1rem", "width":"auto", "marginRight":"0.5em"}}>
                <svg style={{'height' : '100%'}} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                    <path className="svg" d="M19,12.5c0,0.2-0.2,0.4-0.4,0.5l-7,7c-0.5,0.5-1.6,0.5-2.1,0c-0.5-0.5-0.5-1.6,0-2.1l4.3-4.3h-2.3H7.7H1.6
                    c-0.9,0-1.6-0.7-1.6-1.4s0.7-1.4,1.6-1.4h6.1h3.8h2.3L9.5,6.4C9,5.9,9,4.8,9.5,4.3c0.5-0.5,1.6-0.5,2.1,0l7,7
                    c0.2,0.2,0.2,0.4,0.4,0.5C19.2,11.8,19.2,12.2,19,12.5z M14.7,22c0,0.5,0.4,0.9,0.9,0.9h3.8c2.7,0,4.7-2.1,4.7-4.7V5.7
                    c0-2.7-2.1-4.7-4.7-4.7h-3.8c-0.5,0-0.9,0.4-0.9,0.9s0.4,0.9,0.9,0.9h3.8c1.6,0,2.9,1.3,2.9,2.9v12.5c0,1.6-1.3,2.9-2.9,2.9h-3.8
                    C15,21.1,14.7,21.7,14.7,22z"/>
                </svg>
            </div>
        );
    }
}

export default SignInSVG;