import { queryApi } from "../config/influx.config.js";
import "dotenv/config";

const BUCKET = process.env.INFLUX_BUCKET;

const runQuery = (fluxQuery, onRow) =>
  new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        onRow(tableMeta.toObject(row));
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve();
      },
    });
  });

const getRealtimeAllPanels = async () => {
  const fluxQuery = `
    from(bucket: "${BUCKET}")
      |> range(start: -10m)
      |> filter(fn: (r) => r._measurement == "panel_energy")
      |> last()
  `;

  const panels = {};

  await runQuery(fluxQuery, (r) => {
    const id = r.panel_id;

    if (!panels[id]) {
      panels[id] = {
        panel_id: id,
        voltage: null,
        current: null,
        power_kw: null,
        energy_kwh: null,
        pf: null,
        v_unbal: null,
        i_unbal: null,
        timestamp: r._time,
      };
    }

    if (new Date(r._time) > new Date(panels[id].timestamp)) {
      panels[id].timestamp = r._time;
    }

    switch (r._field) {
      case "v3":
        panels[id].voltage = r._value;
        break;
      case "i3":
        panels[id].current = r._value;
        break;
      case "kw":
        panels[id].power_kw = r._value;
        break;
      case "klh":
        panels[id].energy_kwh = r._value;
        break;
      case "pf":
        panels[id].pf = r._value;
        break;
      case "vunbal":
        panels[id].v_unbal = r._value;
        break;
      case "iunbal":
        panels[id].i_unbal = r._value;
        break;
    }
  });

  return Object.values(panels);
};

const getRealtimeByPanel = async (panelId) => {
  const fluxQuery = `
    from(bucket: "${BUCKET}")
      |> range(start: -10m)
      |> filter(fn: (r) => r._measurement == "panel_energy")
      |> filter(fn: (r) => r.panel_id == "${panelId}")
      |> last()
  `;

  const panel = {
    panel_id: panelId,
    voltage: null,
    current: null,
    power_kw: null,
    energy_kwh: null,
    pf: null,
    v_unbal: null,
    i_unbal: null,
    timestamp: null,
  };

  await runQuery(fluxQuery, (r) => {
    if (!panel.timestamp || new Date(r._time) > new Date(panel.timestamp)) {
      panel.timestamp = r._time;
    }

    switch (r._field) {
      case "v3":
        panel.voltage = r._value;
        break;
      case "i3":
        panel.current = r._value;
        break;
      case "kw":
        panel.power_kw = r._value;
        break;
      case "klh":
        panel.energy_kwh = r._value;
        break;
      case "pf":
        panel.pf = r._value;
        break;
      case "vunbal":
        panel.v_unbal = r._value;
        break;
      case "iunbal":
        panel.i_unbal = r._value;
        break;
    }
  });

  return panel;
};

const getTodayUsageByPanel = async (panelId) => {
  let startValue = null;
  let endValue = null;

  const startQuery = `
    from(bucket: "${BUCKET}")
      |> range(start: today())
      |> filter(fn: (r) => r._measurement == "panel_energy")
      |> filter(fn: (r) => r.panel_id == "${panelId}")
      |> filter(fn: (r) => r._field == "klh")
      |> first()
  `;

  const endQuery = `
    from(bucket: "${BUCKET}")
      |> range(start: today())
      |> filter(fn: (r) => r._measurement == "panel_energy")
      |> filter(fn: (r) => r.panel_id == "${panelId}")
      |> filter(fn: (r) => r._field == "klh")
      |> last()
  `;

  await runQuery(startQuery, (r) => (startValue = r._value));
  await runQuery(endQuery, (r) => (endValue = r._value));

  const usage = startValue !== null && endValue !== null ? Math.max(endValue - startValue, 0) : 0;

  return {
    panel_id: panelId,
    today_usage_kwh: Number(usage.toFixed(3)),
  };
};

const getTodayUsageAllPanels = async () => {
  const fluxQuery = `
    from(bucket: "${BUCKET}")
      |> range(start: today())
      |> filter(fn: (r) => r._measurement == "panel_energy")
      |> filter(fn: (r) => r._field == "klh")
      |> group(columns: ["panel_id"])
      |> reduce(
        identity: { min: 0.0, max: 0.0 },
        fn: (r, accumulator) => ({
          min: if accumulator.min == 0.0 then r._value else accumulator.min,
          max: r._value
        })
      )
  `;

  const result = [];

  await runQuery(fluxQuery, (r) => {
    result.push({
      panel_id: r.panel_id,
      today_usage_kwh: Number(Math.max(r.max - r.min, 0).toFixed(3)),
    });
  });

  return result;
};

const getMonthlyUsage = async (year) => {
  const start = `${year}-01-01T00:00:00Z`;
  const stop = `${year}-12-31T23:59:59Z`;

  const fluxQuery = `
    minData =
      from(bucket: "${BUCKET}")
        |> range(start: time(v: "${start}"), stop: time(v: "${stop}"))
        |> filter(fn: (r) => r._measurement == "panel_energy")
        |> filter(fn: (r) => r._field == "klh")
        |> timeShift(duration: 7h)
        |> aggregateWindow(every: 1mo, fn: min)
        |> yield(name: "min")

    maxData =
      from(bucket: "${BUCKET}")
        |> range(start: time(v: "${start}"), stop: time(v: "${stop}"))
        |> filter(fn: (r) => r._measurement == "panel_energy")
        |> filter(fn: (r) => r._field == "klh")
        |> timeShift(duration: 7h)
        |> aggregateWindow(every: 1mo, fn: max)
        |> yield(name: "max")

    union(tables: [minData, maxData])
    `;

  const monthly = {};

  await runQuery(fluxQuery, (r) => {
    const d = new Date(r._time);
    let month = d.getMonth();

    if (month === 0) {
      month = 12;
    }
    if (!monthly[month]) monthly[month] = { min: null, max: null };

    monthly[month].min = monthly[month].min === null ? r._value : Math.min(monthly[month].min, r._value);

    monthly[month].max = monthly[month].max === null ? r._value : Math.max(monthly[month].max, r._value);
  });

  return Object.entries(monthly).map(([m, v]) => ({
    month: Number(m),
    energy_kwh: Number((v.max - v.min).toFixed(3)),
  }));
};

export default {
  getRealtimeAllPanels,
  getRealtimeByPanel,
  getTodayUsageByPanel,
  getTodayUsageAllPanels,
  getMonthlyUsage,
};
