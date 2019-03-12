import React, { Component } from 'react';

class ChaptersSVG extends React.Component {
    render() {
        return (
            <div className='round-button big-round-button grey-outline-button'>
                <svg
                    style={{'height' : '100%'}} 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    x="0px" y="0px" viewBox="0 0 25 25" 
                >
                    <path className="SVG" d="M9.7,12c0,2-1.6,3.6-3.6,3.6S2.5,14,2.5,12s1.6-3.6,3.6-3.6S9.7,10.1,9.7,12z M6.1,6C2.7,6,0,8.7,0,12
	s6.1,13,6.1,13s6.1-9.6,6.1-13S9.4,6,6.1,6z M22.5,6.1c0,2-1.6,3.6-3.6,3.6s-3.6-1.6-3.6-3.6s1.6-3.6,3.6-3.6S22.5,4.1,22.5,6.1z
	 M18.9,0c-3.4,0-6.1,2.7-6.1,6.1s6.1,13,6.1,13S25,9.4,25,6.1S22.3,0,18.9,0z"/>
                </svg>
            </div>
        );
    }
}

export default ChaptersSVG;