const COST_PER_KWH = 1699;

const calculateCost = (energyKwh) => {
  if (!energyKwh || energyKwh <= 0) return 0;
  return Math.round(energyKwh * COST_PER_KWH);
};

export default {
  calculateCost,
};
