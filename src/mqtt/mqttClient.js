import mqttClient from "../config/mqtt.config.js";
import mqttSubscriber from "./mqttSubscriber.js";

const initMqttClient = () => {
  mqttSubscriber.initMqttSubscriber();

  mqttClient.on("message", (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      mqttSubscriber.handleMqttMessage(topic, payload);
    } catch (err) {
      console.error("[MQTT] Invalid JSON payload:", err.message);
    }
  });
};

export default {
  initMqttClient,
};
