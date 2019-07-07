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
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'string' && value === 'null');

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
  const filteredArray = array.filter(item => {
    return selectedName !== item.urlName;
  });
  const selectedNameData = array.filter(item => {
    return item.urlName === selectedName;
  });
  return filteredArray.concat(selectedNameData[0]);
};

export const displayErrors = err => {
  console.log('ERR: ', err.response.data.errors);
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
      costPerSecond = cost / 7 / 24 / 60 / 60;
      break;
    case 'month':
      // 31556925.9747 -> Hewlett-Packard seconds per year
      costPerSecond = (cost / 31556925.9747) * 12;
      break;
    case 'quarter':
      costPerSecond = (cost / 31556925.9747) * 4;
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
      // 31556925.9747 -> Hewlett-Packard seconds per year
      costPerUnit = (costPerSecond * 31556925.9747) / 12;
      break;
    case 'quarter':
      costPerUnit = (costPerSecond * 31556925.9747) / 4;
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
  if (!decimals) decimals = 2;
  if (value === 0 || value === '0' || value === '') {
    return '';
  }

  return Number(
    Math.round(+value + 'e' + decimals) + 'e-' + decimals
  );
};

export const roundNumberAsString = (value, decimals) => {
  if (!decimals) decimals = 2;
  if (value === 0 || value === '0' || value === '') {
    return '';
  }

  // console.log('v', value);

  const n = Number(
    Math.round(+value + 'e' + decimals) + 'e-' + decimals
  ).toString();

  // console.log('n', n);
  return n;
};

export const capitalizeFirstLetter = string => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const setVenueData = venue => {
  const venueData = {};
  venueData.costs = {};

  console.log('venueData', venueData);

  venueData._id = venue._id ? venue._id : '';
  venueData.displayName =
    venue.displayName !== 'Add New Venue'
      ? isEmptyString(venue.displayName)
      : '';
  venueData.type = isEmptyString(venue.type);
  venueData.weeksOpen = isEmptyString(venue.weeksOpen).toString();
  venueData.weeksOpenUnit = isEmptyString(venue.weeksOpenUnit);
  venueData.prepTime =
    !isEmpty(venue.prepTime) || venue.prepTime === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.prepTime,
          venue.prepTimeUnit
        ).toString()
      : '';
  venueData.prepTimeUnit = isEmptyString(venue.prepTimeUnit);
  venueData.totalMenuItems = isEmptyString(
    venue.totalMenuItems
  ).toString();

  venueData.email = isEmptyString(venue.email);
  venueData.phone = isEmptyString(venue.phone);
  venueData.address = isEmptyString(venue.address);
  venueData.website = isEmptyString(venue.website);

  venueData.costs.chefCost =
    !isEmpty(venue.costs.chefCost) || venue.costs.chefCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.chefCost,
          venue.costs.chefCostUnit
        ).toString()
      : '';
  venueData.costs.chefCostUnit = isEmptyString(
    venue.costs.chefCostUnit
  );
  venueData.costs.rentCost =
    !isEmpty(venue.costs.rentCost) || venue.costs.rentCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.rentCost,
          venue.costs.rentCostUnit
        ).toString()
      : '';
  venueData.costs.rentCostUnit = isEmptyString(
    venue.costs.rentCostUnit
  );
  venueData.costs.waterCost =
    !isEmpty(venue.costs.waterCost) || venue.costs.waterCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.waterCost,
          venue.costs.waterCostUnit
        ).toString()
      : '';
  venueData.costs.waterCostUnit = isEmptyString(
    venue.costs.waterCostUnit
  );
  venueData.costs.powerCost =
    !isEmpty(venue.costs.powerCost) || venue.costs.powerCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.powerCost,
          venue.costs.powerCostUnit
        ).toString()
      : '';
  venueData.costs.powerCostUnit = isEmptyString(
    venue.costs.powerCostUnit
  );
  venueData.costs.insuranceCost =
    !isEmpty(venue.costs.insuranceCost) ||
    venue.costs.insuranceCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.insuranceCost,
          venue.costs.insuranceCostUnit
        ).toString()
      : '';
  venueData.costs.insuranceCostUnit = isEmptyString(
    venue.costs.insuranceCostUnit
  );
  venueData.costs.councilCost =
    !isEmpty(venue.costs.councilCost) || venue.costs.councilCost === 0
      ? calcCostPerSecondToCostPerUnit(
          venue.costs.councilCost,
          venue.costs.councilCostUnit
        ).toString()
      : '';
  venueData.costs.councilCostUnit = isEmptyString(
    venue.costs.councilCostUnit
  );
  venueData.costs.wastageCost = isEmptyString(venue.wastageCost);
  return venueData;
};

export const getNewVenueData = () => {
  const venueData = {
    displayName: 'Add New Venue',
    type: '',
    prepTime: '',
    prepTimeUnit: 'week',
    totalMenuItems: '',

    weeksOpen: '',
    weeksOpenUnit: 'year',
    email: '',
    phone: '',
    address: '',
    website: '',

    costs: {
      chefCost: '',
      chefCostUnit: 'hour',
      rentCost: '',
      rentCostUnit: 'month',
      waterCost: '',
      waterCostUnit: 'month',
      powerCost: '',
      powerCostUnit: 'month',
      insuranceCost: '',
      insuranceCostUnit: 'year',
      councilCost: '',
      councilCostUnit: 'year'
    }
  };
  return venueData;
};

export const convert100gInto1Kg = value => value * 10;

export const compareSupplierPacketCostToProfilePacketCost = (
  supplierPrice100g,
  profilePacketCost,
  profilePacketGrams
) => {
  const profilePacketCost100g = convertProfilePacketCostIntoCostPer100g(
    profilePacketCost,
    profilePacketGrams
  );

  if (profilePacketCost100g <= supplierPrice100g) {
    return 'betterPrice';
  }
};

export const convertProfilePacketCostIntoCostPer100g = (
  profilePacketCost,
  profilePacketGrams
) => {
  return (profilePacketCost / profilePacketGrams) * 100;
};
