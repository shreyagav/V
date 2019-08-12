import React from 'react';
import { Service } from './ApiService';
const StoreContext = React.createContext()

const createStore = WrappedComponent => {
  return class extends React.Component {
    state = {
      bodyNoScroll: false,
      tableStileView: true,
      sideBarIsHidden: false,
      narrowScreen: false,
      chapterList: [],
      colorList: [{name: 'Cosmic', color: '#794068'}, {name: 'Violet', color: '#AB4189'}, {name: 'Pink', color: '#f577a3'}, {name: 'Tango', color: '#d16c35'}, {name: 'Pumpkin', color: '#fe7b22'}, {name: 'Supernova', color: '#efb135'}, {name: 'Lime', color: '#8bba19'}, {name: 'Java', color: '#3aa6a0'}, {name: 'Teal', color: '#047884'}, {name: 'Gray', color: '#666666'}],
      eventTypes:[],
        userInfo: null,
        refreshUserInfo: () => {
            var component = this;
            fetch('/api/Account/GetUser')
                .then(function (data) { return data.json(); })
                .then(function (jjson) {
                    if (jjson.error == null) {
                        var userInfo = { userName: jjson.userName, userRoles: jjson.userRoles, authType: jjson.authType, chapterId: jjson.chapterId };
                        component.setState({ userInfo: userInfo });
                    }
                });
        },
      get: key => {
        return this.state[key]
      },
      set: (key, value) => {
        const state = this.state
        state[key] = value
        this.setState(state)
      },
      remove: key => {
        const state = this.state
        delete state[key]
        this.setState(state)
      },

      /* validators */

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
          } else if (typeof rule.test === 'function') {
            if (!rule.test(value)) {
              validators[fieldName].errors.push(rule.message);
              validators[fieldName].valid = false;
            }
          }
        });
      },
      //TODO : delete when proven not used
      /*
      resetValidators: (validators) => {
        Object.keys(validators).forEach((fieldName) => {
          validators[fieldName].errors = [];
          validators[fieldName].valid = false;
          validators[fieldName].activated = false;
        });
      },
      */

      displayValidationErrors: (fieldName, validators) => {
        const validator = validators[fieldName];
        const result = '';
        if (validator && !validator.valid) {
          const errors = validator.errors.map((info, index) => {
            return <span className="error-message" key={index}>{info}</span>;
          });
    
          return (
            <div className="w-100 flex-nowrap flex-flow-column">
              {errors}
            </div>
          );
        }
        return result;
      },

      checkIfShowError: (fieldName, validators) => {
        if(!validators[fieldName].activated || validators[fieldName].valid) {return false}
        else return true
      },

      // check if the validity of all validators are true
      isFormValid: (validators, xxx) => {
        let status = true;
        Object.keys(validators).forEach((field) => {
          if (validators[field].activated) {
            if(!validators[field].valid) {
              status = false;
            }
          } else {
            this.state.updateValidators(field, xxx[field], validators);
            if(!validators[field].valid) {
              status = false;
            }
          }
        });
        return status;
      }
      /* validators ends */

    }

    componentWillMount() {
        this.checkIfNarrowScreen();
        var component = this;
        window.addEventListener("resize", () => this.checkIfNarrowScreen(), false);
      }


    componentDidMount() {
        var component = this;
        Service.getChaptersForSelector().then(data => component.setState({ chapterList: data, modifiedChapterList: data }));
        Service.getEventTypes().then(data => component.setState({ eventTypes: data}, console.log(this.state.eventTypes)));
    }

    componentWillUnmount() {
      window.removeEventListener("resize", () => this.checkIfNarrowScreen(), false);
    }

    checkIfNarrowScreen() {
      if (window.innerWidth < 1000) {this.setState(() => ({narrowScreen: true}))}
      else {this.setState(() => ({narrowScreen: false}))}
    }

    render() {
      return (
        <StoreContext.Provider value={this.state}>
          <WrappedComponent {...this.props} />
        </StoreContext.Provider>
      )
    }
  }
}

const withStore = WrappedComponent => {
    return class extends React.Component {

      render() {
      return (
        <StoreContext.Consumer>
          {context => <WrappedComponent store={context} {...this.props} />}
        </StoreContext.Consumer>
      )
    }
  }
}

export { withStore, createStore }
