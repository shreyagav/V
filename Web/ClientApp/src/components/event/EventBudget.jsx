//import { Route, Router, history } from 'react-router';
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG';
import EditUpSVG from '../../svg/EditUpSVG';
import Table from '../Table';
import Loader from '../Loader';
import Alert from '../Alert';
import { Service } from '../ApiService';

class EventBudget extends Component {
    static displayName = EventBudget.name;

    constructor(props) {
        super(props);
        this.state = {
            addingLine: false,
            budget: [],
            eventId: props.eventId,
            calculatedCost: 0,
            line: {}
        };
        this.addLine = this.addLine.bind(this);
        this.changeLineDescription = this.changeLineDescription.bind(this);
        this.changeLineName = this.changeLineName.bind(this);
        this.changeLineCost = this.changeLineCost.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.renderNameColumn = this.renderNameColumn.bind(this);
        this.editItem = this.editItem.bind(this);
    }
    componentDidMount() {
        this.setState({ loading: true });
        Service.getBudget(this.state.eventId)
            .then(data => this.setState({ budget: data, loading: false, calculatedCost: this.getCalculatedCost(data) }));
    }

    getCalculatedCost(all) {
        var cost = 0;
        all.forEach(a => cost += a.cost);
        return cost;
    }

    changeLineDescription(evt) {
        var line = this.state.line;
        line.description = evt.target.value;
        this.setState({ line: line });
    }

    changeLineName(evt) {
        var line = this.state.line;
        line.name = evt.target.value;
        this.setState({ line: line });
    }

    changeLineCost(evt) {
        var line = this.state.line;
        line.cost = evt.target.value;
        this.setState({ line: line });
    }
    addLine() {
        this.setState({ loading: true });
        var line = this.state.line;
        line["eventId"] = this.state.eventId;
        var thenFunc = (data) => this.setState({ loading: false, budget: data, line: {}, addingLine: false, calculatedCost: this.getCalculatedCost(data) });
        if (line.id === undefined) {
            Service.addBudgetLine(this.state.eventId, this.state.line)
                .then(thenFunc);
        } else {
            Service.updateBudgetLine(this.state.eventId, this.state.line)
                .then(thenFunc);
        }
    }

    removeItem(row) {
        this.setState({ loading: true });
        Service.deleteBudgetLine(this.state.eventId, row)
            .then(data => this.setState({ loading: false, budget: data, calculatedCost: this.getCalculatedCost(data) }));
    }

    editItem(row) {
        var line = Object.assign({}, row);
        this.setState({ line: line, addingLine: true });
    }

    renderNameColumn(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span style={{"flex":"1 1 auto"}} className="big-bold">{row['name']}</span>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.removeItem(row)}
                >
                    <CloseUpSVG />
                </button>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => this.editItem(row)}
                >
                    <EditUpSVG />
                </button>
            </li>
        );
    }

    render() {
        const budget = this.state.budget;
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
                                <td><input value={this.state.line.name} onChange={this.changeLineName} /></td>
                            </tr>
                            <tr>
                                <td>Description</td>
                            </tr>
                            <tr>
                                <td><input value={this.state.line.description} onChange={this.changeLineDescription} /></td>
                            </tr>
                            <tr>
                                <td>Cost</td>
                            </tr>
                            <tr>
                                <td><input value={this.state.line.cost} onChange={this.changeLineCost} /></td>
                            </tr>
                            <tr>
                                <td><button onClick={this.addLine}>Save</button></td>
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
                            <input value={this.state.calculatedCost} />
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
