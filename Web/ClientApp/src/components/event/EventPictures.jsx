//import { Route, Router, history } from 'react-router';
import React, { Component } from 'react';
import { withStore } from './../store';
import ImageGallery from '../ImageGallery';

class EventPictures extends Component {
    static displayName = EventPictures.name;

    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId,
            pictures: [],
            loadData: false
        };
    }
    componentDidMount() {
        var component = this;
        this.setState({ loadData: true });
        fetch('/Pictures.json')
            .then(function (data) { return data.json(); })
            .then(function (jjson) {
                component.setState({pictures: jjson});
            })
            .then(function () {
                setTimeout(() => component.setState({loadData: false}), 1500)
            });
    }

    render() {
        if (this.state.loadData) {
            return (
                <div className='loader-wrapper'>
                    <img src='kayak.gif' alt='loading' className="loader-img"/>
                </div>
            );
        } 
        else {
            return (
                <div style={{ "width": "100%", "maxWidth": "600px" }}>
                    <div className="flex-wrap align-center justify-center mt-2">
                        <p className='input-label'>Upload a picture:</p>
                        <button disabled className='big-static-button static-button' >Browse</button>
                    </div>
                    <ImageGallery pictures={this.state.pictures} />
                </div>
            );
        }
    }
}

export default withStore(EventPictures)
