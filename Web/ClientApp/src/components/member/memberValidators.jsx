import { createValidators } from '../storeValidatorsRules'

const memberValidators = () => createValidators([
      {'name':'firstName', 'typeFunction':'notEmptyString', 'text':'First Name'},
      {'name':'lastName', 'typeFunction':'notEmptyString', 'text':'Last Name'},
      {'name':'siteId', 'typeFunction':'dropDownValue', 'text':'Chapter'},
      {'name':'email', 'typeFunction':'email', 'text':'Email'},
      {'name':'gender', 'typeFunction':'gender', 'text':'gender'}
]);
  
export default memberValidators;