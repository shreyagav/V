import React from 'react';

const MultiDropDownStoreContext = React.createContext()

const createMultiDropDownStore = WrappedComponent => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                list: [],
                modifiedList: [],
                value: [],
                placeholder: '',
                expandBy: false,
                textProperty:'',
                keyProperty:'',
                expandedTextProperty: '',
                expandedKeyProperty: '',
                expandedMultiSelect: 'false',
                isOpen: false,
                dropDownHeaderRef: null,
                openStateIndex: [],
                setFocusToIndex: 0,
                setFocusToInnerIndex: 0,

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
                    let index = element.parentElementIndex;
                    let innerIndex = -1;
                    if(element.childElementIndex){
                        innerIndex = element.childElementIndex;
                    }
                    this.checkBoxChange(index, innerIndex);
                    e.stopPropagation();
                },
                toggle: () => {
                    let isOpenWas = this.state.isOpen;
                    if (isOpenWas) {
                        this.setState(() => ({isOpen: !this.state.isOpen, openStateIndex: []}));
                        this.state.dropDownHeaderRef.focus();
                    }
                    else {this.setState(() => ({isOpen: !this.state.isOpen}));}
                },
                toggler: (index) => {this.toggler(index);}
            }
        }

    componentWillMount() {
        this.fillStore(this.props);
    }

    componentWillReceiveProps(props) {
        this.fillStore(props);
    }

    toggler(index) {
        if(this.state.expandBy){
            let openStateIndex = this.state.openStateIndex;
            if (openStateIndex['_'+index.toString()] === true){
                delete openStateIndex['_'+index.toString()];
                this.setState(()=>({openStateIndex: openStateIndex, setFocusToInnerIndex: -1}));
            }
            else { 
                openStateIndex['_'+index.toString()]=true;
                this.setState(()=>({openStateIndex: openStateIndex, setFocusToInnerIndex: 0}));
                this.lastOpenState = index;
            }
        }
        this.setState({setFocusToIndex: index, setFocusToInnerIndex: -1});
    }

    ifCheckParent(element, expandBy){
        let checkParent = true;
        let subArray = element[expandBy];
        for (let i=0; i < subArray.length; i++){
            if (!subArray[i].checked){
                checkParent = false;
            }
        }
        return checkParent;
    }

    fillStore(props) {
        if (props.list !== undefined) {
            let isOpen = false;
            if(props.toggleable === false){isOpen = true}
            let value = [];
            let openStateIndex = this.state.openStateIndex;
            if (props.defaultValue !== undefined){
                value = props.defaultValue;
                if ((value == null || value.length === 0) && Object.keys(this.state.openStateIndex).length > 0){
                    openStateIndex = [];
                }
            }
            let placeholder = '';
            if(props.placeholder){placeholder = props.placeholder;}
            let multiSelect = false;
            if (props.multiSelect){multiSelect = props.multiSelect};
            let keyProperty = props.keyProperty;
            let textProperty = props.textProperty;
            let expandBy = false;
            if(props.expandBy){expandBy = props.expandBy};
            let expandedMultiSelect = false;
            if(props.expandedMultiSelect) {expandedMultiSelect = props.expandedMultiSelect};
            let expandedTextProperty = false;
            if(props.expandedTextProperty){expandedTextProperty = props.expandedTextProperty}
            let expandedKeyProperty = false;
            if(props.expandedKeyProperty) {expandedKeyProperty = props.expandedKeyProperty};
            //modified list creation
            let list = [];
            props.list.forEach(element => {
                let clone = Object.assign({},element);//JSON.parse(JSON.stringify(element))
                if (expandedMultiSelect) {
                    clone.checked = -1;
                    clone[expandBy].map(subElement => {
                        subElement.checked = false;
                    });
                }
                else {
                    if(multiSelect){clone.checked = false;}
                }
                list.push(clone);
            });
            this.setState({ 
                isOpen: isOpen,
                modifiedList: list,
                value: value,
                openStateIndex: openStateIndex,
                placeholder: placeholder,
                multiSelect: multiSelect,
                keyProperty: keyProperty,
                textProperty: textProperty,
                expandBy: expandBy,
                expandedMultiSelect: expandedMultiSelect,
                expandedTextProperty: expandedTextProperty,
                expandedKeyProperty: expandedKeyProperty,
            },this.setDefaultValue);
        }
    }

    setDefaultValue() {
        let modifiedList = this.state.modifiedList;
        let defaultValue = this.state.value;
        let expandBy = this.state.expandBy;
        let keyProperty = this.state.keyProperty;
        let textProperty = this.state.textProperty;
        let expandedKeyProperty = this.state.expandedKeyProperty;
        let expandedTextProperty = this.state.expandedTextProperty;
        if (this.state.expandBy) {
            // 2 level list
            for (let i=0; i < modifiedList.length; i++){
                let modifiedListElement = modifiedList[i];
                let subArray = modifiedListElement[expandBy];
                for (let j=0; j < subArray.length; j++){
                    let element = subArray[j];
                    if (defaultValue != null) {
                        for (let x = 0; x < defaultValue.length; x++) {
                            if (element[expandedKeyProperty] === defaultValue[x]) {
                                element.checked = true;
                                modifiedListElement.checked = 0; // some children are checked
                            }
                        }
                    }
                }
                // check if parent should be checked as well
                if(this.ifCheckParent(modifiedListElement, expandBy)){
                    modifiedListElement.checked = 1; //all children are checked
                }
            }
        }
        else {
            if(this.state.multiSelect){
                // 1 level list
                for (let i=0; i < modifiedList.length; i++){
                    let modifiedListElement = modifiedList[i];
                    for (let x=0; x < defaultValue.length; x++){ 
                        if(modifiedListElement[keyProperty] === defaultValue[x]){
                            modifiedListElement.checked = true;
                        }
                    }
                }
            } 
        }
        this.setState({modifiedList: modifiedList});
    }

    checkBoxChange = (index, innerIndex) => {
        let value = this.state.value;
        let dropDownList = this.state.modifiedList;
        let keyProperty = this.state.keyProperty;
        let textProperty = this.state.textProperty;
        let expandBy = this.state.expandBy;
        let expandedTextProperty = this.state.expandedTextProperty;
        let expandedKeyProperty = this.state.expandedKeyProperty;
        let listElement = dropDownList[index];
        let listElementInnerList = listElement[expandBy];
        if (this.state.multiSelect && innerIndex < 0) {
            if (listElement.checked === true || listElement.checked === false) {
                listElement.checked = !listElement.checked;
                // add or remove value
                if (listElement.checked) {value.push(listElement[keyProperty]);}
                else {value = this.arrayRemove(value, listElement[keyProperty]);}

                /* should I remove next step ??? 
                if(expandBy) {
                    listElementInnerList.forEach(element => {element.checked = listElement.checked});
                }*/
            }
            else {
                if (listElement.checked === 1 || listElement.checked === 0) {
                    listElement.checked = -1;
                    /*if(expandBy) {*/
                    listElementInnerList.forEach(element => {
                        element.checked = false;
                        value = this.arrayRemove(value, element[expandedKeyProperty]); // remove all inner elements from value list
                    });/*}*/
                }
                else //listElement.checked === -1 
                {
                    listElement.checked = 1;
                    if(expandBy) {listElementInnerList.forEach(element => {
                        element.checked = true;
                        value.push(element[expandedKeyProperty]); // add all inner elements to value list
                    });}
                };
            }
        }
        if (this.state.expandedMultiSelect && innerIndex > -1) {
            listElementInnerList[innerIndex].checked = !listElementInnerList[innerIndex].checked;
            if(listElementInnerList[innerIndex].checked){
                value.push(listElementInnerList[innerIndex][expandedKeyProperty]); // add value
                let allChaptersChecked = true; /*  */
                for(let i=0; i < listElementInnerList.length; i++){
                    if (!listElementInnerList[i].checked) {
                        allChaptersChecked = false;
                    }
                }
                if (allChaptersChecked) {
                    listElement.checked = 1;
                }
                else {listElement.checked = 0;}
            }
            else {
                value = this.arrayRemove(value, listElementInnerList[innerIndex][expandedKeyProperty]); // remove value from list
                if(listElement.checked > -1 ){
                    //check if there are any chepters checked
                    let noChaptersChecked = true;
                    for(let i=0; i < listElementInnerList.length; i++){
                        if (listElementInnerList[i].checked) {
                            noChaptersChecked = false;
                        }
                    }
                    if (noChaptersChecked) {
                        listElement.checked = -1;
                    }
                    else {listElement.checked = 0;}
                }
            }
        }
        this.setState({modifiedList: dropDownList, value: value});
        this.props.onDropDownValueChange(value);
    }

    arrayRemove = (arr, value) => {
        return arr.filter(element => {
            return element !== value;
        });
    }

    chaptersPickerRef = null;

    render() {
      return (
        <MultiDropDownStoreContext.Provider value={this.state}>
          <WrappedComponent {...this.props} ref={el => this.chaptersPickerRef = el}/>
        </MultiDropDownStoreContext.Provider>
      )
    }
  }
}

const withMultiDropDownStore = WrappedComponent => {
  return class extends React.Component {
    render() {
      return (
        <MultiDropDownStoreContext.Consumer>
          {context => <WrappedComponent multiDropDownStore={context} {...this.props} />}
        </MultiDropDownStoreContext.Consumer>
      )
    }
  }
}

export { withMultiDropDownStore, createMultiDropDownStore }
