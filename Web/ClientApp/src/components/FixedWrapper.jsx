import React, { Component } from 'react'

class FixedWrapper extends Component {

    componentWillMount() {document.body.classList.add("ovf-hidden")}
    componentWillUnmount() {document.body.classList.remove("ovf-hidden")}

    setStyle = () => {
        if(this.props.maxWidth) return {"maxWidth": this.props.maxWidth, "maxHeight":document.documentElement.clientHeight}
        else return {"maxHeight":document.documentElement.clientHeight}
    }

    render() {
        const style = this.setStyle();
        return (
            <div className = 'wh-bcg'>
                <div className = {'flex-nowrap flex-flow-column w-100' + (this.props.noPadding !== true ? " p-1" : "")} style={style}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default FixedWrapper
