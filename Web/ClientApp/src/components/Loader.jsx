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
        console.log("DOCUMENT HEIGHT");
        console.log(scrollHeight);
        if(this.modalShadowRef !== null){
            console.log("SHADOW HEIGHT");
            console.log(this.modalShadowRef.offsetHeight);
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
