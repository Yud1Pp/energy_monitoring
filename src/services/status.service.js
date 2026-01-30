import { queryApi } from "../config/influx.config.js";
import "dotenv/config";

const BUCKET = process.env.INFLUX_BUCKET;
const OFFLINE_THRESHOLD_MS = 5 * 60 * 1000;

const getStatusAllPanels = async () => {
  const fluxQuery = `
    from(bucket: "${BUCKET}")
      |> range(start: -10m)
      |> filter(fn: (r) => r._measurement == "panel_energy")
      |> last()
  `;

  const lastTime = {};

  return new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const r = tableMeta.toObject(row);
        lastTime[r.panel_id] = r._time;
      },
      error(err) {
        reject(err);
      },
      complete() {
        const now = Date.now();
        const result = Object.entries(lastTime).map(([panel_id, time]) => ({
          panel_id,
          status: now - new Date(time).getTime() <= OFFLINE_THRESHOLD_MS ? "ONLINE" : "OFFLINE",
        }));
        resolve(result);
      },
    });
  });
};

const getStatusByPanel = async (panelId) => {
  const fluxQuery = `
    from(bucket: "${BUCKET}")
      |> range(start: -10m)
      |> filter(fn: (r) => r._measurement == "panel_energy")
      |> filter(fn: (r) => r.panel_id == "${panelId}")
      |> last()
  `;

  let lastTimestamp = null;

  return new Promise((resolve, reject) => {
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const r = tableMeta.toObject(row);
        lastTimestamp = r._time;
      },
      error(err) {
        reject(err);
      },
      complete() {
        if (!lastTimestamp) {
          return resolve({
            panel_id: panelId,
            status: "OFFLINE",
          });
        }

        const now = Date.now();
        const status = now - new Date(lastTimestamp).getTime() <= OFFLINE_THRESHOLD_MS ? "ONLINE" : "OFFLINE";

        resolve({
          panel_id: panelId,
          status,
        });
      },
    });
  });
};

export default {
  getStatusAllPanels,
  getStatusByPanel,
};
