import React, { Component } from 'react';

class SaveUp2SVG extends React.Component {
    render() {
        return (
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 25 25" >
                    <path className='svg' d="M17.3,8.1h-2V3.5h2V8.1z M19.3,9.1H5.7V2.7h13.6V9.1z M23.5,22.1V2.9c0-0.8-0.6-1.4-1.4-1.4H2.9
	c-0.8,0-1.4,0.6-1.4,1.4v19.2c0,0.8,0.6,1.4,1.4,1.4h19.2C22.9,23.5,23.5,22.9,23.5,22.1z M20,21.8H5v-9.4H20V21.8z M18.6,14.2H6.4
	v0.6h12.1V14.2z M18.6,17.4H6.4v-0.6h12.1V17.4z M18.6,20H6.4v-0.6h12.1V20z"/>
                </svg>
        );
    }
}

export default SaveUp2SVG;