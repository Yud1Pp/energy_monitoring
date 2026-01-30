import "dotenv/config";
import { InfluxDB, Point } from "@influxdata/influxdb-client";

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({ url, token });

const queryApi = influxDB.getQueryApi(org);
const writeApi = influxDB.getWriteApi(org, bucket, "ms");

writeApi.useDefaultTags({ app: "energy-monitoring" });

process.on("SIGINT", async () => {
  try {
    console.log("[INFLUX] Closing write API...");
    await writeApi.close();
    console.log("[INFLUX] Write API closed");
  } catch (err) {
    console.error("[INFLUX] Close failed:", err.message);
  } finally {
    process.exit(0);
  }
});

export { Point, writeApi, queryApi };
