//import { Route, Router, history } from 'react-router';
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG'
import EditUpSVG from '../../svg/EditUpSVG'
import Table from '../Table'
import VolunteerUpSVG from '../../svg/VolunteerUpSVG'
import VeteranUpSVG from '../../svg/VeteranUpSVG'
import Loader from '../Loader'
import { Service } from '../ApiService'
import FixedWrapper from '../FixedWrapper'
import MultiDropDown from '../MultiDropDown/MultiDropDown'
import CheckBox from '../CheckBox'
import SearchInput from '../SearchInput'
import Alert from '../Alert'
import TabComponent from '../TabComponent';
import NotificationEditor from '../NotificationEditor'

const NEW_NOTIFICATION = { subject: "", body: "", notificationAttachments: [], recepients: [] };
const options = { year: 'numeric', month: 'short', day: 'numeric' };

class EventNotifications extends Component {
    static displayName = EventNotifications.name;

    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId,
            notifications: [],
            loading: false,
            addNewNotification: false,
            selectMembers: false,
            tempMembers: [],
            siteMembers: [],
            filteredList: [],
            selectAllCheckboxChecked: false,
            activeMembersOnlyChecked: true,
            selectedMembersOnlyChecked: false,
            attendeeFilter: '',
            chapterOnlyMembers: true,
            newNotification: { ...NEW_NOTIFICATION  }
        };
        this.substractHeightElRef = null;
        this.modalWindowRef = null;
        this.membersDropDownRef = null;
        this.submitNotification = this.submitNotification.bind(this);
        this.updateNotification = this.updateNotification.bind(this);

    }

    componentDidMount() {
        this.setState({ loading: true });
        Service.getEventNotification(this.props.eventId)
            .then(data => this.setState({ loading: false, notifications: data }));
    }

    updateNotification(field, value) {
        var temp = this.state.newNotification;
        temp[field] = value;
        this.setState({ newNotification: temp });
    }
    submitNotification() {
        this.setState({ loading: true });
        const not = this.state.newNotification;
        not.eventId = this.props.eventId;
        not.recepients = not.recepients.map(a => { return { userId: a }; });
        Service.addEventNotification(not)
            .then(data => this.setState({
                notifications: data,
                newNotification: { subject: "", body: "", notificationAttachments: [], recepients: []},
                loading: false,
                addNewNotification: false,
                selectMembers: false
            }));
    }


    getDateTime(s) {
        var d = new Date(s);
        return d.toLocaleDateString('en-US', options) + " " + d.toLocaleTimeString("en-US");
    }

    render() {
        const columns = [
            { title: "Subject", accesor: "subject", className: "borders-when-display-block" },
            {
                title: "Recepients", accesor: "recepients", render: (e, a) => (<li className="table-content"><span className="table-mini-header">Recepients:</span><span>{e ? e.length : 0}</span></li>)
            },
            { title: "Created", accesor: "created", render: a => (<li className="table-content"><span className="table-mini-header">Created:</span><span>{this.getDateTime(a)}</span></li>) },
            {
                title: "Created By", accesor: "createdBy", render: (colVal) => (<li className="table-content"><span className="table-mini-header">Created By:</span><span>{colVal.firstName} {colVal.lastName}</span></li>)
            }
            ];
            const notifications = this.state.notifications;
            return (
            <div className='w-100 prpl-0'>
                {this.state.loading && <Loader />}
                {this.state.addNewNotification &&
                    <FixedWrapper maxWidth={"800px"} noPadding={true}>
                    <NotificationEditor notification={this.state.newNotification} updateNotification={this.updateNotification} eventId={this.props.eventId} chapterId={this.props.chapterId} />
                        <div className='flex-nowrap justify-center mt-1 mb-05 mr-075 ml-075'>
                        <button ref={el => this.okButtonRef = el} className='medium-static-button static-button' onClick={this.submitNotification}>OK</button>
                        <button ref={el => this.cancelButtonRef = el} className='medium-static-button static-button default-button' onClick={() => this.setState({ addNewNotification: false, newNotification: { ...NEW_NOTIFICATION } })}> Cancel </button>
                        </div>
                    </FixedWrapper>
                }
                {notifications.length === 0 && <p className='message-block mb-2 pr-1 pl-1'>There are no messa registered for the event.</p>}
                {this.props.editsPermitted !== false &&
                    <div className="flex-wrap align-center justify-center mb-2 pr-1 pl-1">
                    <button className='big-static-button static-button' onClick={() => { this.setState({ addNewNotification: true }); }}>Send Email</button>
                    </div>
                }
                {notifications.length > 0 && <Table columns={columns} data={this.state.notifications} className={"break-at-500"} addHeadersForNarrowScreen={true} />}
                {this.state.showDialog &&
                    <Alert
                        headerText={this.headerText}
                        text={this.dialogText}
                        onClose={() => this.setState({ showDialog: false })}
                        showOkCancelButtons={true}
                        onCancelButtonClick={() => this.setState({ showDialog: false })}
                        onOkButtonClick={this.onOkButtonClick}
                        cancelButtonText={this.cancelButtonText}
                        okButtonText={this.okButtonText}
                        mode='warning'
                    >
                        {this.dialogContent}
                    </Alert>
                }
            </div>
        );
    }
}

export default withStore(EventNotifications)
