import React, { Component } from 'react';

class MenuSVG extends React.Component {
    render() {
        return (
                <svg
                    style={{'height' : '100%'}} 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    x="0px" y="0px" viewBox="0 0 25 25" 
                >
                    <path className="svg" d="M23.4,8.1H1.6C0.7,8.1,0,7.4,0,6.6l0,0C0,5.7,0.7,5,1.6,5h21.9C24.3,5,25,5.7,25,6.6v0
	C25,7.4,24.3,8.1,23.4,8.1z M25,12.5L25,12.5c0-0.9-0.7-1.6-1.6-1.6H1.6c-0.9,0-1.6,0.7-1.6,1.6v0c0,0.9,0.7,1.6,1.6,1.6h21.9
	C24.3,14.1,25,13.4,25,12.5z M25,18.4L25,18.4c0-0.9-0.7-1.6-1.6-1.6H1.6c-0.9,0-1.6,0.7-1.6,1.6l0,0C0,19.3,0.7,20,1.6,20h21.9
	C24.3,20,25,19.3,25,18.4z"/>
                </svg>
        );
    }
}

export default MenuSVG;