import energyService from "../services/energy.service.js";
import costService from "../services/cost.service.js";

const getTodaySummary = async (req, res) => {
  try {
    const usages = await energyService.getTodayUsageAllPanels();

    const totalUsage = usages.reduce((sum, p) => sum + (p.today_usage_kwh || 0), 0);

    res.json({
      success: true,
      data: {
        total_today_usage_kwh: Number(totalUsage.toFixed(3)),
        total_cost_rp: costService.calculateCost(totalUsage),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'query param "year" is required',
      });
    }

    const monthlyUsages = await energyService.getMonthlyUsage(year);

    const result = monthlyUsages.map((m) => ({
      month: m.month,
      energy_kwh: Number(m.energy_kwh.toFixed(3)),
      cost_rp: costService.calculateCost(m.energy_kwh),
    }));

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getTodaySummary,
  getMonthlySummary,
};
