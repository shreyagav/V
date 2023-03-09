import React from 'react'

import PasswordShowUpSVG from '../svg/PasswordShowUpSVG'
import PasswordHideUpSVG from '../svg/PasswordHideUpSVG'

const PasswordComponent = (props) => {

    const inputTypeToggler = (inputRef) => {
        if(inputRef !== null){
            let svgs = inputRef.nextSibling.children;
            if(inputRef.type === "password"){
                inputRef.type = 'text';
                svgs[0].classList.add("display-none");
                svgs[0].classList.remove("display-flex");
                svgs[1].classList.add("display-flex");
                svgs[1].classList.remove("display-none");
            }
            else {
                inputRef.type = "password";
                svgs[1].classList.add("display-none");
                svgs[1].classList.remove("display-flex");
                svgs[0].classList.add("display-flex");
                svgs[0].classList.remove("display-none");
            }
        }
    }

    let passwordInputRef = null;
    let mainDivClassName = props.className;
    if(typeof(props.checkIfShowError) === 'function' && props.checkIfShowError(props.name, props.validators)){
            mainDivClassName = mainDivClassName + ' error-input-wrapper';
    }

    return (
        <div className={mainDivClassName}>
            <div className='input-button-wrapper'>
                <input 
                    ref={el => passwordInputRef = el}
                    name={props.name} 
                    type='password' 
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={(e) => props.onChange(e, props.name)}
                    onBlur={() => props.onBlur(props.name)} 
                    onKeyDown={props.onKeyDown}
                />
                {props.value.length > 0 &&
                    <button onClick={() => inputTypeToggler(passwordInputRef)}>
                        <PasswordShowUpSVG />
                        <PasswordHideUpSVG svgClassName={"display-none"}/>
                    </button>
                }
            </div>
            { props.displayValidationErrors && props.displayValidationErrors(props.name, props.validators) }
        </div>
    );
}
export default PasswordComponent;
