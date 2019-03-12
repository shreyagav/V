import React, { Component } from 'react';

class UserSVG extends React.Component {
    render() {
        return (
            <div className='round-button big-round-button grey-outline-button'>
                <svg
                    style={{'height' : '100%'}} 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    x="0px" y="0px" viewBox="0 0 25 25" 
                >
                    <path className="SVG" d="M21.5,20.5c-2.1,2.4-5,4-9,4s-6.9-1.6-9-4c0.5-3.9,2-6.9,5.2-8c1.2,0.9,2.4,1.6,3.8,1.6s2.6-0.7,3.8-1.6
		C19.5,13.6,21,16.5,21.5,20.5z M12.5,12.5c6.1,0,7-12,0-12S6.4,12.5,12.5,12.5z"/>
                </svg>
            </div>
        );
    }
}

export default UserSVG;