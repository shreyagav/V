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
    nameOTG: (text) => { 
        let message1 = text + ' includes invalid characters';
        return [ 
            { test: /^$|^[^#&<>\"~;$^%{}?]{1,}$/, message: message1 },
        ];
    },
    phone: (text) => {
        let message1 = text + ' is not valid';
        let message2 = text + ' number is too short';
        return [
            { test: /^$|^\+?[0-9]?\(?[0-9]{3}\)?[\.\- \)]?[0-9]{3}[\.\- ]?[0-9]{4}$/, message: message1 },
            /*{ test: (value) => { 
                    let newValue = value.replace(/\D/g,'')
                    return (newValue.length === 0 || 12 >= newValue.length || newValue.length >= 10)
                }, message: message2 
            }*/
        ];
    },
    phoneOTG: (text) => {
        let message1 = text + ' contains invalid symbols';
        return [ 
            { test: /^(\(?\+?[0-9]*\)?)[0-9\.\- \(\)]*$/, message: message1 },
        ];
    },
    email: (text) => {
        let message1 = text + 'is not valid';
        return [
            {test: /^$|^.+@[^\.].*\.[a-z]{2,}$/, message: message1 },
        ];
    },
    emailOTG: (text) => {
        let message1 = text + 'is not valid';
        return [ 
            { test: /^$|^[^@]+(@([^@%',]*(\.([a-z]{1,})?)?)?)?$/, message: message1 },
        ];
    },
    chapter: (text) => {
        let message1 = 'Please select the ' + text;
        return [
            { test: (value) => { return value > 0 }, message: message1 },
        ];
    },
    zipOTG: (text) => {
        let message1 = text + 'is not valid';
        return [ 
            { test: /^\d{1,5}(?:[-\s]\d{0,4})?$/, message: message1 },
        ];
    },
    notEmptyString: (text) => {
        let message = 'Please enter the ' + text;
        return [
            { test: (value) => { return value.length > 0 }, message: message },
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
    });
    return newValidators;
};
  
export { createValidators };