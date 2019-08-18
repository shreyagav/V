import { createValidators } from '../storeValidatorsRules'

const memberValidators = () => createValidators([
      {'name':'firstName', 'typeFunction':'notEmptyString', 'text':'First Name'},
      {'name':'lastName', 'typeFunction':'notEmptyString', 'text':'Last Name'},
      {'name':'siteId', 'typeFunction':'chapter', 'text':'Chapter'}
]);
  
export default memberValidators;