import React, { Component } from 'react';
import Table from '../Table';
import Alert from '../Alert';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import { withStore } from '../store';
import CloseUpSVG from '../../svg/CloseUpSVG';
import EditUpSVG from '../../svg/EditUpSVG';
import { Service } from '../ApiService';
import FixedWrapper from '../FixedWrapper'

class MemberOptions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddEditOption: false,
            removeOptionShowAlert: false,
            alertContent: {
                categoryId: null,
                optionId: null,
                description: ''
            },
            options: [],
            optionsList: []
        }
        this.alertDafaultContent = {categoryId: null, optionId: null, description: ''};
        this.renderOption = this.renderOption.bind(this);
        this.renderCategory = this.renderCategory.bind(this);
        this.onAddOption = this.onAddOption.bind(this);
        this.onEditOption = this.onEditOption.bind(this);
        this.okButtonCallBack = this.okButtonCallBack.bind(this);
        this.onDeleteOption = this.onDeleteOption.bind(this);
        this.renderComments = this.renderComments.bind(this);

        this.okButtonText = 'OK';
        this.modalHeader = 'Header';
        this.elementToEdit = null;
        this.elementToRemoveProps = {
            categoryName: '',
            optionName: '',
            optionDescription: '',
            description: ''
        }
    }

    componentDidMount() {
        Service.getOptionList().then(allOptions => {
            Service.getUserOptions(this.props.member.id).then(userOptions => {
                this.setState({ optionsList: allOptions, options: userOptions });
            })
        });
    }

    okButtonCallBack = () => {};

    onEditOption(){
        //let options = this.state.options;
        //let element = options.find(element => element.categoryId === this.elementToEdit.categoryId && element.optionId === this.elementToEdit.optionId && element.description === this.elementToEdit.description);
        //element.categoryId = this.state.alertContent.categoryId;
        //element.optionId = this.state.alertContent.optionId;
        //element.description === this.state.alertContent.description;
        
        //this.setState({ options: options, showAddEditOption: false });

        Service.editUserOption(this.props.member.id, this.state.alertContent)
            .then(userOptions => this.setState({ options: userOptions, showAddEditOption: false }));
        this.elementToEdit = null;
    }

    onDeleteOption(row){
        this.elementToEdit = row;
        let el = this.state.optionsList.find(element => element.categoryId === row.categoryId);
        this.elementToRemoveProps.categoryName = el.categoryName;
        this.elementToRemoveProps.description = row.description;
        let option = el.options.find(element => element.id === row.optionId);
        this.elementToRemoveProps.optionName = option.name;
        this.elementToRemoveProps.optionDescription = option.description;
        this.setState({removeOptionShowAlert: true})
    }

    removeOption() {
        //TODO: handle loading
        Service.deleteUserOption(this.props.member.id, this.elementToEdit)
            .then(userOptions => this.setState({ options: userOptions, removeOptionShowAlert: false }));
        //let index = this.state.options.findIndex(element => element.categoryId === this.elementToEdit.categoryId && element.optionId === this.elementToEdit.optionId && element.description === this.elementToEdit.description);
        //let array1 = this.state.options.slice(0, index);
        //let array2 = this.state.options.slice(index+1);
        //let options = array1.concat(array2);
        //this.elementToEdit = null;
        //this.setState({options: options, removeOptionShowAlert: false});
    }

    renderOption(value, row, index, col){
        let category = this.state.optionsList.find(element => element.categoryId === row.categoryId);
        let option = category.options.find(element => element.id === row.optionId);
        return (
            <li className={col.className ? "table-content " + col.className : "table-content"} style={{ "display": "flex" }} >
                <div className='flex-nowrap justify-space-between align-center w-100'>
                    <div className='flex-nowrap flex-flow-column  justify-left align-self-center'>
                        <span style={{ "fontSize": "1.1em", "marginRight": "auto" }}><strong>{option.name}</strong></span>
                        {option.description && <span className='description-text'>{option.description}</span>}
                    </div>
                    {/*this.props.editsPermitted !== false && */
                        <button 
                            className='round-button small-round-button light-grey-outline-button' 
                            style={{"flex":"0 0 1rem","marginLeft":"0.5em"}} 
                            onClick={() => this.onDeleteOption(row)}
                        ><CloseUpSVG /></button>
                    }
                </div>
            </li>
        );
    }

    renderComments(value, row, index, col){
        return (
            <li className={col.className ? "table-content " + col.className : "table-content"} style={{ "display": "flex" }} >
                <span className="table-mini-header">Comments: </span>
                <div className='flex-nowrap flex-flow-column justify-left align-self-center' style={{"width":"100%"}}>
                    <div className='flex-nowrap justify-space-between align-center'>
                        {<span className='description-text'>{value}</span>}
                        {/*this.props.editsPermitted !== false && */
                            <button 
                                className='round-button small-round-button light-grey-outline-button' 
                                style={{"flex":"0 0 1rem","marginLeft":"0.5em"}} 
                                onClick={() => {
                                    this.okButtonText = 'Save Edits';
                                    this.headerText = 'Edit Option';
                                    this.okButtonCallBack = this.onEditOption;
                                    this.elementToEdit = row;
                                    this.setState({alertContent: row, showAddEditOption: true});
                                }}
                                >
                                    <EditUpSVG />
                            </button>
                        }
                    </div>
                </div>
            </li>
        );
    }

    renderCategory(value, row, index, col){
        let category = this.state.optionsList.find(element => element.categoryId === row.categoryId);
        return (
            <li className={col.className ? "table-content " + col.className : "table-content"} style={{ "display": "flex" }}>
                <span className="table-mini-header">Category: </span>
                <span>{category.categoryName}</span>
            </li>
        );
    }

    onAlertCategoryChange(value){
        let content = {categoryId: value, optionId: null, description: ''};
        this.setState({alertContent: content});
    }

    onAlertOptionsChange(value){
        let content = this.state.alertContent;
        content.optionId = value;
        this.setState({alertContent: content});
    }

    onAlertDescriptionChange(value){
        let content = this.state.alertContent;
        content.description = value;
        this.setState({alertContent: content});
    }

    onAddOption(){
        //let options = this.state.options;
        //options.push(this.state.alertContent);
        //this.setState({showAddEditOption: false, alertContent: this.alertDafaultContent, options: options});
        //TODO: handle loading
        Service.addUserOption(this.props.member.id, this.state.alertContent).then(userOptions => this.setState({ showAddEditOption: false, alertContent: this.alertDafaultContent, options: userOptions }));
    }

    render() {
        const optionsList = this.state.optionsList;
        let options = [];
        if (this.state.alertContent.categoryId !== null) {
            options = optionsList.find(element => element.categoryId === this.state.alertContent.categoryId).options;
        }
        let optionsValue = null;
        if(options.length === 1){
            optionsValue = options[0].id;
            if(this.state.alertContent.optionId !== optionsValue){ this.onAlertOptionsChange(optionsValue) }
        }
        const columns=[
            {title:"Options", accesor:"options", className:'borders-when-display-block', render: this.renderOption},
            {title:"Category", className:'small-bold', accesor:"category", render: this.renderCategory},
            {title:"Comments", accesor:"description", render: this.renderComments}
        ];
        return (
            <div className = 'flex-nowrap flex-flow-column justify-center w-100 prpl-0'>
                {this.state.showAddEditOption &&
                    <FixedWrapper maxWidth={"600px"}>
                            <h2 className='mb-2 mt-2'>{this.headerText}</h2>
                            <ul className='input-fields first-child-text-95'>
                                <li>
                                    <p>Category:</p>
                                    <MultiDropDown
                                        list={optionsList}
                                        multiSelect={false}
                                        toggleable={true}
                                        disabled={this.headerText=='Edit Option'}
                                        keyProperty='categoryId'
                                        textProperty='categoryName'
                                        defaultValue={this.state.alertContent.categoryId}
                                        placeholder="Select the Category"
                                        onDropDownValueChange={(value) => this.onAlertCategoryChange(value)}
                                    />
                                </li>
                                {this.state.alertContent.categoryId !== null &&
                                <li>
                                    <p>Option:</p>
                                    <MultiDropDown
                                        list={options}
                                        multiSelect={false}
                                        disabled={this.headerText == 'Edit Option'}
                                        toggleable={true}
                                        keyProperty='id'
                                        textProperty='name'
                                        defaultValue={this.state.alertContent.optionId}
                                        placeholder="Select the Option"
                                        onDropDownValueChange={(value) => {this.onAlertOptionsChange(value)}}
                                    />
                                </li>
                                }
                                {this.state.alertContent.categoryId !== null && 
                                <li>
                                    <p>Comments:</p>
                                    <textarea 
                                        placeholder='Description'
                                        value={this.state.alertContent.description}
                                        onChange={(e) => this.onAlertDescriptionChange(e.target.value)}
                                    />
                                </li>
                                }
                            </ul>
                            <div className='flex-nowrap justify-center mt-2 mb-2'>
                                {this.state.alertContent.optionId !== null && this.state.alertContent.categoryId !== null &&
                                    <button 
                                        className='regular-button medium-static-button static-button' 
                                        onClick={this.okButtonCallBack}
                                    >{this.okButtonText}</button>
                                }
                                <button 
                                    className='medium-static-button static-button default-button'
                                    onClick={() => this.setState({showAddEditOption: false, alertContent: this.alertDafaultContent})}
                                >Cancel</button>
                            </div>
                    </FixedWrapper>
                }
                {this.state.removeOptionShowAlert && 
                        <Alert
                            headerText = 'Delete'
                            text = 'Are you sure you want to delete this option?'
                            onClose = {()=>this.setState({removeOptionShowAlert: false})}
                            mode = 'warning'
                            showOkCancelButtons = {true}
                            okButtonText = 'Delete'
                            onCancelButtonClick = {() => this.setState({removeOptionShowAlert: false})}
                            onOkButtonClick = {() => this.removeOption()}
                        >   
                            <h4 className='mb-05'>{this.elementToRemoveProps.optionName}</h4>
                            {this.elementToRemoveProps.optionDescription && this.elementToRemoveProps.optionDescription !== '' && 
                                <p className='mb-05' style={{"textAlign":"center", "fontSize": "0.9em"}}>
                                    {this.elementToRemoveProps.optionDescription}
                                </p>
                            }
                            <p className='small-bold' style={{"textAlign":"center"}}>
                                {this.elementToRemoveProps.categoryName}
                            </p>
                            {this.elementToRemoveProps.description && this.elementToRemoveProps.description !== '' && 
                                <p className='italic mt-05' style={{"textAlign":"center"}}>
                                    {this.elementToRemoveProps.description}
                                </p>
                            }
                        </Alert>
                }
                {!this.state.showAddEditOption && this.state.options.length === 0 && 
                    <p className='message-block mb-2'>There are no options assigned to this member yet.</p>
                }
                {!this.state.showAddEditOption && /*this.props.editsPermitted !== false && */
                    <div className="flex-wrap align-center justify-center">
                        <p className='input-label'>ADD OPTIONS:</p>
                        <button 
                            className='big-static-button static-button' 
                            onClick={() => {
                                this.okButtonText = 'Add Option';
                                this.headerText = 'Add Option';
                                this.okButtonCallBack = this.onAddOption;
                                //this.props.store.set("bodyNoScroll", true);
                                this.setState({showAddEditOption: true})
                            }}
                        >
                            Add Options
                        </button>
                    </div>
                }
                {!this.state.showAddEditOption && this.state.options.length > 0 && 
                    <div className='flex-nowrap flex-flow-column align-center mt-2'>
                        <Table columns={columns} data={this.state.options} className={"break-at-500"} addHeadersForNarrowScreen={true}/>
                    </div>
                }
            </div>
        );
    }
}

export default withStore(MemberOptions);