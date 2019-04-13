import React from 'react';

const StoreContext = React.createContext()

const createStore = WrappedComponent => {
  return class extends React.Component {
    state = {
      sideBarIsHidden: false,
      narrowScreen: false,
      tableStileView: true,
      chapterList: [],
      colorList: [{name: 'Cosmic', color: '#794068'}, {name: 'Violet', color: '#AB4189'}, {name: 'Cerise', color: '#E53E71'}, {name: 'Amaranth', color: '#f2575b'}, {name: 'Tango', color: '#d16c35'}, {name: 'Pumpkin', color: '#fe7b22'}, {name: 'Supernova', color: '#fec037'}, {name: 'Gorse', color: '#ffe32e'}, {name: 'Lime', color: '#8bba19'}, {name: 'Java', color: '#3aa6a0'}, {name: 'Sky', color: '#0099cc'}, {name: 'Gray', color: '#666666'}],

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
