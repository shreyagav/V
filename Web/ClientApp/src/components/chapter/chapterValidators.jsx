import { createValidators } from '../storeValidatorsRules'

const chapterValidators = () => createValidators([
       {'name':'name', 'typeFunction':'notEmptyString', 'text':'Chapter Name'},
       {'name':'groupId', 'typeFunction':'chapter', 'text':'Region'},
]);
  
export default chapterValidators;