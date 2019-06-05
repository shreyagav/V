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
        this.renderCostColumn = this.renderCostColumn.bind(this);
        this.editItem = this.editItem.bind(this);
        this.addLineValidationPassed = this.addLineValidationPassed.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        Service.getBudget(this.state.eventId)
            .then(data => this.setState({ budget: data, loading: false, calculatedCost: this.getCalculatedCost(data) }, console.log(this.state)));
    }

    getCalculatedCost(all) {
        var cost = 0;
        all.forEach(a => {
            cost += (a.cost * a.quantity)
        });
        cost = cost.toFixed(2);
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
                <div style={{"flex":"1 1 auto"}}>
                    <span className="big-bold">{row['name']+', '}</span>
                    <span style={{"color":"#0099cc"}} className="big-bold">{row['quantity']}</span>
                </div>
                {this.props.editsPermitted !== false &&
                    <button 
                        className='round-button small-round-button light-grey-outline-button' 
                        style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                        onClick={() => {
                            this.setState({removingLine: true, line:row})}}//added line:row to define which line is going to be removed
                    >
                        <CloseUpSVG />
                    </button>
                }
                {this.props.editsPermitted !== false &&
                    <button 
                        className='round-button small-round-button light-grey-outline-button' 
                        style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                        onClick={() => this.editItem(row)}
                    >
                        <EditUpSVG />
                    </button>
                }
            </li>
        );
    }

    renderTotalColumn(value, row, index, col) {
        return (
            <li key={index} className="table-content">
                <span className='hideIfWiderThan500 table-mini-header'> {"Total: "}</span>
                <span className='bold-text'>{'$' + (row['cost'] * row['quantity']).toFixed(2)}</span>
            </li>
        );
    }

    renderCostColumn(value, row, index, col) {
        return (
            <li key={index} className="table-content">
                <span className='hideIfWiderThan500 table-mini-header'> {"Cost: "}</span>
                <span className='bold-text'>{'$' + row['cost'].toFixed(2)}</span>
            </li>
        );
    }

    addLineValidationPassed() {
        let validationPassed = true;
        if (this.state.line.name === '' || this.state.line.name === null || this.state.line.name === undefined) {
            this.emptyName = true;
            validationPassed = false;
        }
        return validationPassed;
    }

    render() {
        console.log("this.props.projectedCost");
        console.log(this.props);
        const budget = this.state.budget;
        const columns=[
            {title:"Name", accesor:"name", className:"borders-when-display-block", render: this.renderNameColumn},
            {title:"Description", accesor:"description", className:"italic"},
            {title:"Cost", accesor:"cost", render: this.renderCostColumn},
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
                            <ul className='input-fields first-child-text-110 mt-1'>
                                <li className={this.emptyName === true ? 'mark-invalid' : ''} error-text='Please enter Item Name'>
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
                                        <textarea 
                                            placeholder='Description'
                                            value={this.state.line.description ? this.state.line.description : ""}
                                            onChange={(e) => this.changeLineProperty('description', e.target.value)}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <p>Cost:</p>
                                    <div className='input-button-wrapper currency-input-wrapper'>
                                        <input type='number'
                                            value={this.state.line.cost > 0 ? this.state.line.cost : ""}
                                            onChange={(e) => {
                                                this.emptyName = false;
                                                let cost = Math.floor(e.target.value*100)/100;
                                                this.changeLineProperty('cost', cost);
                                            }}
                                        />
                                        {this.state.line.cost > 0 &&
                                            <button onClick={() => this.changeLineProperty('cost', 0)}>
                                                <CloseUpSVG />
                                            </button>
                                        }
                                    </div>
                                </li>
                                <li>
                                    <p>Quantity:</p>
                                    <ul className='input-fields-child-ul justify-space-between flex-wrap'>
                                        <li style={{"flex": "1 1 auto", "maxWidth":"100px", "marginRight":"1em"}}>
                                            <div className='input-button-wrapper'>
                                                <input type='number' min={1}
                                                    placeholder='#'
                                                    value={this.state.line.quantity ? this.state.line.quantity : 1}
                                                    onClick={(event) => event.target.select()}
                                                    onChange={(e) => {
                                                        let quantity = Math.floor(e.target.value);
                                                        this.changeLineProperty('quantity', quantity)}}
                                                />
                                                {this.state.line.quantity > 1 &&
                                                    <button onClick={() => this.changeLineProperty('quantity', 1)}>
                                                        <CloseUpSVG />
                                                    </button>
                                                }
                                            </div>
                                        </li>
                                        {this.state.line.cost > 0 && this.state.line.quantity > 0 && 
                                            <li style={{"flex": "0 0 auto"}}>
                                                <p style={{"marginRight":"0em"}}>Total: ${(this.state.line.cost * this.state.line.quantity).toFixed(2)}</p>
                                            </li>
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </Alert>
                    }

                    {this.state.removingLine && 
                        <Alert
                            headerText = 'Delete'
                            text = 'Are you sure you want to delete this item?'
                            onClose = {()=>this.setState({removingLine: false,line:{}})}//added line:null
                            mode = 'warning'
                            showOkCancelButtons = {true}
                            onCancelButtonClick = {() => this.setState({removingLine: false, line:{}})}//added line:null
                            onOkButtonClick = {() => this.removeItem()}//removed row from the parameter b/c here it wasn't row it was event
                        >   
                            <h4 className='mb-05'>{this.state.line.name}</h4>
                            {this.state.line.description && this.state.line.description.length > 0 && 
                                <p className='italic mb-1' style={{"textAlign":"center"}}>
                                    {this.state.line.description}
                                </p>
                            }
                            <ul className='flex-wrap justify-center'>
                                {this.state.line.cost > 0 &&
                                    <li className='flex-nowrap mr-05 ml-05 mb-05'>
                                        <p className='uppercase-text pr-05'>Price: </p>
                                        <span className='bold-text'><strong>{'$'+ this.state.line.cost}</strong></span>
                                    </li>
                                }
                                <li className='flex-nowrap mr-05 ml-05 mb-05'>
                                    <p className='uppercase-text pr-05'>Number: </p>
                                    <span className='bold-text'><strong>{this.state.line.quantity}</strong></span>
                                </li>
                                {this.state.line.quantity > 1 &&
                                    <li className='flex-nowrap mr-05 ml-05 mb-05'>
                                        <p className='uppercase-text pr-05'>Total: </p>
                                        <span className='bold-text'><strong>{'$'+(this.state.line.cost * this.state.line.quantity).toFixed(2)}</strong></span>
                                    </li>
                                }
                            </ul>
                        </Alert>
                    }

                    <ul className='input-fields first-child-text-240 mb-1 pl-1 pr-1'>
                        {(!(this.props.editsPermitted === false && this.props.projectedCost === 0) || this.props.projectedCost > 0 ) &&
                            <li className='number-field'>
                                <p className='input-label'>Entered Projected Cost:</p>
                                <div className='input-button-wrapper currency-input-wrapper'>
                                    <input 
                                        readOnly= {this.props.editsPermitted === false ? true : false} 
                                        type='number' 
                                        value={this.props.projectedCost} 
                                        onChange={(e) => {
                                            let cost = Math.floor(e.target.value*100)/100;
                                            this.props.onProjectedCostChange(cost);
                                        }}
                                    />
                                </div>
                            </li>
                        }
                        {budget.length > 0 &&
                            <li className='number-field'>
                                <p className='input-label'>Calculated Projected Cost:</p>
                                <input readOnly={true} placeholder='$' type='text' value={'$' + this.state.calculatedCost} />
                            </li>
                        }
                    </ul>
                    {(budget.length === 0 || budget.length === undefined ) &&
                        <p className='message-block mb-2'>There are no items yet. Add Items to the list to calculate event's budget.</p>
                    }
                    {this.props.editsPermitted !== false && 
                        <div className="flex-wrap align-center justify-center mb-2">
                            <p className='input-label'>ADD NEW ITEM:</p>
                            <button className='big-static-button static-button' onClick={() => this.setState({ addingLine:true, headerText: 'Add Item'})} >Add Item</button>
                        </div>
                    }
                    {budget.length > 0 &&
                        <Table columns={columns} data={budget} addHeadersForNarrowScreen={true}/>
                    }
                </div>
            );
    }
}

export default withStore(EventBudget)
