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

    componentWillMount() {
        this.props.dropDownStore.set("value", this.props.defaultValue);
      }

    componentDidMount(){
        this.props.dropDownStore.set('dropDownHeaderRef', this.dropDownHeaderRef);
    }

    headerClickHandler(e) {
        if (e.target === this.headerRef){
            this.props.dropDownStore.toggle();
        }
    }

    headerKeyDownHandler(e, element){
        switch (e.keyCode){
            case 13: //enter
                if(e.target.className === 'unselectButton'){this.props.dropDownStore.unselect(e, element);}
                if(e.target.className === 'drop-down-header'){this.props.dropDownStore.toggle();}
                this.dropDownHeaderRef.focus();
                break;
            case 27://ESC
                if(this.state.isOpen){
                    this.props.dropDownStore.toggle();
                    this.dropDownHeaderRef.focus();
                }
                break;
            case 38: //Up Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.props.dropDownStore.toggle();}
                break;
            case 40: //Down Arrow
                e.preventDefault();
                if(!this.state.isOpen){this.props.dropDownStore.toggle();}
                break;
            default: break;
        }
    }

    render() {
        const setStyle = () => {
            if (this.props.toggleable){
                if(this.props.dropDownStore.isOpen){return {"border":"1px solid #0099cc"}}
            }
            else return {"border":"0px solid"}
        }
        let style = setStyle();

        return (
            <div
                ref={el => this.dropDownHeaderRef = el}
                tabIndex={this.props.toggleable ? '0':'-1'} 
                className='drop-down-header'
                style={style}
                onClick={() => this.props.dropDownStore.toggle()}
                onKeyDown={(e) => this.headerKeyDownHandler(e)}
            >
                <ul 
                    ref={e => this.headerRef = e} 
                    onClick={(e) => this.headerClickHandler(e)}
                    className={this.props.dropDownStore.multiLevelList ? "multi-level-list" : "simple-list"}
                >
                        {this.props.dropDownStore.filteredList.length > 0 && this.props.dropDownStore.filteredList.map(element => 
                            <li key={element}>
                                <span>{element}</span>
                                <button className='unselectButton'
                                    onClick={(e) => this.props.dropDownStore.unselect(e, element)}
                                    onKeyDown={(e) => this.headerKeyDownHandler(e, element)}
                                >
                                    <CloseSVG />
                                </button>
                            </li>
                        )}
                        {this.props.dropDownStore.filteredList.length === 0 && 
                            <li className={this.props.dropDownStore.multiLevelList ? 'inverted' : ''}>
                                {this.props.dropDownStore.value && this.props.dropDownStore.value.color !== undefined && 
                                    <span className='colorIndicator' style={(this.props.doNotShowName !== true) ? {"backgroundColor": this.props.dropDownStore.value.color, "marginRight":"0.5rem"} : {"backgroundColor": this.props.dropDownStore.value.color}}></span>
                                }
                                {this.props.dropDownStore.value && this.props.dropDownStore.value.img && 
                                    <span className='drop-down-icon'>{this.props.dropDownStore.value.img}</span>
                                }
                                {this.props.dropDownStore.value
                                ?
                                    (this.props.doNotShowName !== true) && (
                                        this.props.showParameter 
                                        ? 
                                        <span>{this.props.dropDownStore.value[this.props.showParameter]}</span>
                                        :
                                        <span>{this.props.dropDownStore.value.name}</span>
                                    )
                                :
                                <span style={{"fontStyle":"italic","textTransform":"none","fontWeight":"400", "color":"#999999"}}>{this.props.placeholder}</span>
                                }
                            </li>
                        }
                </ul>
                {this.props.toggleable &&
                    <button disabled className='arrow-button' >
                        <ArrowUpSVG svgClassName={this.props.dropDownStore.isOpen ? 'flip90' : 'flip270'}/>
                    </button>
                }
            </div>
        )
    }
}
export default withDropDownStore(DropDownHeader);