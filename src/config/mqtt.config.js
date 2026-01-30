import mqtt from "mqtt";
import "dotenv/config";

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID;

const options = {
  clientId: MQTT_CLIENT_ID,
  clean: true,
  reconnectPeriod: 1000, // auto reconnect 1s
};

if (MQTT_USERNAME && MQTT_PASSWORD) {
  options.username = MQTT_USERNAME;
  options.password = MQTT_PASSWORD;
}

const mqttClient = mqtt.connect(MQTT_BROKER_URL, options);

mqttClient.on("connect", () => {
  console.log("[MQTT] Connected to broker:", MQTT_BROKER_URL);
});

mqttClient.on("reconnect", () => {
  console.log("[MQTT] Reconnecting...");
});

mqttClient.on("error", (err) => {
  console.error("[MQTT] Error:", err.message);
});

export default mqttClient;
