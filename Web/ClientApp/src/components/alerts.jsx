import React, { Component } from 'react'
import Alert from './Alert'

const alertNotValid = (callback) => {
    return (
        <Alert 
            headerText = 'Error'
            text = 'Some required information is missing or incomplete.'
            onClose = {() => callback()}
            showOkButton={true}
            onOkButtonClick={() => callback()}
            buttonText = "Got IT!"
            mode = 'error'
        >
            <span class='alert-message'>Please fill out the fields in red.</span>
        </Alert>
    )
}

export {alertNotValid};