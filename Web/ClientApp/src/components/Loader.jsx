import React, { Component } from 'react'
import './Alert.css'

class Loader extends Component {

    render() {
        return (
            <div>
                <div className='modal-shadow'></div>
                <div className = 'loader-body'>
                    <img src='kayak.gif' alt='loading' className="loader-img"/>
                </div>
            </div>
        )
    }
}

export default Loader
