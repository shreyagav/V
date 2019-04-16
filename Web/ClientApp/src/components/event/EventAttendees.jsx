//import { Route, Router, history } from 'react-router';
import { Route, Router, BrowserRouter, Switch } from 'react-router-dom';
import React, { Component } from 'react'
import { withStore } from './../store'
import CloseUpSVG from '../../svg/CloseUpSVG';

class EventAttendees extends Component {
    static displayName = EventAttendees.name;

    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId,
            members: [],
            loadData: false
        };
    }
    componentDidMount() {
        var component = this;
        this.setState({ loadData: true });
        fetch('/Members.json')
            .then(function (data) { return data.json(); })
            .then(function (jjson) {
                component.setState({ members: jjson, loadData: false });
            });
    }

    render() {
        if (this.state.loadData) {
            return (<p>Loading</p>);
        } else 
        return (
                <div style={{ "width": "100%", "maxWidth": "600px" }}>
                    <div className="flex-wrap align-center justify-center mt-2 mb-2">
                        <p className='input-label'>ADD ATTENDEES:</p>
                        <span>
                            <button disabled className='big-static-button static-button' >
                                Create New
                            </button>
                            <button disabled className='big-static-button static-button' >
                                Add Member
                            </button>
                        </span>
                    </div>
                    <ul className='table-element mt-1 mb-2'>
                        <li>
                            <ul className='table-element-header table-element-member table-member'>
                                <li>Name</li>
                                <li className='no-break'>Role</li>
                                <li>Phone</li>
                                <li>Email</li>
                                <li></li>
                            </ul>
                        </li>
                        {
                            this.state.members.map((element, index) =>
                                <ul key={index} className='table-element-content table-element-member table-member'>
                                    <li >{element.firstName + " " + element.lastName}</li>
                                    <li className='no-break'>{element.role}</li>
                                    <li >{element.phone}</li>
                                    <li >{element.email}</li>
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

export default withStore(EventAttendees)
