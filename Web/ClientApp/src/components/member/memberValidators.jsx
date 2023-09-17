import { createValidators } from "../storeValidatorsRules";

const memberValidators = (isNew) => {
  var array = [
    { name: "firstName", typeFunction: "notEmptyString", text: "First Name" },
    { name: "lastName", typeFunction: "notEmptyString", text: "Last Name" },
    { name: "siteId", typeFunction: "dropDownValue", text: "Chapter" },
    { name: "gender", typeFunction: "gender", text: "gender" },
    { name: "zip", typeFunction: "zip", text: "zip" },
  ];
  if (!isNew) {
    array.push({ name: "email", typeFunction: "email", text: "Email" });
  }

  return createValidators(array);
};

export default memberValidators;
