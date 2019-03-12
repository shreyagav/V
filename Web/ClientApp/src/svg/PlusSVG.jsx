import React, { Component } from 'react';

class PlusSVG extends React.Component {
    render() {
        return (
                <svg
                    style={{'height' : '100%'}} 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    x="0px" y="0px" viewBox="0 0 25 25" 
                >
                    <path className="SVG" d="M23.4,10.9h-9.4V1.6c0-0.9-0.7-1.6-1.6-1.6s-1.6,0.7-1.6,1.6v9.4H1.6c-0.9,0-1.6,0.7-1.6,1.6s0.7,1.6,1.6,1.6
	h9.4v9.4c0,0.9,0.7,1.6,1.6,1.6s1.6-0.7,1.6-1.6v-9.4h9.4c0.9,0,1.6-0.7,1.6-1.6S24.3,10.9,23.4,10.9z"/>
                </svg>
        );
    }
}

export default PlusSVG;