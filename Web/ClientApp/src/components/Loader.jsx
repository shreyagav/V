import React, { Component } from 'react'
import './Alert.css'

class Loader extends Component {

    constructor(props) {
        super(props);
        this.modalShadowRef = null;
    }

    componentDidMount(){
        this.measureHeight();
    }

    componentDidUpdate(){
        this.measureHeight();
    }

    measureHeight(){
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        console.debug("DOCUMENT HEIGHT");
        console.debug(scrollHeight);
        if(this.modalShadowRef !== null){
            console.debug("SHADOW HEIGHT");
            console.debug(this.modalShadowRef.offsetHeight);
        }
    }

    render() {
        return (
            <div>
                <div className='modal-shadow' ref={el => this.modalShadowRef = el}></div>
                <div className = 'loader-body'>
                    <img src='kayak.gif' alt='loading' className="loader-img"/>
                </div>
            </div>
        )
    }
}

export default Loader
