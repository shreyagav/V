import { createValidators } from "../storeValidatorsRules";

const signUpValidators = () =>
  createValidators([
    { name: "Email", typeFunction: "email", text: "Email" },
    { name: "Password", typeFunction: "password", text: "Password" },
    {
      name: "PasswordRepeat",
      typeFunction: "compareValues",
      text: "Repeated Password does not match the Password",
    },
    { name: "FirstName", typeFunction: "notEmptyString", text: "First Name" },
    { name: "LastName", typeFunction: "notEmptyString", text: "Last Name" },
    { name: "Phone", typeFunction: "phone", text: "phone" },
    { name: "Zip", typeFunction: "zip", text: "Zip code" },
  ]);

const signInValidators = () =>
  createValidators([
    { name: "UserName", typeFunction: "notEmptyString", text: "Email" },
    { name: "Password", typeFunction: "notEmptyString", text: "Password" },
  ]);

const resetPasswordValidators1 = () =>
  createValidators([{ name: "Email", typeFunction: "email", text: "Email" }]);

const resetPasswordValidators2 = () =>
  createValidators([
    { name: "Email", typeFunction: "email", text: "Email" },
    { name: "NewPassword", typeFunction: "password", text: "Password" },
    {
      name: "NewPasswordRepeat",
      typeFunction: "compareValues",
      text: "Repeated Password does not match the Password",
    },
  ]);

export {
  signUpValidators,
  signInValidators,
  resetPasswordValidators1,
  resetPasswordValidators2,
};
