import energyService from "../services/energy.service.js";
import statusService from "../services/status.service.js";
import costService from "../services/cost.service.js";
import EnergyModel from "../models/energy.model.js";

const getRealtimeAllPanels = async (req, res) => {
  try {
    const energies = await energyService.getRealtimeAllPanels();
    const statuses = await statusService.getStatusAllPanels();

    const result = energies.map((e) => {
      const status = statuses.find((s) => s.panel_id === e.panel_id);

      return EnergyModel.RealtimeEnergyModel({
        ...e,
        status: status ? status.status : "OFFLINE",
        cost_rp: costService.calculateCost(e.energy_kwh),
      });
    });

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

const getRealtimeByPanel = async (req, res) => {
  try {
    const { panelId } = req.params;

    const energy = await energyService.getRealtimeByPanel(panelId);
    const status = await statusService.getStatusByPanel(panelId);

    if (!energy) {
      return res.status(404).json({
        success: false,
        message: "Panel data not found",
      });
    }

    res.json({
      success: true,
      data: EnergyModel.RealtimeEnergyModel({
        ...energy,
        status: status.status,
        cost_rp: costService.calculateCost(energy.energy_kwh),
      }),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTodayUsageByPanel = async (req, res) => {
  try {
    const { panelId } = req.params;

    const usage = await energyService.getTodayUsageByPanel(panelId);

    res.json({
      success: true,
      data: EnergyModel.TodayUsageModel({
        ...usage,
        cost_rp: costService.calculateCost(usage.today_usage_kwh),
      }),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getRealtimeAllPanels,
  getRealtimeByPanel,
  getTodayUsageByPanel,
};
