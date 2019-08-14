import React, { Component } from 'react';
import Table from '../Table';
import Alert from '../Alert';
import MultiDropDown from '../MultiDropDown/MultiDropDown';
import { withStore } from '../store';
import CloseUpSVG from '../../svg/CloseUpSVG';
import EditUpSVG from '../../svg/EditUpSVG';
import { Service } from '../ApiService';

class MemberDiagnosis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddEditDiagnosis: false,
            removeDiagnosisShowAlert: false,
            alertContent: {
                id: null,
                description: ''
            },
            diagnosis: [],
            diagnosisList: []
        }
        this.alertDafaultContent = { categoryId: null, diagnosId: null, description: ''};
        this.renderDiagnose = this.renderDiagnose.bind(this);
        this.onAddDiagnose = this.onAddDiagnose.bind(this);
        this.onEditDiagnosis = this.onEditDiagnosis.bind(this);
        this.okButtonCallBack = this.okButtonCallBack.bind(this);
        this.onDeleteDiagnosis = this.onDeleteDiagnosis.bind(this);

        this.okButtonText = 'OK';
        this.modalHeader = 'Header';
        this.elementToEdit = null;
        this.elementToRemoveProps = {
            name: '',
            description: ''
        }
    }

    componentDidMount() {
        Service.getDiagnosisList().then(allDiagnosis => {
            Service.getUserDiagnosis(this.props.member.id).then(userDiagnosis => {
                this.setState({ diagnosisList: allDiagnosis, diagnosis: userDiagnosis });
            })
        });
    }

    okButtonCallBack = () => {};

    onEditDiagnosis(){
        Service.editUserDiagnosis(this.props.member.id, this.state.alertContent)
            .then(userDiagnosis => this.setState({ diagnosis: userDiagnosis, showAddEditDiagnosis: false }));
        this.elementToEdit = null;
    }

    onDeleteDiagnosis(row){
        this.elementToEdit = row;
        let el = this.state.diagnosisList.find(element => element.id === row.id);
        this.elementToRemoveProps.description = row.description;
        this.elementToRemoveProps.name = el.name;
        this.setState({ removeDiagnoseShowAlert: true });
    }

    removeDiagnose() {
        //TODO: handle loading
        Service.deleteUserDiagnosis(this.props.member.id, this.elementToEdit)
            .then(userDiagnosis => this.setState({ diagnosis: userDiagnosis, removeDiagnoseShowAlert: false }));
    }

    renderDiagnose(value, row, index, col){
        return (
            <li 
                className={col.className ? "table-content " + col.className : "table-content"} 
                style={{ "display": "flex" }}
            >
                <div className='flex-nowrap flex-flow-column justify-left align-self-center' style={{"width":"100%"}}>
                    <div className='flex-nowrap justify-space-between align-center'>
                        <span style={{ "fontSize": "1.1em", "marginRight": "auto" }}>{row.name}</span>
                            {/*this.props.editsPermitted !== false && */
                                <button 
                                    className='round-button small-round-button light-grey-outline-button' 
                                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                                    onClick={() => this.onDeleteDiagnosis(row)}
                                >
                                    <CloseUpSVG />
                                </button>
                            }
                            {/*this.props.editsPermitted !== false && */
                                <button 
                                    className='round-button small-round-button light-grey-outline-button' 
                                    style={{"flex":"0 0 1rem","marginLeft":"0.2em"}} 
                                    onClick={() => {
                                        this.okButtonText = 'Save Edits';
                                        this.headerText = 'Edit Diagnose';
                                        this.okButtonCallBack = this.onEditDiagnosis;
                                        this.elementToEdit = row;
                                        this.setState({ alertContent: row, showAddEditDiagnosis: true});
                                    }}
                                >
                                    <EditUpSVG />
                                </button>
                            }
                    </div>
                    {row.description && <span style={{ "fontSize": "0.9em" }}>{row.description}</span>}
                </div>
            </li>
        );
    }

    onAlertDiagnoseChange(value){
        let content = this.state.alertContent;
        content.id = value;
        this.setState({alertContent: content});
    }

    onAlertDescriptionChange(value){
        let content = this.state.alertContent;
        content.description = value;
        this.setState({alertContent: content});
    }

    onAddDiagnose(){
        //TODO: handle loading
        Service.addUserDiagnose(this.props.member.id, this.state.alertContent).then(userDiagnosis => this.setState({ showAddEditDiagnosis: false, alertContent: this.alertDafaultContent, diagnosis: userDiagnosis }));
    }

    render() {
        const columns=[
            {title:"Diagnose", accesor:"name", className:'borders-when-display-block', render: this.renderDiagnose},
            {title:"Description", accesor:"description", className: "italic"}
        ];
        return (
            <div className='flex-nowrap flex-flow-column justify-center width-100 mt-3' style={{ 'maxWidth': "700px", "width": "100%" }}>
                {this.state.showAddEditDiagnosis &&
                    <div className = 'wh-bcg' style={{"opacity":"1"}}>
                        <div className = 'flex-nowrap flex-flow-column align-center justify-center mr-1 ml-1' style={{"width":"100%", "backgroundColor":"#ffffff"}}>
                            <h2 className='mb-2 mt-2'>{this.headerText}</h2>
                            <ul className='input-fields first-child-text-95'>
                                <li>
                                    <p>Diagnose:</p>
                                <MultiDropDown
                                    list={this.state.diagnosisList.filter(a => this.state.diagnosis.find(b => b.id == a.id) == null || a.id === this.state.alertContent.id)}
                                        multiSelect={false}
                                        disabled={this.headerText == 'Edit Diagnose'}
                                        toggleable={true}
                                        keyProperty='id'
                                        textProperty='description'
                                        defaultValue={this.state.alertContent.id}
                                        placeholder="Select a Diagnose"
                                        onDropDownValueChange={(value) => this.onAlertDiagnoseChange(value)}
                                    />
                                </li>
                                <li>
                                    <p>Comments:</p>
                                    <textarea 
                                        placeholder='Description'
                                        value={this.state.alertContent.description}
                                        onChange={(e) => this.onAlertDescriptionChange(e.target.value)}
                                    />
                                </li>
                            </ul>
                            <div className='flex-nowrap justify-center mt-2 mb-2'>
                                {this.state.alertContent.id !== null &&
                                    <button 
                                        className='regular-button medium-static-button static-button' 
                                        onClick={this.okButtonCallBack}
                                    >{this.okButtonText}</button>
                                }
                                <button 
                                    className='medium-static-button static-button default-button'
                                    onClick={() => this.setState({showAddEditDiagnosis: false, alertContent: this.alertDafaultContent})}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                }
                {this.state.removeDiagnoseShowAlert && 
                        <Alert
                            headerText = 'Delete'
                            text='Are you sure you want to delete this option?'
                            onClose={() => this.setState({ removeDiagnoseShowAlert: false })}
                            mode = 'warning'
                            showOkCancelButtons = {true}
                    okButtonText='Delete'
                    onCancelButtonClick={() => this.setState({ removeDiagnoseShowAlert: false })}
                    onOkButtonClick={() => this.removeDiagnose()}
                        >   
                            <h4 className='mb-05'>{this.elementToRemoveProps.name}</h4>
                            {this.elementToRemoveProps.description && this.elementToRemoveProps.description !== '' && 
                                <p className='mb-05' style={{"textAlign":"center", "fontSize": "0.9em"}}>
                                    {this.elementToRemoveProps.description}
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
                {!this.state.showAddEditDiagnosis && this.state.diagnosis.length === 0 && 
                    <p className='message-block mb-2'>There are no diagnosis assigned to this member yet.</p>
                }
                {!this.state.showAddEditDiagnosis && /*this.props.editsPermitted !== false && */
                    <div className="flex-wrap align-center justify-center">
                        <p className='input-label'>ADD DIAGNOSE:</p>
                        <button 
                            className='big-static-button static-button' 
                            onClick={() => {
                                this.okButtonText = 'Add Diagnose';
                                this.headerText = 'Add Diagnose';
                                this.okButtonCallBack = this.onAddDiagnose;
                                //this.props.store.set("bodyNoScroll", true);
                                this.setState({ showAddEditDiagnosis: true })
                            }}
                        >
                            Add Diagnose
                        </button>
                    </div>
                }
                {!this.state.showAddEditDiagnosis && this.state.diagnosis.length > 0 && 
                    <div className='flex-nowrap flex-flow-column align-center mt-2'>
                        <Table columns={columns} data={this.state.diagnosis} className={"break-at-500"} addHeadersForNarrowScreen={true} />
                    </div>
                }
            </div>
        );
    }
}

export default withStore(MemberDiagnosis);