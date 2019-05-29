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
            removingLine: false,
            budget: [],
            eventId: props.eventId,
            calculatedCost: 0,
            line: {},
            headerText: '',
        };
        this.emptyName = false;
        this.addLine = this.addLine.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.renderNameColumn = this.renderNameColumn.bind(this);
        this.editItem = this.editItem.bind(this);
        this.addLineValidationPassed = this.addLineValidationPassed.bind(this);
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
        debugger
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

    removeItem() {//removed parameter b/c now line to delete is state.line
        this.setState({ loading: true });
        Service.deleteBudgetLine(this.state.eventId, this.state.line)
            .then(data => this.setState({ loading: false,line:{}, removingLine: false, budget: data, calculatedCost: this.getCalculatedCost(data) }));
    }

    editItem(row) {
        var line = Object.assign({}, row);
        this.setState({ line: line, addingLine: true, headerText: 'Edit Item' });
    }

    renderNameColumn(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                <span style={{"flex":"1 1 auto"}} className="big-bold">{row['name']+' '+ <strong>row["quantity"]</strong>}</span>
                <button 
                    className='round-button small-round-button light-grey-outline-button' 
                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                    onClick={() => {
                        this.setState({removingLine: true, line:row})}}//added line:row to define which line is going to be removed
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

    renderTotalColumn(value, row, index, col) {
        return (
            <li key={index} className="table-content">
                <span>{
                    (row['price'] * row['quantity']).toFixed(2)
                }</span>
            </li>
        );
    }

    addLineValidationPassed() {
        let validationPassed = true;
        if (this.state.line.name === '') {
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
            {title:"Price", accesor:"price"},
            {title:"Total", accesor:"quantity", render: this.renderTotalColumn}
        ];
            return (
                <div style={{ "width": "100%", "maxWidth": "600px" }}>
                    {this.state.loading && <Loader />}
                    {this.state.addingLine && 
                        <Alert
                            headerText={this.state.headerText}
                            showOkButton = {true}
                            buttonText = "Save"
                            onOkButtonClick = {() => {
                                if(this.addLineValidationPassed()){
                                    this.addLine()
                                } else {this.forceUpdate();}
                            }}
                            onClose={() => this.setState({ addingLine: false })}
                        >
                            <ul className='input-fields first-child-text-110 mt-1 mb-1'>
                                <li className={this.emptyName ? 'mark-invalid' : ''} error-text='Please enter Item Name'>
                                    <p>Name:</p>
                                    <div className='input-button-wrapper'>
                                        <input 
                                            type='text' 
                                            placeholder='Event Title'
                                            value={this.state.line.name}
                                            onChange={(e) => {
                                                this.emptyName = false;
                                                this.changeLineProperty('name', e.target.value)}
                                            }
                                        />
                                        {this.state.line.name && this.state.line.name !== "" &&
                                            <button onClick={() => this.changeLineProperty('name', '')}>
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
                                <li>
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
                                                    placeholder='#'
                                                    value={this.state.line.quantiti}
                                                    onClick={(event) => event.target.select()}
                                                    onChange={(e) => this.changeLineProperty('quantity', e.target.value)}
                                                />
                                                {this.state.line.quantity > 1 &&
                                                    <button onClick={() => this.changeLineProperty('quantity', 1)}>
                                                        <CloseUpSVG />
                                                    </button>
                                                }
                                            </div>
                                        </li>
                                        {this.state.line.price > 0 && this.state.line.quantity > 0 && 
                                            <li style={{"flex": "0 0 auto"}}>
                                                <p style={{"marginRight":"0em"}}>Total: ${(this.state.line.price * this.state.line.quantity).toFixed(2)}</p>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </Alert>
                    }

                    {this.state.removingLine && 
                        <Alert
                            upperText = 'Are you sure you want to delete this item?'
                            headerText = {this.state.line.name}
                            onClose = {()=>this.setState({removingLine: false,line:{}})}//added line:null
                            mode = 'warning'
                            showOkCancelButtons = {true}
                            onCancelButtonClick = {() => this.setState({removingLine: false, line:{}})}//added line:null
                            onOkButtonClick = {() => this.removeItem()}//removed row from the parameter b/c here it wasn't row it was event
                        >
                            {this.state.line.description.length > 0 && 
                                <p className='italic mb-2' style={{"textAlign":"center"}}>
                                    {this.state.line.description}
                                </p>
                            }
                            <ul className='flex-wrap justify-space-between mt-1'>
                                {this.state.line.proce > 0 &&
                                    <li className='flex-nowrap mr-1 mb-1'>
                                        <p className='uppercase-text bold-text pr-05'>Price: </p>
                                        <span>{'$'+ this.state.line.price}</span>
                                    </li>
                                }
                                <li className='flex-nowrap mr-1 mb-1'>
                                    <p className='uppercase-text bold-text pr-05'>Amount: </p>
                                    <span>{this.state.line.quantity}</span>
                                </li>
                                {this.state.line.quantity > 1 &&
                                    <li className='flex-nowrap mb-1'>
                                        <p className='uppercase-text bold-text pr-05'>Total: </p>
                                        <span>{(this.state.line.price * this.state.line.quantity).toFixed(2)}</span>
                                    </li>
                                }
                            </ul>
                        </Alert>
                    }

                    <ul className='input-fields first-child-text-240 mt-3 mb-1 pl-1 pr-1'>
                        <li className='number-field'>
                            <p className='input-label'>Enter Projected Cost:</p>
                            <input type='number' placeholder='$' value={this.props.projectedCost} />
                        </li>
                        {(budget.length === 0 || budget.length === undefined )&&
                            <span className='text-center text-transform-none'>Add Items one by one, to create a list which can help calculate event's budget</span>
                        }
                        {budget.length > 0 &&
                            <li className='number-field'>
                                <p className='input-label'>Calculated Projected Cost:</p>
                                <input readOnly={true} placeholder='$' type='number' value={this.state.calculatedCost} />
                            </li>
                        }
                    </ul>
                    <div className="flex-wrap align-center justify-center mb-2">
                        <p className='input-label'>ADD NEW ITEM:</p>
                        <button className='big-static-button static-button' onClick={() => this.setState({ addingLine:true, headerText: 'Add Item'})} >Add Item</button>
                    </div>
                    {budget.length > 0 &&
                        <Table columns={columns} data={budget} />
                    }
                </div>
            );
    }
}

export default withStore(EventBudget)
