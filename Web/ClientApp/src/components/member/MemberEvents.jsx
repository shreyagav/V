import React, { Component } from 'react';
import DropDown from '../DropDown';
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
            <div className='flex-nowrap flex-flow-column align-center pt-2 mediaMin500-pl-pr-025 pl-1 pr-1' style={{"width":"100%","maxWidth":"500px"}}>
                <Table columns={columns} data={eventsList} />
            </div>
        );
    }
}

export default withStore(MemberEvents);