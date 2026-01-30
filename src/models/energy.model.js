const RealtimeEnergyModel = (data = {}) => ({
  panel_id: data.panel_id ?? null,

  voltage: data.voltage ?? null,
  current: data.current ?? null,
  power_kw: data.power_kw ?? null,
  energy_kwh: data.energy_kwh ?? null,

  pf: data.pf ?? null,
  v_unbal: data.v_unbal ?? null,
  i_unbal: data.i_unbal ?? null,

  status: data.status ?? "OFFLINE",
  cost_rp: data.cost_rp ?? 0,

  timestamp: data.timestamp ?? null,
});

const TodayUsageModel = (data = {}) => ({
  panel_id: data.panel_id ?? null,
  today_usage_kwh: data.today_usage_kwh ?? 0,
  cost_rp: data.cost_rp ?? 0,
});

const MonthlyUsageModel = (data = {}) => ({
  month: data.month,
  energy_kwh: data.energy_kwh ?? 0,
  cost_rp: data.cost_rp ?? 0,
});

export default {
  RealtimeEnergyModel,
  TodayUsageModel,
  MonthlyUsageModel,
};
