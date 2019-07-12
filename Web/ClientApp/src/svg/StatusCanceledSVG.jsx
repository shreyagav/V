import React, { Component } from 'react';

class StatusCanceledSVG extends React.Component {
    render() {
        return (
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 14 16" >
                    <path className='svg' d="M3.3,2.6V1.3c0-0.2,0.1-0.3,0.3-0.3h0.9V0.5C4.5,0.2,4.7,0,5,0h4c0.3,0,0.5,0.2,0.5,0.5V1h0.9
	c0.2,0,0.3,0.1,0.3,0.3v1.3c0,0.2-0.1,0.3-0.3,0.3H3.5C3.4,2.9,3.3,2.8,3.3,2.6z M12.8,0.9h-0.7v2.6c0,0.3-0.3,0.5-0.5,0.5H2.6
	C2.3,4,2.1,3.8,2.1,3.5V0.9H1.3C0.6,0.9,0,1.5,0,2.2v12.6C0,15.5,0.6,16,1.3,16h11.4c0.7,0,1.3-0.6,1.3-1.3V2.2
	C14,1.5,13.4,0.9,12.8,0.9z M10.9,12.6l-1.2,1.2L7,11.1l-2.7,2.7l-1.2-1.2l2.7-2.7L3.1,7.2l1.2-1.2L7,8.7l2.7-2.7l1.2,1.2L8.2,9.9
	L10.9,12.6z"/>
                </svg>
        );
    }
}

export default StatusCanceledSVG;