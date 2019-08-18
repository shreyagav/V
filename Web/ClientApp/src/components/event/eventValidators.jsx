import { createValidators } from '../storeValidatorsRules'

const eventValidators = () => createValidators([
      {'name':'name', 'typeFunction':'notEmptyString', 'text':'Event Title'},
      {'name':'site', 'typeFunction':'chapter', 'text':'Chapter'},
]);
  
export default eventValidators;