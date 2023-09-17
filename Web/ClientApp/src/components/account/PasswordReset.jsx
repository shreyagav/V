import React, { Component } from "react";
import { withStore } from "../store";
import Loader from "../Loader";
import Alert from "../Alert";
import { alertNotValid } from "../alerts";
import LogoSVG from "../../svg/LogoSVG";
import PasswordComponent from "../PasswordComponent";
import { resetPasswordValidators1 } from "./signUpValidators";
import { resetPasswordValidators2 } from "./signUpValidators";

class PasswordReset extends Component {
  static displayName = PasswordReset.name;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showError: null,
      error: null,
      message: null,
      passwordReset: {
        Email: "",
        Token: props.match.params.token,
        NewPassword: "",
        NewPasswordRepeat: "",
      },
    };
    this.changeNewPassword = this.changeNewPassword.bind(this);
    this.changeNewPasswordRepeat = this.changeNewPasswordRepeat.bind(this);
    this.submitChangePasswordInfo = this.submitChangePasswordInfo.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkIfFieldValid = this.checkIfFieldValid.bind(this);
  }

  checkIfMatches = (val1, val2) => {
    return val1 === val2;
  };

  checkIfPasswordRepeatValid = (field) => {
    if (
      this.validators[field].activated === false &&
      this.state.passwordReset[field] !== ""
    ) {
      this.props.store.updateValidators(
        field,
        this.checkIfMatches(
          this.state.passwordReset[field],
          this.state.passwordReset.NewPassword,
        ),
        this.validators,
      );
      let tmp = this.state.passwordReset;
      this.setState({ passwordReset: tmp });
    }
  };

  componentWillMount = () => {
    if (this.props.match.params.token) {
      this.validators = resetPasswordValidators2();
    } else this.validators = resetPasswordValidators1();
    this.alertNotValid = alertNotValid(() =>
      this.setState({ showError: false }),
    );
  };

  componentWillReceiveProps = (props) => {
    if (props.match.params.token) {
      this.validators = resetPasswordValidators2();
    } else this.validators = resetPasswordValidators1();
  };

  onChange = (e, field) => {
    /* check validation only if field was previously activated! */
    if (this.validators[field].activated) {
      this.props.store.updateValidators(field, e.target.value, this.validators);
    }
    this.handleChange(e);
  };

  handleChange(evt) {
    let tmp = this.state.passwordReset;
    tmp[evt.target.name] = evt.target.value;
    this.setState({ passwordReset: tmp });
  }

  checkIfFieldValid = (field) => {
    if (
      this.validators[field].activated === false &&
      this.state.passwordReset[field] !== ""
    ) {
      this.props.store.updateValidators(
        field,
        this.state.passwordReset[field],
        this.validators,
      );
      let tmp = this.state.passwordReset;
      this.setState({ passwordReset: tmp });
    }
  };

  changeNewPassword(e, field) {
    let password = e.target.value;
    let passwordRepeat = this.state.passwordReset.NewPasswordRepeat;
    if (this.validators["NewPasswordRepeat"].activated) {
      let match = this.checkIfMatches(password, passwordRepeat);
      this.props.store.updateValidators(
        "NewPasswordRepeat",
        match,
        this.validators,
      );
    }
    this.onChange(e, field);
  }

  changeNewPasswordRepeat = (e) => {
    /* check validation only if field was previously activated! */
    if (this.validators["NewPasswordRepeat"].activated) {
      this.props.store.updateValidators(
        "NewPasswordRepeat",
        this.checkIfMatches(
          e.target.value,
          this.state.passwordReset.NewPassword,
        ),
        this.validators,
      );
    }
    this.handleChange(e);
  };

  submitChangePasswordInfo() {
    const showError = () => {
      this.setState({ showError: true });
    };
    const sendToken = () => {
      this.setState({ loading: true });
      fetch("/api/account/SendResetPasswordToken", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ userName: this.state.passwordReset.Email }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.error != null) {
            this.setState({ loading: false, error: json.error });
          } else {
            this.setState({
              loading: false,
              message: "Email with further instructions was sent.",
            });
          }
        })
        .catch((err) => this.setState({ loading: false, error: err }));
    };
    if (this.state.passwordReset.Token) {
      this.setState({ loading: true });
      fetch("/api/account/ResetPassword", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(this.state.passwordReset),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (json.succeeded === true) {
            this.setState({ loading: false, message: "Password was reset." });
          } else {
            this.setState({
              loading: false,
              error: json.errors[0].description,
            });
          }
        })
        .catch((err) => this.setState({ loading: false, error: err }));
    } else
      this.props.store.performIfValid(
        this.state.passwordReset,
        this.validators,
        sendToken,
        showError,
      );
  }

  cancel() {
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="abs-wrapper">
        <div>
          <div className="flex-nowrap justify-space-between mb-2 w-100">
            <h3 className="uppercase-text mb-05">
              Reset<strong> Password</strong>
            </h3>
            <a
              href="http://www.teamriverrunner.org"
              target="_self"
              style={{ height: "1.5em" }}
            >
              <LogoSVG />
            </a>
          </div>
          {this.state.loading && <Loader />}
          {!this.state.message && (
            <section>
              <ul className="input-fields input-fields-narrow no-uppercase mb-2">
                <li>
                  <p>Email:</p>
                  <div
                    className={
                      "mb-1" +
                      (this.props.store.checkIfShowError(
                        "Email",
                        this.validators,
                      )
                        ? " error-input-wrapper"
                        : "")
                    }
                  >
                    <input
                      name="Email"
                      type="text"
                      placeholder="Email"
                      value={this.state.passwordReset.Email}
                      onChange={(e) => this.onChange(e, "Email")}
                      onBlur={() => this.checkIfFieldValid("Email")}
                    />
                    {this.props.store.displayValidationErrors(
                      "Email",
                      this.validators,
                    )}
                  </div>
                </li>
                {this.state.passwordReset.Token && (
                  <section>
                    <li>
                      <p className="mb-1">New Password:</p>
                      <PasswordComponent
                        className="mb-1"
                        checkIfShowError={(field, validators) =>
                          this.props.store.checkIfShowError(field, validators)
                        }
                        validators={this.validators}
                        name="NewPassword"
                        placeholder="New password"
                        value={this.state.passwordReset.NewPassword}
                        onChange={(e, name) => this.changeNewPassword(e, name)}
                        onBlur={(name) => this.checkIfFieldValid(name)}
                        displayValidationErrors={(name, validators) =>
                          this.props.store.displayValidationErrors(
                            name,
                            validators,
                          )
                        }
                      />
                    </li>
                    <li>
                      <p className="mb-1">Repeat Password:</p>
                      <PasswordComponent
                        className="mb-1"
                        checkIfShowError={(field, validators) =>
                          this.props.store.checkIfShowError(field, validators)
                        }
                        validators={this.validators}
                        name="NewPasswordRepeat"
                        placeholder="Repeat new password"
                        value={this.state.passwordReset.NewPasswordRepeat}
                        onChange={(e, name) =>
                          this.changeNewPasswordRepeat(e, name)
                        }
                        onBlur={(name) => this.checkIfPasswordRepeatValid(name)}
                        displayValidationErrors={(name, validators) =>
                          this.props.store.displayValidationErrors(
                            name,
                            validators,
                          )
                        }
                      />
                    </li>
                  </section>
                )}
              </ul>
            </section>
          )}
          <div className="flex-wrap justify-center mb-2 w-100">
            {!this.state.message && (
              <button
                type="button"
                className="medium-static-button static-button"
                style={{
                  width: "auto",
                  paddingRight: "1rem",
                  paddingLeft: "1rem",
                }}
                onClick={this.submitChangePasswordInfo}
              >
                {this.state.passwordReset.Token
                  ? "Reset Password"
                  : "Send reset password link"}
              </button>
            )}
            <button
              type="button"
              className="medium-static-button static-button"
              onClick={this.cancel}
            >
              Go Home
            </button>
          </div>
          {this.state.showError && this.alertNotValid}
          {this.state.message && (
            <Alert
              headerText="Success"
              text={this.state.message}
              mode="success"
              onClose={() => this.props.history.push("/")}
              showOkButton={true}
              onOkButtonClick={() => this.props.history.push("/")}
            />
          )}
          {this.state.error != null && (
            <Alert
              headerText="Error"
              text={this.state.error}
              mode="error"
              onClose={() => this.setState({ error: null })}
              showOkButton={true}
              onOkButtonClick={() => this.setState({ error: null })}
            />
          )}
        </div>
      </div>
    );
  }
}
export default withStore(PasswordReset);
