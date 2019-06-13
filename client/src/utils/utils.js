export const randomID = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const openNav = () => {
  document.getElementById('mySidenav').style.width = '250px';
  document.getElementById('main').style.marginRight = '250px';
};

export const addSelectedNameToEndOfArray = (array, selectedName) => {
  const filteredArray = array.filter(item => {
    return item.urlName !== selectedName;
  });
  const selectedNameData = array.filter(item => {
    return item.urlName === selectedName;
  });
  return filteredArray.concat(selectedNameData[0]);
};
