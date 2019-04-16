//import { Route, Router, history } from 'react-router';
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG';

class EventBudget extends Component {
    static displayName = EventBudget.name;

    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId,
            budget: [],
            loadData: false
        };
    }
    componentDidMount() {
        var component = this;
        this.setState({ loadData: true });
        fetch('/Budget.json')
            .then(function (data) { return data.json(); })
            .then(function (jjson) {
                component.setState({ budget: jjson, loadData: false });
            });
    }
    componentWillUnmount() {
        fetch('/Budget.json');
    }

    render() {
        if (this.state.loadData) {
            return (<p>Loading</p>);
        } else
            return (
                <div style={{ "width": "100%", "maxWidth": "600px" }}>

                    <ul className='input-fields first-child-text-240 mt-3 mb-1 pl-1 pr-1'>
                        <li className='number-field'>
                            <p className='input-label'>Entered Projected Cost:</p>
                            <input />
                        </li>
                        <li className='number-field'>
                            <p className='input-label'>Calculated Projected Cost:</p>
                            <input />
                        </li>
                    </ul>
                    <div className="flex-wrap align-center justify-center">
                        <p className='input-label'>ADD NEW ITEM:</p>
                        <button disabled className='big-static-button static-button' >Add Item</button>
                    </div>
                    <ul className='table-element mt-2 mb-2'>
                        <li>
                            <ul className='table-element-header table-element-member table-budget'>
                                <li>Name</li>
                                <li>Description</li>
                                <li>Cost</li>
                                <li></li>
                            </ul>
                        </li>
                        {
                            this.state.budget.map((element, index) =>
                                <ul key={index} className='table-element-content table-element-member table-budget'>
                                    <li >{element.name}</li>
                                    <li >{element.description}</li>
                                    <li >{element.cost}</li>
                                    <li className='no-padding'>
                                        <button disabled className='square-button-width'>
                                            <CloseUpSVG svgClassName='flip90' />
                                        </button>
                                    </li>
                                </ul>
                            )
                        }
                    </ul>
                </div>

            );
    }
}

export default withStore(EventBudget)
