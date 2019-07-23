import React, { Component } from 'react'

class FixedWrapper extends Component {

    componentWillMount() {document.body.classList.add("ovf-hidden")}
    componentWillUnmount() {document.body.classList.remove("ovf-hidden")}

    render() {
        return (
            <div className = 'wh-bcg'>
                <div className = 'flex-nowrap flex-flow-column' style={{"maxWidth": this.props.maxWidth}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default FixedWrapper
