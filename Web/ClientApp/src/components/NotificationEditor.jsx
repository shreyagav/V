import React, { Component } from "react";
import InputWithClearButton from "../components/InputWithClearButton";
import Alert from "../components/Alert";
import MultiDropDown from "../components/MultiDropDown/MultiDropDown";
import CheckBox from "../components/CheckBox";
import { Service } from "../components/ApiService";

export default class EventEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      showError: false,
      error: "",
      showDeleteDialog: false,
      showSuccessfullySavedDialog: false,
      attendiesOnly: true,
      filteredList: [],
      tempMembers: [],
    };
    this.reloadMembers = this.reloadMembers.bind(this);
    this.textPropertyRender = this.textPropertyRender.bind(this);
  }

  componentDidMount() {
    this.reloadMembers(this.state.attendiesOnly);
  }
  reloadMembers(attendiesOnly) {
    if (attendiesOnly) {
      Service.getEventAttendees(this.props.eventId).then((data) =>
        this.setState({ members: data }),
      );
    } else {
      Service.getSiteMembersOnly(this.props.chapterId).then((data) =>
        this.setState({
          members: data.filter((a) => a.email && a.email != ""),
        }),
      );
    }
  }

  textPropertyRender(element, textProperty) {
    return (
      <div>
        {(element["firstName"] !== undefined ||
          element["lastName"] !== undefined) && (
          <span className="name">
            {element["firstName"] + " " + element["lastName"]}
          </span>
        )}
        {element["email"] !== undefined && (
          <span className="email">{element["email"]}</span>
        )}
      </div>
    );
  }
  render() {
    const members = this.state.members;
    console.log(this.props);

    return (
      <div className="pages-wsm-wrapper ipw-600">
        <h2 className="uppercase-text mb-2">
          New<strong> Email</strong>
        </h2>
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <ul className="input-fields first-child-text-165 mt-1 pl-1 pr-1">
            <li>
              <p>TO:</p>
              <div>
                <div className="flex-wrap justify-space-between align-center mr-075 ml-05 mb-05">
                  <div className="flex-wrap justify-left">
                    <CheckBox
                      className="mr-1 mb-1 ml-025"
                      onClick={() => {
                        this.reloadMembers(!this.state.attendiesOnly);
                        this.setState({
                          attendiesOnly: !this.state.attendiesOnly,
                        });
                      }}
                      checked={this.state.attendiesOnly}
                      labelStyle={{ fontSize: "0.9rem" }}
                      labelText={<span>Attendies only</span>}
                    />
                  </div>
                </div>
                <div style={{ border: "1px solid #999999" }}>
                  {members.length > 0 && (
                    <MultiDropDown
                      className="pr-075"
                      list={members}
                      multiSelect={true}
                      toggleable={false}
                      keyProperty="id"
                      textProperty="email"
                      defaultValue={this.props.notification.recepients}
                      placeholder="Select from the list"
                      onDropDownValueChange={(value) =>
                        this.props.updateNotification("recepients", [...value])
                      }
                      hideHeader={true}
                      substractHeight={400}
                      textPropertyRender={this.textPropertyRender}
                    />
                  )}
                </div>
              </div>
            </li>
            <li>
              <p>Subject:</p>
              <div>
                <InputWithClearButton
                  type="text"
                  placeholder="Subject"
                  value={this.props.notification.subject}
                  onChange={(e) => {
                    this.props.updateNotification("subject", e.target.value);
                  }}
                  onClearValue={() => {
                    this.props.updateNotification("subject", "");
                  }}
                />
              </div>
            </li>
            <li>
              <p className="mark-optional">Body:</p>
              <div className="input-button-wrapper">
                <textarea
                  style={{ height: "200px" }}
                  ref={(el) => (this.descriptionInputRef = el)}
                  placeholder="Description"
                  value={this.props.notification.body}
                  onChange={(evt) =>
                    this.props.updateNotification("body", evt.target.value)
                  }
                />
              </div>
            </li>
          </ul>
        </div>
        {this.state.showError && this.alertNotValid}

        {this.state.showSuccessfullySavedDialog && (
          <Alert
            headerText="Success"
            onClose={() =>
              this.setState({ showSuccessfullySavedDialog: false })
            }
            showOkButton={true}
            onOkButtonClick={() =>
              this.setState({ showSuccessfullySavedDialog: false })
            }
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
