import React, { Component } from 'react';
import StatusPublishedSVG from '../svg/StatusPublishedSVG';
import StatusCanceledSVG from '../svg/StatusCanceledSVG';
import StatusDeletedSVG from '../svg/StatusDeletedSVG';
import StatusDraftSVG from '../svg/StatusDraftSVG';

class Status extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    returnIcon = (status) => {
        switch (status) {
            case 'published': return <StatusPublishedSVG />;
            case 'canceled': return <StatusCanceledSVG />;
            case 'draft': return <StatusDraftSVG />;
            case 'deleted': return <StatusDeletedSVG />;
            default: return <div></div>;
        }
    }

    render() {
        const status = this.returnIcon(this.props.eventStatus);
        return (
            <div className={this.props.className ? (this.props.className + ' ' + this.props.eventStatus + ' status') : this.props.eventStatus+ ' status'}>
                {status}
                <span>{this.props.eventStatus}</span>
            </div>
        )
    }
}

export default Status;