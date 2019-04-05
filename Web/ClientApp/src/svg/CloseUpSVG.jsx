import React, { Component } from 'react';

class CloseUpSVG extends React.Component {
    render() {
        return (
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24" >
                    <polygon className='svg' points="24.1,1.8 22.3,0 12,10.2 1.7,0 -0.1,1.8 10.2,12 -0.1,22.2 1.7,24 12,13.8 22.3,24 24.1,22.2 13.8,12 "/>
                </svg>
        );
    }
}

export default CloseUpSVG;