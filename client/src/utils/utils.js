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
  return (
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  );
};

export const setVenueData = venue => {
  const venueData = {};
  venueData.costs = {};

  // console.log('venueData', venueData);

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

export const convertSecondsToMinutes = time => {
  return time / 60;
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

export const convertProfilePacketCostIntoCostPer1kg = (
  profilePacketCost,
  profilePacketGrams
) => {
  // console.log('profilePacketCost', profilePacketCost);
  // console.log('profilePacketGrams', profilePacketGrams);
  // console.log(
  //   '.....',
  //   (profilePacketCost / profilePacketGrams) * 1000
  // );

  return (profilePacketCost / profilePacketGrams) * 1000;
};

export const calculateRecipeItemTotal = (quantity, unit, item) => {
  let total = '0.00';

  if (quantity) {
    switch (unit) {
      case 'sec':
        total = quantity;
        break;
      case 'min':
        total = quantity * 60;
        break;
      case 'hour':
        total = quantity * 60 * 60;
        break;
      case 'cup':
        // console.log('--> cup');
        total = quantity * item.cup;
        break;
      case 'gram':
        total = quantity;
        break;
      case 'kilo':
        total = quantity * 1000;
        break;
      case 'tablespoon':
        // console.log('--> tablespoon');
        total = (quantity * item.cup) / 16;
        break;
      case 'teaspoon':
        // console.log('--> teaspoon');
        total = (quantity * item.cup) / 48;
        break;
      case 'whole':
        // console.log('--> whole');
        total = quantity * item.whole;
        break;
      default:
        total = 0.0;
        break;
    }
  }

  return Number(total);
};

export const roundRecipeItemTotal = (quantity, unit, item) => {
  let total = '0.00';

  if (quantity) {
    switch (unit) {
      case 'sec':
        total = roundNumberAsString(quantity);
        break;
      case 'min':
        total = roundNumberAsString(quantity * 60);
        break;
      case 'hour':
        total = roundNumberAsString(quantity * 60 * 60);
        break;
      case 'cup':
        // console.log('--> cup');
        total = quantity * item.cup;
        break;
      case 'gram':
        total = quantity;
        break;
      case 'kilo':
        total = quantity * 1000;
        break;
      case 'tablespoon':
        // console.log('--> tablespoon');
        total = (quantity * item.cup) / 16;
        break;
      case 'teaspoon':
        // console.log('--> teaspoon');
        total = (quantity * item.cup) / 48;
        break;
      default:
        total = '0.00';
        break;
    }
  }
  return Number(total);
};

export const updateRecipeItemsOrder = recipeData => {
  let reOrderItems = [];
  if (
    !isEmpty(recipeData.processTime) ||
    !isEmpty(recipeData.ingredients)
  ) {
    for (let pt = 0; pt < recipeData.processTime.length; pt++) {
      const process = recipeData.processTime[pt];
      reOrderItems.push(process);
    }
    for (let i = 0; i < recipeData.ingredients.length; i++) {
      const ingredient = recipeData.ingredients[i];
      // reOrderItems.push(ingredient);
      reOrderItems.splice(ingredient.order, 0, ingredient);
    }
  }

  // Sort Recipe items in order
  const recipeItemsInOrder = reOrderItems.sort(compareItems);
  let updatedRecipeItemOrderValues = recipeItemsInOrder.map(
    (item, index) => {
      const updatedItem = {
        ...item,
        // Plus 1 so the ordering is consistent when you add an item
        order: index + 1
      };
      return updatedItem;
    }
  );

  let totalGrams = 0;
  recipeData.processTime = updatedRecipeItemOrderValues.filter(
    item => {
      if (item.description) {
        totalGrams = totalGrams + item.total;
        return item;
      }
      return null;
    }
  );

  let totalTime = 0;
  recipeData.ingredients = updatedRecipeItemOrderValues.filter(
    item => {
      if (item.ingredient) {
        totalTime = totalTime + item.total;
        return item;
      }
      return null;
    }
  );

  // console.log('totalGrams', totalGrams);
  // console.log('totalTime', totalTime);

  recipeData.totalGrams = totalGrams;
  recipeData.totalTime = totalTime;

  // Update Recipe totals to add to recipeData
  return recipeData;
};

export const compareItems = (a, b) => {
  const itemA = a.order;
  const itemB = b.order;

  let comparison = 0;
  if (itemA > itemB) {
    comparison = 1;
  } else if (itemA < itemB) {
    comparison = -1;
  }
  return comparison;
};

export const mergeIngredientsWithProfileIngredientCosts = (
  ingredients,
  profile
) => {
  // Check if ingredient is in profile ingredients
  // If true update ingredientData
  let ingredientData = [...ingredients];
  const updatedIngredientData = ingredientData.map(iData => {
    let pIngredient = profile.ingredients.filter(pi => {
      return iData._id === pi.ingredient;
    });

    let uiData;
    if (isEmpty(pIngredient)) {
      uiData = {
        ...iData,
        profilePacketCost: iData.packetCost,
        profilePacketGrams: iData.packetGrams
      };
    } else {
      const pSupplier = pIngredient[0].suppliers.filter(ps => {
        return ps.preferred;
      });

      if (!isEmpty(pSupplier)) {
        uiData = {
          ...iData,
          profilePacketCost: pSupplier[0].packetCost,
          profilePacketGrams: pSupplier[0].packetGrams
        };
      } else {
        uiData = {
          ...iData,
          profilePacketCost: iData.packetCost,
          profilePacketGrams: iData.packetGrams
        };
      }
    }
    return uiData;
  });
  return updatedIngredientData;
};

export const getRecipeResults = (
  selectedRecipe,
  selectedVenue,
  ingredients,
  profile
) => {
  // Create list of only the recipe ingredients
  const ingredientsInRecipe = ingredients.filter(ing => {
    return selectedRecipe.ingredients.some(ri => {
      return ri.ingredient === ing._id;
    });
  });

  // console.log('ingredientsInRecipe', ingredientsInRecipe);

  const updatedIngredientData = mergeIngredientsWithProfileIngredientCosts(
    ingredientsInRecipe,
    profile
  );

  const recipeResults = {};

  recipeResults.ingredientCost = calcTotalIngredientCost(
    updatedIngredientData,
    selectedRecipe
  );

  recipeResults.staffCost = calcStaffCost(
    selectedRecipe,
    selectedVenue
  );

  recipeResults.venueCosts = calcVenueCosts(
    selectedRecipe,
    selectedVenue
  );

  recipeResults.recipeCost = 0;
  if (recipeResults.ingredientCost)
    recipeResults.recipeCost =
      recipeResults.recipeCost + recipeResults.ingredientCost;
  if (recipeResults.staffCost)
    recipeResults.recipeCost =
      recipeResults.recipeCost + recipeResults.staffCost;
  if (recipeResults.venueCosts.venueCost)
    recipeResults.recipeCost =
      recipeResults.recipeCost + recipeResults.venueCosts.venueCost;

  recipeResults.stats = calcRecipeStats(
    selectedRecipe,
    recipeResults.recipeCost,
    recipeResults.ingredientCost,
    selectedVenue.weeksOpen
  );

  return recipeResults;
};

export const calcTotalIngredientCost = (
  ingredients,
  selectedRecipe
) => {
  let total = 0;
  // Check if there are ingredients
  if (!isEmpty(ingredients)) {
    for (let i = 0; i < selectedRecipe.ingredients.length; i++) {
      const srIngredient = selectedRecipe.ingredients[i];

      // find ingredient in ingredients
      const ingredient = ingredients.filter(ing => {
        return ing._id === srIngredient.ingredient;
      });

      if (!isEmpty(ingredient)) {
        // Convert cost per 100g into cost per 1g
        const costPer1g = ingredient[0].packetCost / 100;
        total = total + costPer1g * srIngredient.total;
      }
    }
  } else {
    total = 0;
  }
  return total;
};

export const calcStaffCost = (selectedRecipe, selectedVenue) => {
  if (selectedVenue.costs.chefCost === 0) {
    return 0;
  }

  let totalStaffTime = 0;
  for (let i = 0; i < selectedRecipe.processTime.length; i++) {
    const pTime = selectedRecipe.processTime[i];
    // console.log('pTime', pTime);

    if (pTime.staffTime) {
      totalStaffTime = totalStaffTime + pTime.total;
    }
  }

  if (totalStaffTime === 0) {
    return 0;
  }

  const staffCost = selectedVenue.costs.chefCost * totalStaffTime;
  return staffCost;
};

export const calcVenueCosts = (selectedRecipe, selectedVenue) => {
  const venueCosts = {
    venueCost: 0
  };
  if (selectedVenue.costs.chefPayPerHour === 0) {
    return venueCosts;
  }

  let totalRecipeTime = 0;
  for (let i = 0; i < selectedRecipe.processTime.length; i++) {
    totalRecipeTime =
      totalRecipeTime + selectedRecipe.processTime[i].total;
  }

  if (totalRecipeTime === 0) {
    return venueCosts;
  }

  let totalVenueCost = 0;

  if (selectedVenue.costs.rentCost !== 0) {
    totalVenueCost = totalVenueCost + selectedVenue.costs.rentCost;
    venueCosts.rentCost =
      selectedVenue.costs.rentCost * totalRecipeTime;
  }
  if (selectedVenue.costs.waterCost !== 0) {
    totalVenueCost = totalVenueCost + selectedVenue.costs.waterCost;
    venueCosts.waterCost =
      selectedVenue.costs.waterCost * totalRecipeTime;
  }
  if (selectedVenue.costs.powerCost !== 0) {
    totalVenueCost = totalVenueCost + selectedVenue.costs.powerCost;
    venueCosts.powerCost =
      selectedVenue.costs.powerCost * totalRecipeTime;
  }
  if (selectedVenue.costs.insuranceCost !== 0) {
    totalVenueCost =
      totalVenueCost + selectedVenue.costs.insuranceCost;
    venueCosts.insuranceCost =
      selectedVenue.costs.insuranceCost * totalRecipeTime;
  }
  if (selectedVenue.costs.councilCost !== 0) {
    totalVenueCost = totalVenueCost + selectedVenue.costs.councilCost;
    venueCosts.councilCost =
      selectedVenue.costs.councilCost * totalRecipeTime;
  }
  if (selectedVenue.costs.wastageCost !== 0) {
    totalVenueCost = totalVenueCost + selectedVenue.costs.wastageCost;
    venueCosts.wastageCost =
      selectedVenue.costs.wastageCost * totalRecipeTime;
  }

  venueCosts.venueCost = totalRecipeTime * totalVenueCost;

  // console.log('totalRecipeTime', totalRecipeTime);
  // console.log('totalVenueCost', totalVenueCost);

  return venueCosts;
};

export const calcRecipeStats = (
  selectedRecipe,
  recipeCost,
  ingredientCost,
  weeksOpen
) => {
  const recipeStats = {};
  if (selectedRecipe.serves === 0) {
    return recipeStats;
  }
  if (
    !selectedRecipe.salePricePerServe ||
    selectedRecipe.salePricePerServe === 0
  ) {
    return recipeStats;
  }

  // console.log('selectedRecipe', selectedRecipe);
  // console.log('recipeCost', recipeCost);
  // console.log('ingredientCost', ingredientCost);

  // Calculate Recipe Revenue
  recipeStats.recipeRevenue =
    selectedRecipe.serves * selectedRecipe.salePricePerServe;

  // Gross Profit = Revenue - COGS
  recipeStats.grossProfit =
    recipeStats.recipeRevenue - ingredientCost;
  // Net Profit = Revenue - total recipe cost
  recipeStats.netProfit = recipeStats.recipeRevenue - recipeCost;
  // Gross Profit per serve = Revenue - COGS / serves
  recipeStats.grossProfitPerServe =
    (recipeStats.recipeRevenue - ingredientCost) /
    selectedRecipe.serves;
  // Net Profit per serve = Revenue - total recipe cost / serve
  recipeStats.netProfitPerServe =
    (recipeStats.recipeRevenue - recipeCost) / selectedRecipe.serves;

  // Gross Profit Margin = Revenue - ingredient Costs / revenue
  recipeStats.grossProfitMargin =
    ((recipeStats.recipeRevenue - ingredientCost) /
      recipeStats.recipeRevenue) *
    100;
  // Net Profit Margin = Revenue - recipe Costs / revenue
  recipeStats.netProfitMargin =
    ((recipeStats.recipeRevenue - recipeCost) /
      recipeStats.recipeRevenue) *
    100;

  // Markup = Gross profit / Cogs
  recipeStats.markup =
    ingredientCost !== 0
      ? (recipeStats.grossProfit / ingredientCost) * 100
      : 0;

  // console.log('recipeStats.grossProfit', recipeStats.grossProfit);
  // console.log('ingredientCost', ingredientCost);

  recipeStats.grossProfitPerWeek =
    selectedRecipe.expectedSales * recipeStats.grossProfitPerServe;

  recipeStats.grossProfitPerMonth =
    (recipeStats.grossProfitPerWeek * weeksOpen) / 12;

  recipeStats.grossProfitPerYear =
    recipeStats.grossProfitPerWeek * weeksOpen;

  recipeStats.netProfitPerWeek =
    selectedRecipe.expectedSales * recipeStats.netProfitPerServe;

  recipeStats.netProfitPerMonth =
    (recipeStats.netProfitPerWeek * weeksOpen) / 12;

  recipeStats.netProfitPerYear =
    recipeStats.netProfitPerWeek * weeksOpen;

  recipeStats.recommendedSalesPrice =
    (recipeCost / selectedRecipe.serves) * 2;

  return recipeStats;
};
