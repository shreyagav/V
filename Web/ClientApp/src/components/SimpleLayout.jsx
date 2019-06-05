import React, { Component } from 'react';
import { withStore } from './store';
class SimpleLayout extends Component {
    static displayName = SimpleLayout.name;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.store.set("withSideBar", false);
    }


    render() {
        return ( this.props.children );
    }
}
export default withStore(SimpleLayout);