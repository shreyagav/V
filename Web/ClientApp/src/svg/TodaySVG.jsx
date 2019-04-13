import React, { Component } from 'react';

class TodaySVG extends React.Component {
    render() {
        return (
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24" >
                    <path className='svg' d="M21.2,0c1.6,0,2.7,1,2.7,2.6c0,2.4,0,7.1,0,9.5c0,3.1,0,6.1,0,9.2c0,1.8-1,2.8-2.9,2.8c-5.7,0-12.4,0-18,0
	c-1.8,0-2.8-0.9-2.8-2.7c0-5.4,0-13.2,0-18.5C0.1,0.9,1.1,0,3,0C3.3,0,20.8,0,21.2,0z M2.7,6c0,4.4,0,11.2,0,15.6
	c5.9,0,12.7,0,18.6,0c0-4.4,0-11.2,0-15.6C15.4,6,8.6,6,2.7,6z M10,16.4c-1.1-1.2-2.2-2.3-3.1-3.3C6.2,13.7,5.6,14.3,5,15
	c1.7,1.8,3.3,3.6,5,5.4c3.1-3.6,6.2-7.2,9.2-10.7c-0.6-0.7-1.2-1.3-1.7-2C15,10.6,12.5,13.5,10,16.4z"/>
                </svg>
        );
    }
}

export default TodaySVG;