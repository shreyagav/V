//import { Route, Router, history } from 'react-router';
import React, { Component } from 'react';
import { withStore } from './../store';
import ImageGallery from '../ImageGallery';
import Loader from '../Loader';
import { Service } from '../ApiService';

class EventPictures extends Component {
    static displayName = EventPictures.name;

    constructor(props) {
        super(props);
        this.state = {
            eventId: props.eventId,
            pictures: [],
            loading: false
        };
        this.fileRef = null;
        this.uploadFileChanged = this.uploadFileChanged.bind(this);
        this.openFileDialog = this.openFileDialog.bind(this);

    }
    componentDidMount() {
        this.setState({ loading: true });
        Service.getEventPictures(this.state.eventId)
            .then(data => {
                this.preloadPictures(data);
            });
    }

    preloadPictures(data) {
        var component = this;
        if (data.length > 0) {
            var loaded = 0;
            var onload = function () {
                loaded++;
                if (loaded == data.length) {
                    component.allPicturesLoaded(data);
                }
            };
            for (var i = 0; i < data.length; i++) {
                var a = new Image();
                a.src = data[i].url;
                a.onload = onload;
                a.onerror = onload;
            }
        } else {
            component.allPicturesLoaded(data);
        }
    }

    allPicturesLoaded(data) {
        var res = [].concat(this.state.pictures, data);
        this.setState({ pictures: res, loading: false });
    }

    uploadFileChanged(evt) {
        this.setState({ loading: true });
        Service.uploadPictures(this.state.eventId, evt.target)
            .then(data => {
                this.preloadPictures(data);
            });
    }
    openFileDialog() {
        if (this.fileRef != null) {
            this.fileRef.click();
        }
    }
    render() {
            return (
                <div style={{ "width": "100%", "maxWidth": "600px" }}>
                    {this.state.loading && <Loader /> }
                    <div style={{ display: 'none' }}>
                        <input type="file" ref={el => this.fileRef = el} onChange={this.uploadFileChanged} />
                    </div>
                    {this.props.editsPermitted !== false &&
                        <div className="flex-wrap align-center justify-center mt-2">
                            <p className='input-label'>Upload a picture:</p>
                            <button className='big-static-button static-button' onClick={this.openFileDialog}>Browse</button>
                        </div>
                    }
                    {this.state.pictures.length > 0 && <ImageGallery pictures={this.state.pictures} />}
                </div>
            );
    }
}

export default withStore(EventPictures)
