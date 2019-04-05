import React, { Component } from 'react';
import './TabComponent.css'

class TabComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            update: true,
        };
        this.longestLiIndex = 0;
        this.longestliRef = null;
        this.flex = {};
    }

    componentWillReceiveProps(props){
        if(props.activeTabIndex !== undefined) {
            this.setState({selected: props.activeTabIndex});
        }
    }

    componentWillMount(){
        let maxLength = 0;
        let index = 0;
        for (let i=0; i < this.props.tabList.length; i++) {
            if (this.props.tabList[i].length > maxLength) { 
                maxLength = this.props.tabList[i].length;
                index = i;
            }
        }
        this.longestLiIndex = index;
    }

    /*componentDidMount(){
        console.log(this.props.tabEqualWidth);
        if (this.props.tabEqualWidth){
            if(this.longestliRef !== undefined){
                this.flex = {'flex' : "1 1 "+this.longestliRef.getBoundingClientRect().width+"px"};
            }
            /* update 1 time to make all elements the same width */
            /*if (this.state.update) {this.setState(() => ({update: false}))};
        }
    }*/

    render() {
        const setStyle = () => {
            if (this.props.inheritParentHeight) {return {'height': '100%'}}
            else return {}
        }
        const style = setStyle();
        return (
            <ul className={'tab-component' + (this.props.inheritParentHeight ? " not-shrinkable-font" : "")} style={style}>
                <li ref={e => this.longestliRef = e}>
                        {this.props.tabList[this.longestLiIndex]}
                </li>
                {this.props.tabList.map((element, index) => 
                    <li 
                        ref={e => {if(index === this.longestLiIndex){this.longestliRef = e}}} 
                        /*style={this.flex}*/
                        tabIndex='0' 
                        key={index} 
                        className={index === this.state.selected ? 'selected' : ''} 
                        onClick={() => {this.setState({selected: index}); this.props.wasSelected(index)}}
                        onKeyDown={(e) => {if (e.keyCode === 13) {this.setState({selected: index}); this.props.wasSelected(index)}}}
                    >
                        <p>{element}</p>
                    </li>
                )}
            </ul>
        );
    }
}

export default TabComponent;