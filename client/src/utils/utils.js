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
  value === 0 ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const isEmptyString = value => {
  if (isEmpty(value)) {
    return '';
  } else {
    return value;
  }
};

export const openNav = () => {
  document.getElementById('mySidenav').style.width = '250px';
  document.getElementById('main').style.marginRight = '250px';
};

export const addSelectedNameToEndOfArray = (array, selectedName) => {
  console.log('FUNC Array: ', array);

  const checkFilter = array.filter(item => {
    return item.urlName !== selectedName;
  });

  console.log('CHECK FILTER: ', checkFilter);

  const filteredArray = array.filter(item => {
    console.log('selectedName: ', selectedName);
    console.log('ITEM: ', item);
    if (selectedName !== item.urlName) {
      return item;
    }
  });
  const selectedNameData = array.filter(item => {
    return item.urlName === selectedName;
  });

  // console.log('filteredArray: ', filteredArray);

  return filteredArray.concat(selectedNameData[0]);
};

export const displayErrors = (err, dispatch, type) => {
  if (err.response.data.errors) {
    var errObj = err.response.data.errors.reduce((obj, item) => {
      return (obj[item.param] = item.msg), obj;
    }, {});

    dispatch({
      type: type,
      payload: errObj
    });
  } else {
    console.log('ERR: ', err);
  }
};

export const calcCostToSeconds = (cost, unit) => {
  let costPerSecond = null;
  switch (unit) {
    case 'sec':
      costPerSecond = cost;
      break;
    case 'min':
      costPerSecond = cost / 60;
      break;
    case 'hour':
      costPerSecond = cost / 60 / 60;
      break;
    case 'day':
      costPerSecond = cost / 24 / 60 / 60;
      break;
    case 'week':
      costPerSecond = 7 / 24 / 60 / 60;
      break;
    case 'month':
      // console.log('Made it');
      // 31556925.9747 -> Hewlett-Packard seconds per year
      costPerSecond = (cost / 31556925.9747) * 12;
      break;
    case 'year':
      costPerSecond = cost / 31556925.9747;
      break;
    default:
      costPerSecond = null;
  }
  return costPerSecond;
};

export const calcCostPerSecondToCostPerUnit = (
  costPerSecond,
  unit
) => {
  let costPerUnit = null;
  switch (unit) {
    case 'sec':
      costPerUnit = costPerSecond;
      break;
    case 'min':
      costPerUnit = costPerSecond * 60;
      break;
    case 'hour':
      costPerUnit = costPerSecond * 60 * 60;
      break;
    case 'day':
      costPerUnit = costPerSecond * 24 * 60 * 60;
      break;
    case 'week':
      costPerUnit = costPerSecond * 7 * 24 * 60 * 60;
      break;
    case 'month':
      // console.log('Made it');
      // 31556925.9747 -> Hewlett-Packard seconds per year
      costPerUnit = (costPerSecond * 31556925.9747) / 12;
      // costPerUnit = 1;
      break;
    case 'year':
      costPerUnit = costPerSecond * 31556925.9747;
      break;
    default:
      costPerUnit = null;
  }
  return roundNumber(costPerUnit, 3);
};

export const roundNumber = (value, decimals) => {
  if (value === 0 || value === '0' || value === '') {
    return '';
  }

  return Number(
    Math.round(+value + 'e' + decimals) + 'e-' + decimals
  );
};

export const setVenueData = venue => {
  const venueData = {};
  venueData.costs = {};

  venueData._id = venue._id;
  venueData.displayName = isEmptyString(venue.displayName);
  venueData.type = isEmptyString(venue.type);
  venueData.prepTime =
    !isEmpty(venue.prepTime) || venue.prepTime === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.prepTime,
          venue.prepTimeUnit
        ).toString()
      : '';
  venueData.prepTimeUnit = isEmptyString(venue.prepTimeUnit);
  venueData.totalItemsOnMenu = isEmptyString(venue.totalItemsOnMenu);

  venueData.email = isEmptyString(venue.email);
  venueData.phone = isEmptyString(venue.phone);
  venueData.address = isEmptyString(venue.address);
  venueData.website = isEmptyString(venue.website);

  venueData.costs.chefCost =
    !isEmpty(venue.costs.chefCost) || venue.costs.chefCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.chefCost,
          venue.costs.chefUnitCost
        ).toString()
      : '';
  venueData.costs.chefUnitCost = isEmptyString(
    venue.costs.chefUnitCost
  );
  venueData.costs.rentCost =
    !isEmpty(venue.costs.rentCost) || venue.costs.rentCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.rentCost,
          venue.costs.rentUnitCost
        ).toString()
      : '';
  venueData.costs.rentUnitCost = isEmptyString(
    venue.costs.rentUnitCost
  );
  venueData.costs.waterCost =
    !isEmpty(venue.costs.waterCost) || venue.costs.waterCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.waterCost,
          venue.costs.waterUnitCost
        ).toString()
      : '';
  venueData.costs.waterUnitCost = isEmptyString(
    venue.costs.waterUnitCost
  );
  venueData.costs.powerCost =
    !isEmpty(venue.costs.powerCost) || venue.costs.powerCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.powerCost,
          venue.costs.powerUnitCost
        ).toString()
      : '';
  venueData.costs.powerUnitCost = isEmptyString(
    venue.costs.powerUnitCost
  );
  venueData.costs.insuranceCost =
    !isEmpty(venue.costs.insuranceCost) ||
    venue.costs.insuranceCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.insuranceCost,
          venue.costs.insuranceUnitCost
        ).toString()
      : '';
  venueData.costs.insuranceUnitCost = isEmptyString(
    venue.costs.insuranceUnitCost
  );
  venueData.costs.councilCost =
    !isEmpty(venue.costs.councilCost) || venue.costs.councilCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.councilCost,
          venue.costs.councilUnitCost
        ).toString()
      : '';
  venueData.costs.councilUnitCost = isEmptyString(
    venue.costs.councilUnitCost
  );
  venueData.costs.wastageCost = isEmptyString(venue.wastageCost);
  return venueData;
};
