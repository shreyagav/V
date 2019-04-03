import React from 'react';

const StoreContext = React.createContext()

const createStore = WrappedComponent => {
  return class extends React.Component {
    state = {
      sideBarIsHidden: false,
      narrowScreen: false,
      tableStileView: true,
      chapterList: [],

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
      window.addEventListener("resize", () => this.checkIfNarrowScreen(), false);
    }

    componentDidMount() {
      var component = this;
      fetch('/Chapters.json')
      .then(function(data){return data.json();})
      .then(function(jjson){
        component.setState({chapterList: jjson, modifiedChapterList: jjson})
      });
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
