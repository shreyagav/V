import React from 'react';
import { Service } from './ApiService';
const StoreContext = React.createContext()

const createStore = WrappedComponent => {
  return class extends React.Component {
    state = {
      sideBarIsHidden: false,
      narrowScreen: false,
      tableStileView: true,
      chapterList: [],
      userInfo:null,
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
      }
    }

    componentWillMount() {
        this.checkIfNarrowScreen();
        var component = this;
        window.addEventListener("resize", () => this.checkIfNarrowScreen(), false);
        fetch('/api/Account/GetUser')
            .then(function (data) { return data.json(); })
            .then(function (jjson) {
                if (jjson.error == null) {
                    var userInfo = { userName: jjson.userName, userRole: jjson.userRole };
                    component.setState({ userInfo: userInfo });
                }
            });
    }

    componentDidMount() {
        var component = this;
        Service.getChaptersForSelector().then(data => component.setState({ chapterList: data, modifiedChapterList: data }));
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
