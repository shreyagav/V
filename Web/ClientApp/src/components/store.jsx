import React from "react";
import { Service } from "./ApiService";
const StoreContext = React.createContext();

const createStore = (WrappedComponent) => {
  return class extends React.Component {
    state = {
      bodyNoScroll: false,
      tableStileView: true,
      sideBarIsHidden: false,
      narrowScreen: false,
      chapterList: [],
      chapterListAll: [],
      colorList: [
        { name: "Cosmic", color: "#794068" },
        { name: "Violet", color: "#AB4189" },
        { name: "Pink", color: "#f577a3" },
        { name: "Tango", color: "#d16c35" },
        { name: "Pumpkin", color: "#fe7b22" },
        { name: "Supernova", color: "#efb135" },
        { name: "Lime", color: "#8bba19" },
        { name: "Java", color: "#3aa6a0" },
        { name: "Teal", color: "#047884" },
        { name: "Gray", color: "#666666" },
      ],
      eventTypes: [],
      userInfo: null,
      refreshUserInfo: () => {
        var component = this;
        fetch("/api/Account/GetUser")
          .then(function (data) {
            return data.json();
          })
          .then(function (jjson) {
            if (jjson.error == null) {
              var userInfo = {
                userName: jjson.userName,
                userRoles: jjson.userRoles,
                authType: jjson.authType,
                chapterId: jjson.chapterId,
              };
              component.setState({ userInfo: userInfo });
            }
          });
      },
      get: (key) => {
        return this.state[key];
      },
      set: (key, value) => {
        const state = this.state;
        state[key] = value;
        this.setState(state);
      },
      remove: (key) => {
        const state = this.state;
        delete state[key];
        this.setState(state);
      },
      refreshChapters: () => {
        this.componentDidMount();
      },
      /* validators */

      validateOTG: (fieldName, value, validators) => {
        let valid = true;
        validators[fieldName].rules.forEach((rule) => {
          if (rule.test instanceof RegExp) {
            if (!rule.test.test(value)) {
              valid = false;
            }
          } else if (typeof rule.test === "function") {
            if (!rule.test(value)) {
              valid = false;
            }
          }
        });
        return valid;
      },

      updateValidators: (fieldName, value, validators) => {
        validators[fieldName].errors = [];
        validators[fieldName].valid = true;
        validators[fieldName].activated = true;
        validators[fieldName].rules.forEach((rule) => {
          if (rule.test instanceof RegExp) {
            if (!rule.test.test(value)) {
              validators[fieldName].errors.push(rule.message);
              validators[fieldName].valid = false;
            }
          } else if (typeof rule.test === "function") {
            if (!rule.test(value)) {
              validators[fieldName].errors.push(rule.message);
              validators[fieldName].valid = false;
            }
          }
        });
      },

      checkIfValidatorsNeedUpdate: (fieldName, value, validators) => {
        let newErrors = [];
        validators[fieldName].rules.forEach((rule) => {
          if (rule.test instanceof RegExp) {
            if (!rule.test.test(value)) {
              newErrors.push(rule.message);
            }
          } else if (typeof rule.test === "function") {
            if (!rule.test(value)) {
              newErrors.push(rule.message);
            }
          }
        });
        if (!validators[fieldName].activated) {
          return false;
        }
        if (validators[fieldName].errors.length !== newErrors.length) {
          return true;
        } else {
          let outcome = false;
          validators[fieldName].errors.forEach((error, index) => {
            if (error !== newErrors[index]) {
              outcome = true;
            }
          });
          return outcome;
        }
      },

      performIfValid: (element, validators, callback, callback2) => {
        if (this.state.isFormValid(validators, element)) {
          callback();
        } else {
          if (callback2) {
            callback2();
          }
        }
      },

      displayValidationErrors: (fieldName, validators) => {
        const validator = validators[fieldName];
        const result = "";
        if (validator && !validator.valid) {
          const errors = validator.errors.map((info, index) => {
            return (
              <span className="error-message" key={index}>
                {info}
              </span>
            );
          });

          return (
            <div className="w-100 flex-nowrap flex-flow-column">{errors}</div>
          );
        }
        return result;
      },

      checkIfShowError: (fieldName, validators) =>
        !(
          !validators[fieldName] ||
          !validators[fieldName].activated ||
          validators[fieldName].valid
        ),

      // check if the validity of all validators are true
      isFormValid: (validators, xxx) => {
        let status = true;
        Object.keys(validators).forEach((field) => {
          if (validators[field].activated) {
            if (!validators[field].valid) {
              status = false;
            }
          } else {
            this.state.updateValidators(field, xxx[field], validators);
            if (!validators[field].valid) {
              status = false;
            }
          }
        });
        return status;
      },
      /* validators ends */
    };

    componentWillMount() {
      this.checkIfNarrowScreen();
      var component = this;
      window.addEventListener(
        "resize",
        () => this.checkIfNarrowScreen(),
        false,
      );
    }

    componentDidMount() {
      var component = this;
      Service.getChaptersForSelector().then((data) => {
        var visible = JSON.parse(JSON.stringify(data));
        visible.forEach((a) => {
          a.chapters = a.chapters.filter((b) => !b.deleted);
        });
        visible = visible.filter((a) => a.chapters.length > 0);
        component.setState({
          chapterList: visible,
          chapterListAll: data,
          modifiedChapterList: data,
        });
      });
      Service.getEventTypes().then((data) =>
        component.setState({ eventTypes: data }),
      );
    }

    componentWillUnmount() {
      window.removeEventListener(
        "resize",
        () => this.checkIfNarrowScreen(),
        false,
      );
    }

    checkIfNarrowScreen() {
      if (window.innerWidth < 1000) {
        this.setState(() => ({ narrowScreen: true }));
      } else {
        this.setState(() => ({ narrowScreen: false }));
      }
    }

    render() {
      return (
        <StoreContext.Provider value={this.state}>
          <WrappedComponent {...this.props} />
        </StoreContext.Provider>
      );
    }
  };
};

const withStore = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <StoreContext.Consumer>
          {(context) => <WrappedComponent store={context} {...this.props} />}
        </StoreContext.Consumer>
      );
    }
  };
};

export { withStore, createStore };
