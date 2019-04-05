import React, { Component } from 'react';

class ArrowSVG extends React.Component {
    render() {
        return (
            <button className='grey-SVG-button' onClick = {this.props.onClick}>
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24" >
                    <polygon className='svg' points="5.5,12.9 5.5,11.1 16.7,0 18.5,1.8 8.2,12 18.5,22.2 16.7,24 "/>
                </svg>
            </button>
        );
    }
}

export default ArrowSVG;