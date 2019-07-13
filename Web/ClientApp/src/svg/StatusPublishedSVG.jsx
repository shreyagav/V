import React, { Component } from 'react';

class StatusPublishedSVG extends React.Component {
    render() {
        return (
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 14 16" >
                    <path className='svg' d="M3.3,2.6V1.3c0-0.2,0.1-0.3,0.3-0.3h0.9V0.5C4.5,0.2,4.7,0,5,0h4c0.3,0,0.5,0.2,0.5,0.5V1h0.9
	c0.2,0,0.3,0.1,0.3,0.3v1.3c0,0.2-0.1,0.3-0.3,0.3H3.5C3.4,2.9,3.3,2.8,3.3,2.6z M12.7,0.9H12v2.6c0,0.3-0.3,0.5-0.5,0.5H2.6
	c-0.3,0-0.5-0.3-0.5-0.5V0.9H1.3C0.5,0.9,0,1.5,0,2.2v12.5C0,15.5,0.6,16,1.3,16h11.5c0.7,0,1.3-0.6,1.3-1.3V2.2
	C14,1.5,13.4,0.9,12.7,0.9z M7.2,13.7H6L3,9.5l1.4-1.3l2.1,3.1L10.2,6l1.4,1.2L7.2,13.7z"/>
                </svg>
        );
    }
}

export default StatusPublishedSVG;