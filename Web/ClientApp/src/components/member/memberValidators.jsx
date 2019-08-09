import { createValidators } from '../storeValidatorsRules'

const memberValidators = () => createValidators([
      {'name':'firstName', 'typeFunction':'name', 'text':'First Name'},
      {'name':'lastName', 'typeFunction':'name', 'text':'Last Name'},
      {'name':'siteId', 'typeFunction':'chapter', 'text':'Chapter'}
]);
  
export default memberValidators;