import React, { Component } from 'react';

class CalendarSVG extends React.Component {
    render() {
        return (
            <div className='round-button big-round-button grey-outline-button'>
                <svg
                    style={{'height' : '100%'}} 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    x="0px" y="0px" viewBox="0 0 25 25" 
                >
                    <path className="svg" d="M23.4,0H1.6C0.7,0,0,0.8,0,1.7v21.5c0,1,0.7,1.7,1.6,1.7h19l4.4-4.8V1.7C25,0.8,24.3,0,23.4,0z M1.6,23.5
		c0,0-0.1-0.1-0.1-0.2V4.5h22v15.2l0,0h-2.2c-0.8,0-1.5,0.7-1.5,1.5v2.3L1.6,23.5z M6.6,12.3H4V9.6h2.6V12.3z M6.6,15.8H4v-2.6h2.6
		V15.8z M6.6,19.3H4v-2.6h2.6V19.3z M7.6,9.6h2.6v2.6H7.6V9.6z M7.6,13.2h2.6v2.6H7.6V13.2z M7.6,16.7h2.6v2.6H7.6V16.7z M7.6,6.1
		h2.6v2.6H7.6V6.1z M11.2,9.6h2.6v2.6h-2.6V9.6z M11.2,13.2h2.6v2.6h-2.6V13.2z M11.2,16.7h2.6v2.6h-2.6V16.7z M11.2,6.1h2.6v2.6
		h-2.6V6.1z M14.8,9.6h2.6v2.6h-2.6V9.6z M14.8,13.2h2.6v2.6h-2.6V13.2z M14.8,16.7h2.6v2.6h-2.6V16.7z M14.8,6.1h2.6v2.6h-2.6V6.1z
		 M21,12.3h-2.6V9.6H21V12.3z M21,15.8h-2.6v-2.6H21V15.8z M21,19.3h-2.6v-2.6H21V19.3z M21,8.7h-2.6V6.1H21V8.7z M4,20.7h6.2v1.3H4
		V20.7z"/>
                </svg>
            </div>
        );
    }
}

export default CalendarSVG;