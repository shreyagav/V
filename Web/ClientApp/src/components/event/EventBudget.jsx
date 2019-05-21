//import { Route, Router, history } from 'react-router';
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG';
import EditUpSVG from '../../svg/EditUpSVG';
import Table from '../Table';
import Loader from '../Loader';
import Alert from '../Alert';

class EventBudget extends Component {
    static displayName = EventBudget.name;

    constructor(props) {
        super(props);
        this.state = {
            addingLine: false,
            line: {}
        };
    }

    removeItem(){
        alert("remove Item")
    }

    editItem(){
        alert("edit item");
    }

    renderNameColumn(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span style={{"flex":"1 1 auto"}} className="big-bold">{row['name']}</span>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.removeItem()}
                >
                    <CloseUpSVG />
                </button>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.editItem()}
                >
                    <EditUpSVG />
                </button>
            </li>
        );
    }

    render() {
        const budget = this.props.budget;
        const columns=[
            {title:"Name", accesor:"name", className:"borders-when-display-block", render: this.renderNameColumn},
            {title:"Description", accesor:"description"},
            {title:"Cost", accesor:"cost"}
        ];
            return (
                <div style={{ "width": "100%", "maxWidth": "600px" }}>
                    {this.state.loading && <Loader />}
                    {this.state.addingLine && <Alert
                        headerText='Add existing members'
                        onClose={() => this.setState({ addingLine: false })}
                    >
                        <table>
                            <tr>
                                <td>Name</td>
                            </tr>
                            <tr>
                                <td><input value={this.state.line.name} /></td>
                            </tr>
                            <tr>
                                <td>Description</td>
                            </tr>
                            <tr>
                                <td><input value={this.state.line.description} /></td>
                            </tr>
                            <tr>
                                <td>Cost</td>
                            </tr>
                            <tr>
                                <td><input value={this.state.line.cost} /></td>
                            </tr>
                        </table>
                    </Alert>}
                    <ul className='input-fields first-child-text-240 mt-3 mb-1 pl-1 pr-1'>
                        <li className='number-field'>
                            <p className='input-label'>Entered Projected Cost:</p>
                            <input value={this.props.projectedCost} />
                        </li>
                        <li className='number-field'>
                            <p className='input-label'>Calculated Projected Cost:</p>
                            <input />
                        </li>
                    </ul>
                    <div className="flex-wrap align-center justify-center mb-2">
                        <p className='input-label'>ADD NEW ITEM:</p>
                        <button className='big-static-button static-button' onClick={() => this.setState({ addingLine:true})} >Add Item</button>
                    </div>
                    <Table columns={columns} data={budget} />
                </div>
            );
    }
}

export default withStore(EventBudget)
