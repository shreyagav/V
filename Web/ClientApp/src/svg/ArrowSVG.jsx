import React, { Component } from 'react';

class ArrowSVG extends React.Component {
    render() {
        return (
            <button className='grey-SVG-button' onClick = {this.props.onClick}>
                <svg className={'svg-container '+this.props.svgClassName} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 24" >
                    <polygon className='svg' points="0,12.9 0,11.1 11.2,0 13,1.8 2.7,12 13,22.2 11.2,24 "/>
                </svg>
            </button>
        );
    }
}

export default ArrowSVG;