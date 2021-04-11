const getTotalCost = (randomPointsData) => {
  let totalCost = 0;
  randomPointsData.forEach(({basePrice}) => totalCost += basePrice);
  return totalCost;
};


export const CreateTripCostTemplate = (randomPointsData) => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalCost(randomPointsData)}</span>
  </p>`;
};
