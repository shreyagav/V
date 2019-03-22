import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import { withDropDownStore } from './DropDownStore';
import CloseSVG from '../svg/CloseSVG';

class DropDownHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.headerRef = null;
    }

    headerClickHandler(e) {
        if (e.target === this.headerRef){
            this.props.store.toggle();
        }
    }

    render() { 
        return (
            <div className='drop-down-header'>
                <ul ref={e => this.headerRef = e} onClick={(e) => this.headerClickHandler(e)}>
                    {this.props.store.filteredList.length > 0 && this.props.store.filteredList.map(element => 
                        <li key={element}>
                            <span>{element}</span>
                            <button onClick={() => this.props.store.unselect(element)}><CloseSVG /></button>
                        </li>
                    )}
                    {this.props.store.filteredList.length === 0 && 
                        <li className='inverted'><span>National</span></li>
                    }
                </ul>
                {this.props.toggleable &&
                    <button className='drop-down-header-button' onClick={() => this.props.store.toggle()} >
                        <ArrowUpSVG svgClassName={this.props.store.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                }
            </div>
        )
    }
}
export default withDropDownStore(DropDownHeader);