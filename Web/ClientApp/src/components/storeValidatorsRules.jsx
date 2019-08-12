const storeValidatorsRules = {
    name: (text) => { 
        let message1 = text + ' includes invalid characters';
        let message2 = text + ' must be longer than 1 character';
        let message3 = 'Please enter the ' + text;
        return [ 
            { test: /^$|^[^#&<>\"~;$^%{}?]{1,}$/, message: message1 },
            { test: (value) => { return value.length !== 1 }, message: message2 },
            { test: (value) => { return value.length !== 0 }, message: message3 },
        ];
    },
    chapter: (text) => {
        let message = 'Please select the ' + text;
        return [
            { test: (value) => { return value > 0 }, message: message },
        ];
    },
};

/* {name, typeFunction, text} */

const createValidators = (validators) => {
    let newValidators = {};
    validators.forEach(element => {
        newValidators[element.name] = {
            rules: storeValidatorsRules[element.typeFunction](element.text),
            errors: [],
            activated: false,
            valid: false
        };
        console.log(newValidators);
    });
    return newValidators;
};
  
export { createValidators };