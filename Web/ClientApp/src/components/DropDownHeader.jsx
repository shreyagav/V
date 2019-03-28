import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import { withDropDownStore } from './DropDownStore';
import CloseSVG from '../svg/CloseSVG';

class DropDownHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.headerRef = null;
        this.dropDownHeaderRef = null;
    }

    headerClickHandler(e) {
        if (e.target === this.headerRef){
            this.props.store.toggle();
        }
    }

    headerKeyDownHandler(e, element){
        switch (e.keyCode){
            case 13: //enter
                if(e.target.className === 'unselectButton'){this.props.store.unselect(e, element);}
                if(e.target.className === 'drop-down-header'){this.props.store.toggle();}
                this.dropDownHeaderRef.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.props.store.toggle();
                    this.dropDownHeaderRef.focus();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.props.store.toggle();}
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.props.store.toggle();}
                break;
            default: break;
        }
    }

    render() {
        let style = {};
        if (this.props.toggleable){
            if(this.props.store.isOpen){
                style = {"border":"1px solid #0099cc"};
            }
        }
        else {
            style = {"border":"0px solid"};
        }
        return (
            <div
                ref={el => this.dropDownHeaderRef = el}
                tabIndex={this.props.toggleable ? '0':'-1'} 
                className='drop-down-header' 
                style={style}
                onClick={() => this.props.store.toggle()}
                onKeyDown={(e) => this.headerKeyDownHandler(e)}
            >
                <ul ref={e => this.headerRef = e} onClick={(e) => this.headerClickHandler(e)}>
                    {this.props.store.filteredList.length > 0 && this.props.store.filteredList.map(element => 
                        <li key={element}>
                            <span>{element}</span>
                            <button className='unselectButton'
                                onClick={(e) => this.props.store.unselect(e, element)}
                                onKeyDown={(e) => this.headerKeyDownHandler(e, element)}
                                //onKeyDown={(e) => {if(e.keyDown === 13){this.props.store.unselect(e, element); this.dropDownHeaderRef.focus();}}}
                            >
                                <CloseSVG /></button>
                        </li>
                    )}
                    {this.props.store.filteredList.length === 0 && 
                        <li className='inverted'><span>National</span></li>
                    }
                </ul>
                {this.props.toggleable &&
                    <button disabled className='drop-down-header-button' >
                        <ArrowUpSVG svgClassName={this.props.store.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                }
            </div>
        )
    }
}
export default withDropDownStore(DropDownHeader);