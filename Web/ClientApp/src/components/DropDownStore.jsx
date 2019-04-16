import React from 'react';

const DropDownStoreContext = React.createContext()

const createDropDownStore = WrappedComponent => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            console.log('DropDownStore create', props)
            this.state = {
                list: [],
                modifiedList: [],
                filteredList: [],
                defaultValue: {},
                value: {},
                isOpen: false,
                multiLevelList: false,
                dropDownHeaderRef: null,

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
                onCheckBoxChange: (index, innerIndex) => {
                    this.checkBoxChange(index, innerIndex);
                },
                unselect: (e, element) => {
                    let filteredList = this.state.filteredList;
                    let modifiedList = this.state.modifiedList;
                    let index = -1;
                    let innerIndex = -1;
                    filteredList = this.arrayRemove(filteredList, element.toString());
                    let splittedElement = element.split(', ');
                    if (splittedElement.length > 1) {
                        index = modifiedList.findIndex(element => { return element.state.name === splittedElement[1] });
                        innerIndex = modifiedList[index].chapters.findIndex(element => { return element.name === splittedElement[0] });
                    }
                    else {
                        index = modifiedList.findIndex(element => { return element.state.name === splittedElement[0] });
                    }
                    this.checkBoxChange(index, innerIndex);
                    this.setState({ filteredList, filteredList });
                    e.stopPropagation();
                },
                toggle: () => {
                    let isOpenWas = this.state.isOpen;
                    this.setState(() => ({ isOpen: !this.state.isOpen }));
                    if (isOpenWas) {
                        this.state.dropDownHeaderRef.focus();
                    }
                },
            }

        }

        componentDidMount() {
            this.fillStore(this.props)
        }

        fillStore(props) {
            console.log('DropDownStore WillReceiveProps', props)
            let multiLevelList = false;
            if (props.list !== undefined) {
                if (props.list.length > 0 && props.list[0].hasOwnProperty("state")) {
                    multiLevelList = true;
                }
                if (props.defaultValue !== undefined) {
                    this.setState({ modifiedList: props.list, multiLevelList: multiLevelList, defaultValue: props.defaultValue });
                }
                else { this.setState({ modifiedList: props.list, multiLevelList: multiLevelList }); }
            }
            else {
                if (props.store.chapterList !== undefined) {
                    this.setState({ modifiedList: props.store.chapterList, multiLevelList: true });
                }
            }
        }


        componentWillReceiveProps(props) {
            this.fillStore(props)
    }

    checkBoxChange = (index, innerIndex) => {
        let dropDownList = this.state.modifiedList;
        let filteredList = this.state.filteredList;
        if (innerIndex < 0) {
            dropDownList[index].state.checked = !dropDownList[index].state.checked;
            if(dropDownList[index].state.checked) {
                dropDownList[index].chapters.forEach(element => {
                    element.checked = true;
                    filteredList = this.arrayRemove(filteredList, element.name + ', ' + dropDownList[index].state.name);
                });
                filteredList.push(dropDownList[index].state.name);
            }
            else {
                dropDownList[index].chapters.forEach(element => element.checked = false);
                filteredList = this.arrayRemove(filteredList, dropDownList[index].state.name);
            }
        }
        else {
            dropDownList[index].chapters[innerIndex].checked = !dropDownList[index].chapters[innerIndex].checked;
            if(dropDownList[index].chapters[innerIndex].checked){
                if(dropDownList[index].chapters.length === 1){
                    dropDownList[index].state.checked = true;
                    filteredList.push(dropDownList[index].state.name);
                }
                else {
                    let allChaptersChecked = true; /*  */
                    for(let i=0; i < dropDownList[index].chapters.length; i++){
                        if (!dropDownList[index].chapters[i].checked) {
                            allChaptersChecked = false;
                        }
                    }
                    if (allChaptersChecked) {
                        dropDownList[index].state.checked = true;
                        for(let x=0; x < dropDownList[index].chapters.length; x++){
                            filteredList = this.arrayRemove(filteredList, dropDownList[index].chapters[x].name + ', ' + dropDownList[index].state.name);
                        }
                        filteredList.push(dropDownList[index].state.name);
                    }
                    else {
                        filteredList.push(dropDownList[index].chapters[innerIndex].name + ', ' + dropDownList[index].state.name);
                    }
                }
            }
            else {
                if(dropDownList[index].state.checked){
                    dropDownList[index].state.checked = false;
                    filteredList = this.arrayRemove(filteredList, dropDownList[index].state.name);
                    if (dropDownList[index].chapters.length > 1){
                        for(let x=0; x < dropDownList[index].chapters.length; x++){
                            if(dropDownList[index].chapters[x].checked){
                                filteredList.push(dropDownList[index].chapters[x].name + ', ' + dropDownList[index].state.name);
                            }
                        }
                    }
                }
                else {
                    filteredList = this.arrayRemove(filteredList, dropDownList[index].chapters[innerIndex].name + ', ' + dropDownList[index].state.name);
                }
            }
        }
        this.setState({modifiedList: dropDownList, filteredList: filteredList});
    }

    arrayRemove = (arr, value) => {
        return arr.filter(element => {
            return element !== value;
        });
    }

    chaptersPickerRef = null;

    render() {
      return (
        <DropDownStoreContext.Provider value={this.state}>
          <WrappedComponent {...this.props} ref={el => this.chaptersPickerRef = el}/>
        </DropDownStoreContext.Provider>
      )
    }
  }
}

const withDropDownStore = WrappedComponent => {
  return class extends React.Component {
    render() {
      return (
        <DropDownStoreContext.Consumer>
          {context => <WrappedComponent dropDownStore={context} {...this.props} />}
        </DropDownStoreContext.Consumer>
      )
    }
  }
}

export { withDropDownStore, createDropDownStore }
