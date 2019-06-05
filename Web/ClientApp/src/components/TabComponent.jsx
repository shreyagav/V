import React, { Component } from 'react';
import './TabComponent.css'

class TabComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let style = {}
        if (this.props.inheritParentHeight) {style = {'height': '100%'}}
        return (
            <ul className={'tab-component' + (this.props.inheritParentHeight ? " not-shrinkable-font" : "")} style={style}>
                {this.props.tabList.map((element, index) => 
                    <li 
                        tabIndex='0' key={index} 
                        className={index === this.props.activeTabIndex ? 'selected' : ''} 
                        onClick={() => this.props.wasSelected(index)}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                this.props.wasSelected(index)
                            }
                        }}
                    >
                        <p>{element}</p>
                    </li>
                )}
            </ul>
        );
    }
}

export default TabComponent;