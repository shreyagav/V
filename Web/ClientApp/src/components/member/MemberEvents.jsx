import React, { Component } from 'react';
import Table from '../Table';
import { withStore } from '../store';

class MemberEvents extends Component {

    renderColumnName(value, row, index, col) {
        return (
            <li key={index} className={col.className ? "table-content " + col.className : "table-content"} style={{"alignItems":"stretch"}}>
                <span style={{'backgroundColor':row['color']}}></span>
                <span className="display-flex flex-flow-column flex-nowrap justify-left">                                                
                    <span style={{"fontSize":"1.1em"}}>{value}</span>
                    <span className='chapter'>{row['chapter']}</span>
                </span>
            </li>
        );
    }

    render() {
        const eventsList = this.props.events;
        const columns=[
            {title:"Title", accesor:"name", className:"borders-when-display-block", columnMinWidth:'max-content', render: this.renderColumnName},
            {title:"Date", accesor:"date"}
        ];
        return (
            <div className='flex-nowrap flex-flow-column align-center mediaMin500-pl-pr-025 prpl-0 w-100'>
                {eventsList && eventsList.length > 0 &&
                    <Table columns={columns} data={eventsList} className={"break-at-500"} addHeadersForNarrowScreen={true}/>
                }
                {eventsList && eventsList.length === 0 &&
                    <p className="message-block mb-05 pr-1 pl-1">This user does not take part in any event.</p>
                }
            </div>
        );
    }
}

export default withStore(MemberEvents);