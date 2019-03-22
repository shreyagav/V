import React, { Component } from 'react';
import ArrowUpSVG from '../svg/ArrowUpSVG';
import DropDownList from './DropDownList';
import { createDropDownStore } from './DropDownStore';
import './DropDown.css'
import DropDownHeader from './DropDownHeader';

class DropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    render() {
        return (
            <div className='drop-down'>
                <DropDownHeader 
                    toggle = {()=> this.toggle()}
                    toggleable = {true}
                />
                <DropDownList toggleable = {true}/>
            </div>
        )
    }
}
export default createDropDownStore(DropDown);