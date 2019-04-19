import React, { Component } from 'react';

class TableHeader extends Component {
    render () {
        const columns = this.props.columns;
        return (
            columns.map((element, index) => 
                <li key={index} className="table-header">{element.title}</li>
            )
        );
    }
}

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const columns = this.props.columns;
        const data = this.props.data;
        const preGridTemplateColumns = columns.map(col => {return (
                'minmax(' + (col.columnMinWidth ? col.columnMinWidth : 'auto') + ', ' + (col.columnMaxWidth ? col.columnMaxWidth : 'auto') + ')'
            )});
        const gridTemplateColumns = preGridTemplateColumns.join(' ');
        return (
            <ul className="table" style={{"gridTemplateColumns":gridTemplateColumns}}>
                <TableHeader columns = {columns} />
                {data.map(element => {
                    return (
                        columns.map((col, index) => {
                            if (col.render) {
                                return (col.render(element[col.accesor], element, index))
                            } 
                            else return (
                                <li key={index} className={col.className ? "table-content " + col.className : "table-content"}>
                                    {element[col.accesor]}
                                </li>
                            )
                        })
                    );
                })}
            </ul>
        );
    }
}

export default Table;