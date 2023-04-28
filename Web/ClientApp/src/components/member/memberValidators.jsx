import { createValidators } from '../storeValidatorsRules'

const memberValidators = (isNew) => {
    var array = [
        { 'name': 'firstName', 'typeFunction': 'notEmptyString', 'text': 'First Name' },
        { 'name': 'lastName', 'typeFunction': 'notEmptyString', 'text': 'Last Name' },
        { 'name': 'siteId', 'typeFunction': 'dropDownValue', 'text': 'Chapter' },
        { 'name': 'gender', 'typeFunction': 'gender', 'text': 'Gender' },
        { 'name': 'zip', 'typeFunction': 'zip', 'text': 'Zip' },
        { 'name': 'ethnicity', 'typeFunction': 'dropDownValue', 'text': 'Enthicity' },
    ];
 //   if (!isNew) {
 //      array.push({ 'name': 'email', 'typeFunction': 'email', 'text': 'Email' });
 //   }

    return createValidators(array);
}
  
export default memberValidators;