import { createValidators } from "../storeValidatorsRules";

const eventValidators = () =>
  createValidators([
    { name: "name", typeFunction: "notEmptyString", text: "Event Title" },
    { name: "site", typeFunction: "dropDownValue", text: "Chapter" },
    { name: "eventType", typeFunction: "dropDownValue", text: "Type of Event" },
    { name: "timeTo", typeFunction: "timePickerValue", text: "time" },
    { name: "timeFrom", typeFunction: "timePickerValue", text: "time" },
    { name: "date", typeFunction: "datePickerValue", text: "date" },
  ]);

export default eventValidators;
