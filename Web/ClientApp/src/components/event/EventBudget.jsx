//import { Route, Router, history } from 'react-router';
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG';
import EditUpSVG from '../../svg/EditUpSVG';
import Table from '../Table';
import Loader from '../Loader';
import Alert from '../Alert';
import TimePicker from '../TimePicker';
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
            line: {
                name: '',
                description: '',
                price: 0,
                cost: 0,
                amount: 1,
            }
        };
        this.emptyName = false;
        this.addLine = this.addLine.bind(this);
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

    changeLineProperty(property, value){
        var line = this.state.line;
        line[property] = value;
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

    addLineValidationPassed() {
        let validationPassed = true;
        if (this.state.line.name && this.state.line.name !== '') {
            this.emptyName = true;
            validationPassed = false;
        }
        return validationPassed;
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
                    {this.state.addingLine && 
                        <Alert
                            headerText='Add Item'
                            showOkButton = {true}
                            buttonText = "Save"
                            onOkButtonClick = {() => {
                                if(this.addLineValidationPassed){
                                    this.addLine()
                                }
                            }}
                            onClose={() => this.setState({ addingLine: false })}
                            setFocusTo={this.firstInputRef}
                        >
                            <ul className='input-fields first-child-text-110 mt-1 mb-1'>
                                <li className={this.emptyName ? 'mark-invalid' : ''} error-text='Please enter Item Name'>
                                    <p>Name:</p>
                                    <div className='input-button-wrapper'>
                                        <input 
                                            ref = {el => this.firstInputRef = el}
                                            type='text' 
                                            placeholder='Event Title'
                                            value={this.state.line.name}
                                            onChange={(e) => {
                                                this.emptyName = false;
                                                this.changeLineProperty('name', e.target.value)}
                                            }
                                        />
                                        {this.state.line.name && this.state.line.name !== "" &&
                                            <button onClick={() => {
                                                this.emptyName = true;
                                                this.changeLineProperty('name', '')}
                                            }>
                                                <CloseUpSVG />
                                            </button>
                                        }
                                    </div>
                                </li>
                                <li>
                                    <p>Description:</p>
                                    <div className='input-button-wrapper'>
                                        <input type='text' 
                                            placeholder='Description'
                                            value={this.state.line.description}
                                            onChange={(e) => this.changeLineProperty('description', e.target.value)}
                                        />
                                        {this.state.line.description && this.state.line.description !== "" &&
                                            <button onClick={() => this.changeLineProperty('description', '')}>
                                                <CloseUpSVG />
                                            </button>
                                        }
                                    </div>
                                </li>
                                <li className={this.emptyName ? 'mark-invalid' : ''} error-text='Please enter Item Name'>
                                    <p>Price:</p>
                                    <div className='input-button-wrapper'>
                                        <input type='number' 
                                            placeholder='$'
                                            value={this.state.line.price > 0 ? this.state.line.price : ""}
                                            onChange={(e) => {
                                                this.emptyName = false;
                                                this.changeLineProperty('price', e.target.value)}
                                            }
                                        />
                                        {this.state.line.price > 0 &&
                                            <button onClick={() => this.changeLineProperty('price', 0)}>
                                                <CloseUpSVG />
                                            </button>
                                        }
                                    </div>
                                </li>
                                <li>
                                    <p>Amount:</p>
                                    <ul className='input-fields-child-ul justify-space-between flex-wrap'>
                                        <li style={{"flex": "1 1 auto", "maxWidth":"100px", "marginRight":"1em"}}>
                                            <div className='input-button-wrapper'>
                                                <input type='number' 
                                                    placeholder='Amount'
                                                    value={this.state.line.amount}
                                                    onChange={(e) => this.changeLineProperty('amount', e.target.value)}
                                                />
                                                {this.state.line.amount > 1 &&
                                                    <button onClick={() => this.changeLineProperty('amount', 1)}>
                                                        <CloseUpSVG />
                                                    </button>
                                                }
                                            </div>
                                        </li>
                                        {this.state.line.price > 0 && this.state.line.amount > 0 && 
                                            <li style={{"flex": "0 0 auto"}}>
                                                <p style={{"marginRight":"0em"}}>Total: ${(this.state.line.price * this.state.line.amount).toFixed(2)}</p>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </Alert>
                    }
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
