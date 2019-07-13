import React, { Component } from 'react';
import StatusDraftSVG from '../svg/StatusDraftSVG';
import StatusPublishedSVG from '../svg/StatusPublishedSVG';
import StatusCanceledSVG from '../svg/StatusCanceledSVG';

class Status extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={this.props.className ? (this.props.className + ' ' + this.props.eventStatus) : this.props.eventStatus}>
                {this.props.eventStatus === 'published' ? <StatusPublishedSVG /> : 
                    (this.props.eventStatus === 'canceled' ? <StatusCanceledSVG /> : <StatusDraftSVG />)
                }
                <span>{this.props.eventStatus}</span>
            </div>
        )
    }
}

export default Status;