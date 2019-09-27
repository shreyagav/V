import React, { Component } from 'react';

class PasswordShowUpSVG extends React.Component {
    render() {
        return (
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24" >
                    <path className='svg' d="M12.2,18.9c-4.6,0-8.9-2.3-11.9-6.3c-0.2-0.3-0.3-0.8,0-1.1c2.4-3.9,7-6.4,11.9-6.4c0,0,0,0,0,0
	c4.8,0,9,2.3,11.4,6.4c0.2,0.3,0.2,0.7,0,1c-2.3,3.8-6.3,6.1-10.8,6.3C12.6,18.9,12.4,18.9,12.2,18.9z M2.4,12
	c2.6,3.3,6.4,5.1,10.4,4.9c3.6-0.2,6.9-2,8.9-4.8c-2.1-3.1-5.5-4.9-9.4-4.9c0,0,0,0,0,0C8.3,7.1,4.5,9,2.4,12z M12,8.5
	c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5S13.9,8.5,12,8.5z"/>
                </svg>
        );
    }
}

export default PasswordShowUpSVG;