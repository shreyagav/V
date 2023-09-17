import React, { Component } from "react";
import MultiDropDown from "./MultiDropDown/MultiDropDown";
import DatePicker from "./DatePicker";
import CloseUpSVG from "../svg/CloseUpSVG";
import TimePicker from "./TimePicker";
import { withStore } from "./store";
import { Service } from "./ApiService";
import Table from "./Table";

import VolunteerUpSVG from "../svg/VolunteerUpSVG";
import VeteranUpSVG from "../svg/VeteranUpSVG";
import Alert from "./Alert";

class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateFilter1: [],
      stateFilter2: 8,
      stateFilter3: [2, 3, 4],
      stateFilter4: "444",
      stateFilter5: "#666666",
    };
    this.chaptersDropDownRef = null;

    this.searchFunction = this.searchFunction.bind(this);
  }

  componentWillMount() {
    var me = this;
    setTimeout(() => {
      console.log("set state");
      me.setState({ stateFilter1: [401, 354] });
    }, 2000);
  }

  renderStateColumn(value, row, index, col) {
    return (
      <li
        key={index}
        className={
          col.className ? "table-content " + col.className : "table-content"
        }
        style={{ alignItems: "stretch" }}
      >
        {row["state"].name}
      </li>
    );
  }

  renderChaptersList(value, row, index, col) {
    return (
      <li
        key={index}
        className={
          col.className ? "table-content " + col.className : "table-content"
        }
        style={{ alignItems: "stretch" }}
      >
        <ul>
          {row["chapters"].map((element) => (
            <li style={{ fontSize: "1.1em" }} key={index + element["name"]}>
              <a href="/new-chapter">{element["name"]}</a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  filterList() {
    let list = this.props.store.chapterList;
    if (
      this.state.stateFilter !== "" &&
      this.state.stateFilter !== "National"
    ) {
      const newList = this.props.store.chapterList.filter(
        (element) => element.state === this.state.stateFilter.name,
      );
      list = newList;
    }
    return list;
  }

  searchFunction() {
    return this.props.store.chapterList;
  }

  render() {
    /*const chapterList = this.filterList();*/
    const stateList = Array.from(this.props.store.chapterList, (element) => {
      return { name: element.state.name };
    });
    const columns = [
      {
        title: "State",
        accesor: "state",
        className: "borders-when-display-block chapter",
        render: this.renderStateColumn,
      },
      {
        title: "Chapters",
        accesor: "chapters",
        render: this.renderChaptersList,
      },
    ];

    return (
      <div className="flex-nowrap justify-center">
        <div
          className="flex-nowrap flex-flow-column align-center mt-3 pb-2 mediaMin500-pl-pr-025"
          style={{ width: "600px" }}
        >
          <div className="flex-wrap align-center justify-space-between w-100 mb-2 mediaMax500-pl-pr-025">
            <h1 className="uppercase-text">
              <strong>Chapters</strong>
            </h1>
            <a className="big-static-button static-button" href="/new-chapter">
              <p>ADD NEW CHAPTER</p>
            </a>
          </div>
          <div className="label-input-wrapper mediaMax500-pl-pr-025">
            <p>CHAPTER:</p>

            <MultiDropDown
              getListAsync={(searchValue) =>
                fetch("/api/Reports/MembersWithSearch/" + searchValue).then(
                  (resp) => {
                    return resp.json();
                  },
                )
              }
              list={this.props.store.chapterList}
              toggleable={true}
              multiSelect={true}
              keyProperty="id"
              textProperty="state"
              expandBy="chapters"
              expandedTextProperty="name"
              expandedKeyProperty="id"
              expandedMultiSelect={true}
              defaultValue={this.state.stateFilter1}
              placeholder="National"
              onDropDownValueChange={(value) =>
                this.setState({ stateFilter1: value })
              }
              searchNoWrap={false}
              noSearchIcon={true}
              search={this.searchFunction}
              //searchParams={['abbreviation', 'name']}
            />

            <MultiDropDown
              list={this.props.store.chapterList}
              toggleable={true}
              multiSelect={false}
              keyProperty="id"
              textProperty="state"
              expandBy="chapters"
              expandedTextProperty="name"
              expandedKeyProperty="id"
              expandedMultiSelect={false}
              defaultValue={this.state.stateFilter10}
              placeholder="National"
              onDropDownValueChange={(value) =>
                this.setState({ stateFilter10: value })
              }
            />
            {/*

                        <MultiDropDown 
                            list={this.props.store.chapterList}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter2}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter2: value})}
                        />
                        
                        <MultiDropDown 
                            list={this.props.store.chapterList}
                            multiSelect={true}
                            keyProperty='id'
                            textProperty='state'
                            defaultValue={this.state.stateFilter3}
                            placeholder='National'
                            onDropDownValueChange = {value => this.setState({stateFilter3: value})}
                        />

                        <MultiDropDown
                            list={[{name: 'Veteran', role: [{name: '111', img: <VeteranUpSVG />},{name: '222', img: <VolunteerUpSVG />}]},{name: 'Volunteer', role: [{name: '333', img: <VeteranUpSVG />},{name: '444', img: <VolunteerUpSVG />}]}]}
                            keyProperty='name'
                            textProperty='name'
                            defaultValue={this.state.stateFilter4}
                            placeholder='Role'
                            expandBy='role'
                            expandedTextProperty='name'
                            expandedKeyProperty='name'
                            onDropDownValueChange = {value => this.setState({stateFilter4: value})}
                        />

                        <MultiDropDown
                            list={this.props.store.colorList} 
                            keyProperty='color'
                            textProperty='name'
                            defaultValue={this.state.stateFilter5}
                            placeholder='Color'
                            onDropDownValueChange = {value => this.setState({stateFilter5: value})}
                        /> */}
          </div>
          {this.state.showAlert && (
            <Alert
              headerText="Warning!"
              onClose={() => this.setState({ showAlert: false })}
              showOkButton={true}
              mode="warning"
            >
              <span>Here is some Alert Text YAY!</span>
            </Alert>
          )}
          {this.state.showSuccess && (
            <Alert
              headerText="Success!"
              onClose={() => this.setState({ showSuccess: false })}
              showOkButton={true}
              mode="success"
            >
              <span>Here is some Alert Text YAY!</span>
            </Alert>
          )}
          {this.state.showError && (
            <Alert
              headerText="Error!"
              onClose={() => this.setState({ showError: false })}
              showOkButton={true}
              buttonText="Got IT!"
              onOkButtonClick={() => this.setState({ showError: false })}
              mode="error"
            >
              <span>Here is some Alert Text YAY!</span>
            </Alert>
          )}
          {this.state.showRegular && (
            <Alert
              headerText="Regular Modal Window"
              onClose={() => this.setState({ showRegular: false })}
            >
              <span>Here is some Alert Text YAY!</span>
            </Alert>
          )}
          {this.state.showRegularWithBUttons && (
            <Alert
              headerText="Regular Modal Window with 2 buttons"
              onClose={() => this.setState({ showRegularWithBUttons: false })}
              showOkCancelButtons={true}
              onCancelButtonClick={() => {
                alert("cancel button was clicked");
                this.setState({ showRegularWithBUttons: false });
              }}
              onOkButtonClick={() => {
                alert("ok button was clicked");
                this.setState({ showRegularWithBUttons: false });
              }}
              cancelButtonText="NO"
              okButtonText="YES"
            >
              <span>Here is some Alert Text</span>
            </Alert>
          )}
          <button onClick={() => console.log(this.state)}>check state</button>
          <button onClick={() => this.setState({ showAlert: true })}>
            Warning
          </button>
          <button onClick={() => this.setState({ showSuccess: true })}>
            Success
          </button>
          <button onClick={() => this.setState({ showError: true })}>
            Error
          </button>
          <button onClick={() => this.setState({ showRegular: true })}>
            regular
          </button>
          <button
            onClick={() => this.setState({ showRegularWithBUttons: true })}
          >
            regular with ok and cancel buttons
          </button>
          {/*<Table columns={columns} data={chapterList}/>*/}
        </div>
      </div>
    );
  }
}

export default withStore(TestPage);
