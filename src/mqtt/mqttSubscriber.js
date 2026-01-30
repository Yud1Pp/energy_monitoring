import mqttClient from "../config/mqtt.config.js";
import { writeApi, Point } from "../config/influx.config.js";
import topicMapper from "./topicMapper.js";

const initMqttSubscriber = () => {
  const topics = topicMapper.getAllTopics();

  mqttClient.subscribe(topics, (err) => {
    if (err) {
      console.error("[MQTT] Subscribe error:", err.message);
    } else {
      console.log("[MQTT] Subscribed to topics:", topics);
    }
  });
};

const handleMqttMessage = (topic, payload) => {
  const panelId = topicMapper.getPanelId(topic);
  if (!panelId) return;

  saveEnergyData(panelId, payload);
};

const saveEnergyData = (panelId, payload) => {
  if (!payload?.data) return;

  const d = payload.data;

  const point = new Point("panel_energy")
    .tag("panel_id", panelId)
    .floatField("v0", Number(d.v?.[0] ?? 0))
    .floatField("v1", Number(d.v?.[1] ?? 0))
    .floatField("v2", Number(d.v?.[2] ?? 0))
    .floatField("v3", Number(d.v?.[3] ?? 0))
    .floatField("i0", Number(d.i?.[0] ?? 0))
    .floatField("i1", Number(d.i?.[1] ?? 0))
    .floatField("i2", Number(d.i?.[2] ?? 0))
    .floatField("i3", Number(d.i?.[3] ?? 0))
    .floatField("kw", Number(d.kw))
    .floatField("kVA", Number(d.kVA))
    .floatField("klh", Number(d.klh))
    .floatField("pf", Number(d.pf))
    .floatField("vunbal", Number(d.vunbal))
    .floatField("iunbal", Number(d.iunbal));

  if (d.time) {
    point.timestamp(new Date(d.time));
  }

  writeApi.writePoint(point);
  console.log("[INFLUX] Point buffered:", panelId);
};

setInterval(async () => {
  try {
    await writeApi.flush();
    console.log("[INFLUX] Flush success");
  } catch (err) {
    console.error("[INFLUX] Flush failed:", err.message);
  }
}, 10000);

export default {
  initMqttSubscriber,
  handleMqttMessage,
};
