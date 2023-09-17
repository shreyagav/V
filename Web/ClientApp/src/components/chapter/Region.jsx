import React, { Component } from "react";
import TabComponent from "../TabComponent";
import MultiDropDown from "../MultiDropDown/MultiDropDown";
import CloseUpSVG from "../../svg/CloseUpSVG";
import ArrowUpSVG from "../../svg/ArrowUpSVG";
import EditUpSVG from "../../svg/EditUpSVG";
import { withStore } from "../store";
import CheckBoxSVG from "../../svg/CheckBoxSVG";
import { Service } from "../ApiService";
import InputWithClearButton from "../InputWithClearButton";
import { createValidators } from "../storeValidatorsRules";
import { alertNotValid } from "../alerts";
import CheckBox from "../CheckBox";
import DeleteUpSVG from "../../svg/DeleteUpSVG";
import SaveUpSVG from "../../svg/SaveUpSVG";
import Alert from "../Alert";

class Region extends Component {
  constructor(props) {
    super(props);
    props.store.refreshUserInfo();
    let regionId = 0;
    if (props.match.params.id) {
      regionId = props.match.params.id;
    }
    this.state = {
      region: {
        regionId: regionId,
        regionName: "",
        shortName: "",
      },
      showError: false,
      error: "",
      showDeleteDialog: false,
      showSuccessfullySavedDialog: false,
    };
  }

  componentWillMount() {
    let regionValidators = [
      {
        name: "regionName",
        typeFunction: "notEmptyString",
        text: "Region Name",
      },
      { name: "shortName", typeFunction: "notEmptyString", text: "Short Name" },
    ];
    this.validators = createValidators(regionValidators);
    this.alertNotValid = alertNotValid(() =>
      this.setState({ showError: false }),
    );
  }

  componentDidMount() {
    if (this.state.region.regionId != 0) {
      Service.getRegionById(this.state.region.regionId).then((data) =>
        this.setState({ region: data }),
      );
    }
  }

  setValue(key, value) {
    const state = this.state;
    state[key] = value;
    this.setState(state);
  }

  updateRegionProperty(property, value) {
    let temp = this.state.region;
    temp[property] = value;
    this.setState({ region: temp });
  }

  renderHeader() {
    if (this.props.match.path == "/new-region") {
      return (
        <h1 className="uppercase-text mb-2">
          New<strong> Region</strong>
        </h1>
      );
    } else {
      return (
        <h1 className="uppercase-text mb-2">
          Edit<strong> Region</strong>
        </h1>
      );
    }
  }

  performIfValid(callback) {
    if (this.props.store.isFormValid(this.validators, this.state.region)) {
      callback();
    } else {
      this.setState({ showError: true });
    }
  }

  saveRegion() {
    Service.saveRegion(this.state.region)
      .then((data) => {
        this.setState({ showSuccessfullySavedDialog: true });
      })
      .catch((data) => alert(data));
  }

  deleteRegion() {
    Service.deleteRegion(this.state.region).then((data) => {
      if (data.ok == true) {
        this.props.history.push("/chapters");
      } else {
        var error = "Something wrong happened on the server.";
        if (data.error) {
          error = data.error;
        }
        this.setState({ error: error, showError: true });
      }
    });
  }

  render() {
    return (
      <div className="pages-wsm-wrapper ipw-600">
        <div className="second-nav-wrapper">
          <div className="ipw-600">
            <div></div>
            <div className="flex-nowrap">
              <button
                className="round-button medium-round-button outline-on-hover"
                onClick={() => this.setState({ showDeleteDialog: true })}
              >
                <DeleteUpSVG />
                <span>Delete</span>
              </button>
              <button
                className="round-button medium-round-button outline-on-hover"
                onClick={() => this.performIfValid(() => this.saveRegion())}
              >
                <SaveUpSVG />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {this.renderHeader()}

        {
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <ul className="input-fields first-child-text-165 mt-1 pl-1 pr-1">
              <li>
                <p>Region Name:</p>
                <div
                  className={
                    this.props.store.checkIfShowError(
                      "regionName",
                      this.validators,
                    )
                      ? "error-input-wrapper"
                      : ""
                  }
                >
                  <InputWithClearButton
                    type="text"
                    placeholder="Region Name"
                    value={this.state.region.regionName}
                    onChange={(e) => {
                      this.updateRegionProperty("regionName", e.target.value);
                      this.props.store.updateValidators(
                        "regionName",
                        e.target.value,
                        this.validators,
                      );
                    }}
                    onClearValue={() => {
                      this.updateRegiobProperty("regionName", "");
                      this.props.store.updateValidators(
                        "regionName",
                        "",
                        this.validators,
                      );
                    }}
                  />
                  {this.props.store.displayValidationErrors(
                    "regionName",
                    this.validators,
                  )}
                </div>
              </li>
              <li>
                <p>Short Name:</p>
                <div
                  className={
                    this.props.store.checkIfShowError(
                      "shortName",
                      this.validators,
                    )
                      ? "error-input-wrapper"
                      : ""
                  }
                >
                  <InputWithClearButton
                    type="text"
                    placeholder="Short Name"
                    value={this.state.region.shortName}
                    onChange={(e) => {
                      this.updateRegionProperty("shortName", e.target.value);
                      this.props.store.updateValidators(
                        "shortName",
                        e.target.value,
                        this.validators,
                      );
                    }}
                    onClearValue={() => {
                      this.updateRegionProperty("shortName", "");
                      this.props.store.updateValidators(
                        "shortName",
                        "",
                        this.validators,
                      );
                    }}
                  />
                  {this.props.store.displayValidationErrors(
                    "shortName",
                    this.validators,
                  )}
                </div>
              </li>
            </ul>
          </div>
        }

        {this.state.showError && this.alertNotValid}

        {this.state.showDeleteDialog && (
          <Alert
            headerText="Delete"
            text="Are you sure you want to delete this Region?"
            onClose={() => this.setState({ showDeleteDialog: false })}
            showOkCancelButtons={true}
            onCancelButtonClick={() =>
              this.setState({ showDeleteDialog: false })
            }
            onOkButtonClick={() => {
              this.deleteRegion();
            }}
            cancelButtonText="Cancel"
            okButtonText="Delete"
            mode="warning"
          >
            <h4 className="mb-05">{this.state.region.regionName}</h4>
            <p style={{ textAlign: "center" }}>
              This action cannot be undone. Delete anyway?
            </p>
          </Alert>
        )}

        {this.state.showSuccessfullySavedDialog && (
          <Alert
            headerText="Success"
            onClose={() =>
              this.setState({ showSuccessfullySavedDialog: false })
            }
            showOkButton={true}
            onOkButtonClick={() => this.props.history.push("/chapters")}
            okButtonText="Ok"
            mode="success"
          >
            <h4 className="mb-05">{this.state.region.name}</h4>
            <p style={{ textAlign: "center" }}> Was successfully saved </p>
          </Alert>
        )}
        {this.state.showError && (
          <Alert
            headerText="Success"
            onClose={() => this.setState({ showError: false })}
            showOkButton={true}
            onOkButtonClick={() => this.setState({ showError: false })}
            okButtonText="Ok"
            mode="error"
          >
            <h4 className="mb-05">
              Error while deleting region {this.state.region.name}
            </h4>
            <p style={{ textAlign: "center" }}> {this.state.error} </p>
          </Alert>
        )}
      </div>
    );
  }
}

export default withStore(Region);
