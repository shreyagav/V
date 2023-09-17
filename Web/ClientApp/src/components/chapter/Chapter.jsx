import React, { Component } from "react";
import TabComponent from "../TabComponent";
import MultiDropDown from "../MultiDropDown/MultiDropDown";
import CloseUpSVG from "../../svg/CloseUpSVG";
import ArrowUpSVG from "../../svg/ArrowUpSVG";
import EditUpSVG from "../../svg/EditUpSVG";
import { withStore } from "../store";
import EditContact from "../EditContact";
import CheckBoxSVG from "../../svg/CheckBoxSVG";
import { Service } from "../ApiService";
import InputWithClearButton from "../InputWithClearButton";
import { createValidators } from "../storeValidatorsRules";
import { alertNotValid } from "../alerts";
import CheckBox from "../CheckBox";
import DeleteUpSVG from "../../svg/DeleteUpSVG";
import SaveUpSVG from "../../svg/SaveUpSVG";
import Alert from "../Alert";

class Chapter extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    props.store.refreshUserInfo();
    let chapterId = 0;
    if (props.match.params.id) {
      chapterId = props.match.params.id;
    }
    this.state = {
      chapter: {
        id: chapterId,
        name: "",
        regionId: 0,
        groupName: 0,
        securityClearance: "",
        description: "",
        poolRental: false,
        allowEverybody: false,
        main: { name: "", phone: "", email: "" },
        govt: { name: "", phone: "", email: "" },
        coordinator: { name: "", phone: "", email: "" },
        national: { name: "", phone: "", email: "" },
        outreach: { name: "", phone: "", email: "" },
      },
      activeTabIndex: 0,
      regions: [],
      members: [],
      showError: false,
      error: "",
      saveEnabled: true,
      showDeleteDialog: false,
      showSuccessfullySavedDialog: false,
    };
    this.setActiveTab = this.setActiveTab.bind(this);
    this.regionsDropDownRef = null;
    this.poolRentalDropDownRef = null;
  }

  componentWillMount() {
    let chapterValidators = [
      { name: "name", typeFunction: "notEmptyString", text: "Chapter Name" },
      { name: "regionId", typeFunction: "dropDownValue", text: "Region" },
    ];
    this.validators = createValidators(chapterValidators);
    this.alertNotValid = alertNotValid(() =>
      this.setState({ showError: false }),
    );
    let contactValidators = [
      { name: "name", typeFunction: "nameOTG", text: "Name" },
      { name: "phone", typeFunction: "nameOTG", text: "Phone" },
      { name: "email", typeFunction: "nameOTG", text: "Email" },
    ];
    this.contactMainValidators = createValidators(contactValidators);
    this.contactGovtValidators = createValidators(contactValidators);
    this.contactCoordinatorValidators = createValidators(contactValidators);
    this.contactNationalValidators = createValidators(contactValidators);
    this.contactOutreachValidators = createValidators(contactValidators);
    let contactValidatorsOTG = [
      { name: "name", typeFunction: "nameOTG", text: "Name" },
      { name: "phone", typeFunction: "nameOTG", text: "Phone" },
      { name: "email", typeFunction: "nameOTG", text: "Email" },
    ];
    this.contactMainValidatorsOTG = createValidators(contactValidatorsOTG);
    this.contactGovtValidatorsOTG = createValidators(contactValidatorsOTG);
    this.contactCoordinatorValidatorsOTG =
      createValidators(contactValidatorsOTG);
    this.contactNationalValidatorsOTG = createValidators(contactValidatorsOTG);
    this.contactOutreachValidatorsOTG = createValidators(contactValidatorsOTG);
  }

  componentDidMount() {
    Service.getAllRegions().then((data) => this.setState({ regions: data }));
    if (this.state.chapter.id != 0) {
      Service.getChapterById(this.state.chapter.id).then((data) =>
        this.setState({ chapter: data }),
      );
      Service.getChapterMembers(this.state.chapter.id).then((data) =>
        this.setState({ members: data }),
      );
    }
  }

  toggleContact(key) {
    const state = this.state;
    state[key] = !state[key];
    this.setState(state);
  }

  setValue(key, value) {
    const state = this.state;
    state[key] = value;
    this.setState(state);
  }

  updateChapterProperty(property, value) {
    let temp = this.state.chapter;
    temp[property] = value;
    this.setState({ chapter: temp });
  }

  setActiveTab(index) {
    if (index > 0) {
    } else {
      this.setState({ activeTabIndex: index });
    }
  }

  renderHeader() {
    if (this.props.match.path == "/new-chapter") {
      return (
        <h1 className="uppercase-text mb-2">
          New<strong> Chapter</strong>
        </h1>
      );
    } else {
      return (
        <h1 className="uppercase-text mb-2">
          Edit<strong> Chapter</strong>
        </h1>
      );
    }
  }

  performIfValid(callback) {
    this.props.store.isFormValid(this.validators, this.state.chapter) &&
      this.props.store.isFormValid(
        this.contactMainValidators,
        this.state.chapter.main,
      ) &&
      this.props.store.isFormValid(
        this.contactGovtValidators,
        this.state.chapter.govt,
      ) &&
      this.props.store.isFormValid(
        this.contactCoordinatorValidators,
        this.state.chapter.coordinator,
      ) &&
      this.props.store.isFormValid(
        this.contactNationalValidators,
        this.state.chapter.national,
      ) &&
      this.props.store.isFormValid(
        this.contactOutreachValidators,
        this.state.chapter.outreach,
      );
    if (
      this.props.store.isFormValid(this.validators, this.state.chapter) &&
      this.props.store.isFormValid(
        this.contactMainValidators,
        this.state.chapter.main,
      ) &&
      this.props.store.isFormValid(
        this.contactGovtValidators,
        this.state.chapter.govt,
      ) &&
      this.props.store.isFormValid(
        this.contactCoordinatorValidators,
        this.state.chapter.coordinator,
      ) &&
      this.props.store.isFormValid(
        this.contactNationalValidators,
        this.state.chapter.national,
      ) &&
      this.props.store.isFormValid(
        this.contactOutreachValidators,
        this.state.chapter.outreach,
      )
    ) {
      callback();
    } else {
      this.setState({ showError: true });
    }
  }

  saveChapter() {
    this.setState({ saveEnabled: false });
    Service.saveChapter(this.state.chapter)
      .then((data) => {
        this.setState({ showSuccessfullySavedDialog: true });
      })
      .catch((data) => {
        alert(data);
        this.setState({ saveEnabled: true });
      });
  }

  deleteChapter() {
    Service.deleteChapter(this.state.chapter).then((data) => {
      if (data.ok == true) {
        this.props.store.refreshChapters();
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

  onContactInputValueChange(
    contact,
    param,
    newValue,
    validators,
    validatorsOTG,
  ) {
    let value = this.state.chapter[contact];
    value[param] = newValue;
    if (this.props.store.validateOTG(param, newValue, validatorsOTG)) {
      if (
        this.props.store.checkIfValidatorsNeedUpdate(
          param,
          newValue,
          validators,
        )
      ) {
        this.props.store.updateValidators(param, newValue, validators);
      }
      this.updateChapterProperty(contact, value);
    }
  }

  updateContactValidators(contact, param, validators) {
    this.props.store.updateValidators(
      param,
      this.state.chapter[contact][param],
      validators,
    );
    this.setState({ update: true });
  }

  render() {
    const members = this.state.members;
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
                disabled={!this.state.saveEnabled}
                className="round-button medium-round-button outline-on-hover"
                onClick={() => this.performIfValid(() => this.saveChapter())}
              >
                <SaveUpSVG />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/*this.state.loading && <Loader />*/}

        {this.renderHeader()}

        {/*<div className='flex-wrap flex-flow-column mb-3'>
                    <TabComponent 
                        fixedHeight={true}
                        tabList={['information', 'Members']}
                        wasSelected={(index) => this.performIfValid(() => this.setActiveTab(index))}
                        activeTabIndex = {this.state.activeTabIndex}
                    />
                </div>*/}
        {
          /*this.state.activeTabIndex === 0 && */
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <ul className="input-fields first-child-text-165 mt-1 pl-1 pr-1">
              <li>
                <p>Chapter Name:</p>
                <div
                  className={
                    this.props.store.checkIfShowError("name", this.validators)
                      ? "error-input-wrapper"
                      : ""
                  }
                >
                  <InputWithClearButton
                    type="text"
                    placeholder="Chapter Name"
                    value={this.state.chapter.name}
                    onChange={(e) => {
                      this.updateChapterProperty("name", e.target.value);
                      this.props.store.updateValidators(
                        "name",
                        e.target.value,
                        this.validators,
                      );
                    }}
                    onClearValue={() => {
                      this.updateChapterProperty("name", "");
                      this.props.store.updateValidators(
                        "name",
                        "",
                        this.validators,
                      );
                    }}
                  />
                  {this.props.store.displayValidationErrors(
                    "name",
                    this.validators,
                  )}
                </div>
              </li>
              <li>
                <p>Region:</p>
                <div
                  className={
                    this.props.store.checkIfShowError(
                      "regionId",
                      this.validators,
                    )
                      ? "error-input-wrapper"
                      : ""
                  }
                >
                  <MultiDropDown
                    ref={(el) => (this.regionsDropDownRef = el)}
                    list={this.state.regions}
                    multiSelect={false}
                    keyProperty="regionId"
                    textProperty="regionName"
                    defaultValue={this.state.chapter.regionId}
                    placeholder="Select state"
                    onDropDownValueChange={(value) => {
                      this.updateChapterProperty("regionId", value);
                      this.props.store.updateValidators(
                        "regionId",
                        value,
                        this.validators,
                      );
                    }}
                  />
                  {this.props.store.displayValidationErrors(
                    "regionId",
                    this.validators,
                  )}
                </div>
              </li>

              {/*li>
                            <p>Security Clearace:</p>
                            <InputWithClearButton 
                                type='text' 
                                placeholder='Security Clearance'
                                value = {this.state.chapter.securityClearance}
                                onChange={e => {
                                    this.updateChapterProperty("securityClearance", e.target.value)
                                }}
                                onClearValue = {() => {
                                    this.updateChapterProperty("securityClearance", ""); 
                                }}
                            />
                        </li>*/}

              <li className="alignCenter">
                <p>Pool Rental:</p>
                <CheckBox
                  className="mb-025"
                  onClick={() =>
                    this.updateChapterProperty(
                      "poolRental",
                      !this.state.chapter.poolRental,
                    )
                  }
                  checked={this.state.chapter.poolRental}
                  labelClassName="uppercase-text bold-text"
                  labelText={this.state.chapter.poolRental ? "Yes" : "No"}
                />
              </li>
              <li className="alignCenter">
                <p>For everybody:</p>
                <CheckBox
                  className="mb-025"
                  onClick={() =>
                    this.updateChapterProperty(
                      "allowEverybody",
                      !this.state.chapter.allowEverybody,
                    )
                  }
                  checked={this.state.chapter.allowEverybody}
                  labelClassName="uppercase-text bold-text"
                  labelText={this.state.chapter.allowEverybody ? "Yes" : "No"}
                />
              </li>
            </ul>

            <div className="flex-nowrap align-center mt-2 mb-1 ml-1 mr-1">
              <span className="line"></span>
              <p className="pr-05 pl-05">
                <strong>CONTACTS</strong>
              </p>
              <span className="line"></span>
            </div>

            <ul className="input-fields first-child-text-165 mt-3 mb-2 pl-1 pr-1">
              <EditContact
                header={"Main:"}
                value={this.state.chapter.main}
                onInputValueChange={(param, newValue) =>
                  this.onContactInputValueChange(
                    "main",
                    param,
                    newValue,
                    this.contactMainValidators,
                    this.contactMainValidatorsOTG,
                  )
                }
                isFormValid={this.props.store.isFormValid}
                showError={() => this.setState({ showError: true })}
                validators={this.contactMainValidators}
                updateValidators={(param) =>
                  this.updateContactValidators(
                    "main",
                    param,
                    this.contactMainValidators,
                  )
                }
              />
              <EditContact
                header={"Government:"}
                value={this.state.chapter.govt}
                onInputValueChange={(param, newValue) =>
                  this.onContactInputValueChange(
                    "govt",
                    param,
                    newValue,
                    this.contactGovtValidators,
                    this.contactGovtValidatorsOTG,
                  )
                }
                isFormValid={this.props.store.isFormValid}
                showError={() => this.setState({ showError: true })}
                validators={this.contactGovtValidators}
                updateValidators={(param) =>
                  this.updateContactValidators(
                    "govt",
                    param,
                    this.contactGovtValidators,
                  )
                }
              />
              <EditContact
                header={"Coordinator:"}
                value={this.state.chapter.coordinator}
                onInputValueChange={(param, newValue) =>
                  this.onContactInputValueChange(
                    "coordinator",
                    param,
                    newValue,
                    this.contactCoordinatorValidators,
                    this.contactCoordinatorValidatorsOTG,
                  )
                }
                isFormValid={this.props.store.isFormValid}
                showError={() => this.setState({ showError: true })}
                validators={this.contactCoordinatorValidators}
                updateValidators={(param) =>
                  this.updateContactValidators(
                    "coordinator",
                    param,
                    this.contactCoordinatorValidators,
                  )
                }
              />
              <EditContact
                header={"National:"}
                value={this.state.chapter.national}
                onInputValueChange={(param, newValue) =>
                  this.onContactInputValueChange(
                    "national",
                    param,
                    newValue,
                    this.contactNationalValidators,
                    this.contactNationalValidatorsOTG,
                  )
                }
                isFormValid={this.props.store.isFormValid}
                showError={() => this.setState({ showError: true })}
                validators={this.contactNationalValidators}
                updateValidators={(param) =>
                  this.updateContactValidators(
                    "national",
                    param,
                    this.contactNationalValidators,
                  )
                }
              />
              <EditContact
                header={"Outreach:"}
                value={this.state.chapter.outreach}
                onInputValueChange={(param, newValue) =>
                  this.onContactInputValueChange(
                    "outreach",
                    param,
                    newValue,
                    this.contactOutreachValidators,
                    this.contactOutreachValidatorsOTG,
                  )
                }
                isFormValid={this.props.store.isFormValid}
                showError={() => this.setState({ showError: true })}
                validators={this.contactOutreachValidators}
                updateValidators={(param) =>
                  this.updateContactValidators(
                    "outreach",
                    param,
                    this.contactOutreachValidators,
                  )
                }
              />
            </ul>
          </div>
        }
        {/*this.state.activeTabIndex === 1 && 
                <div style={{"width":"100%", "maxWidth":"600px"}}>
                    <div className="flex-wrap align-center justify-center mt-2 mb-2">
                        <p className='input-label pr-1s '>ADD MEMBERS:</p>
                        <span className="flex-nowrap">
                            <button disabled className='big-static-button static-button' >
                                Create New
                            </button>
                            <button disabled className='big-static-button static-button' >
                                Add Member
                            </button>
                        </span>
                    </div>
                    <ul className='table-element mt-1 mb-2'>
                        <li>
                            <ul className='table-element-header table-element-member table-member'>
                                <li>Name</li>
                                <li className='no-break'>Role</li>
                                <li>Phone</li>
                                <li>Email</li>
                                <li></li>
                            </ul>
                        </li>
                        {
                        members.map((element,index) => 
                            <ul key={index} className='table-element-content table-element-member table-member'>
                                <li >{element.firstName + " " + element.lastName}</li>
                                <li className='no-break'>{element.role}</li>
                                <li >{element.phone}</li>
                                <li >{element.email}</li>
                                <li className='no-padding'>
                                <button disabled className='square-button-width'>
                                    <CloseUpSVG svgClassName='flip90'/>
                                </button>
                                </li>
                            </ul>
                            )
                        }
                    </ul>
                </div>
                */}
        {/*<div className='flex-wrap'>
                    {this.state.activeTabIndex > 0 &&
                        <button 
                            className='medium-static-button static-button' 
                            onClick={() => this.performIfValid(() => this.setActiveTab(this.state.activeTabIndex - 1))}
                        >Back</button>
                    }
                    {this.state.activeTabIndex < 3 &&
                        <button 
                            className='medium-static-button static-button default-button' 
                            onClick={() => this.performIfValid(() => this.setActiveTab(this.state.activeTabIndex + 1))}
                        >Next</button>
                    }
                </div>*/}

        {this.state.showError && this.alertNotValid}

        {this.state.showDeleteDialog && (
          <Alert
            headerText="Delete"
            text="Are you sure you want to delete this Chapter?"
            onClose={() => this.setState({ showDeleteDialog: false })}
            showOkCancelButtons={true}
            onCancelButtonClick={() =>
              this.setState({ showDeleteDialog: false })
            }
            onOkButtonClick={() => {
              this.deleteChapter();
            }}
            cancelButtonText="Cancel"
            okButtonText="Delete"
            mode="warning"
          >
            <h4 className="mb-05">{this.state.chapter.name}</h4>
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
            onOkButtonClick={() => {
              this.setState({ showSuccessfullySavedDialog: false });
              this.props.history.push("/chapters");
            }}
            okButtonText="Ok"
            mode="success"
          >
            <h4 className="mb-05">{this.state.chapter.name}</h4>
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
              Error while deleting chapter {this.state.chapter.name}
            </h4>
            <p style={{ textAlign: "center" }}> {this.state.error} </p>
          </Alert>
        )}
      </div>
    );
  }
}

export default withStore(Chapter);
