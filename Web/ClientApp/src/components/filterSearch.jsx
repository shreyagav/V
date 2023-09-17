const filterSearch = (list, filter, keys) => {
  /* check if element meets criteria */
  let checkIfElementMeetsCriteria = (el, filterList) => {
    let elementKeys = [];
    if (keys !== undefined) {
      elementKeys = keys;
    } else {
      elementKeys = Object.keys(el);
      let idIndex = elementKeys.indexOf("id");
      if (idIndex > -1) {
        elementKeys.splice(idIndex, 1);
      }
    }
    let x = filterList.find((elFilter) => {
      return (
        elementKeys.find((key) => {
          return el[key].toLowerCase().includes(elFilter);
        }) === undefined
      );
      //filter value was not found under any key
    });
    if (x !== undefined) {
      return false;
    } else {
      return true;
    }
  };
  /* remove all " " at the beginning and double ' ' inside the filter expression if they are there */
  filter = filter.replace(/\,+/g, " ");
  filter = filter.toLowerCase().replace(/\s+/g, " ");
  /* create an array of filters*/
  let filterList = [];
  if (filter !== "") {
    filterList = filter.split(" ");
  } else filterList = filter;
  /* filter */
  let filteredList = [];
  list.forEach((element) => {
    if (checkIfElementMeetsCriteria(element, filterList)) {
      filteredList.push(element);
    }
  });
  return filteredList;
};

export { filterSearch };
