import "dotenv/config";
import mqtt from "mqtt";

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;

const PANELS = {
  "DATA/PM/PANEL_LANTAI_1": { energy: 10.0 },
  "DATA/PM/PANEL_LANTAI_2": { energy: 20.0 },
  "DATA/PM/PANEL_LANTAI_3": { energy: 30.0 },
};

const PUBLISH_INTERVAL_MINUTES = 1;

const client = mqtt.connect(MQTT_BROKER_URL, {
  clientId: `energy-monitoring-simulator-${Math.random().toString(16).slice(2)}`,
});

client.on("connect", () => {
  console.log("[SIMULATOR] Connected to MQTT broker");

  publishData();

  setInterval(publishData, PUBLISH_INTERVAL_MINUTES * 60 * 1000);
});

const publishData = () => {
  Object.entries(PANELS).forEach(([topic, state]) => {
    const payload = generatePayload(state);

    client.publish(topic, JSON.stringify(payload), {
      retain: true,
      qos: 0,
    });
    console.log(`[SIMULATOR] Published to ${topic}`, payload);
  });
};

const generatePayload = (state) => {
  const voltage = randomFloat(215, 230);
  const current = randomFloat(0.3, 1.2);
  const powerKw = randomFloat(0.2, 1.0);
  const energyIncrement = powerKw * (PUBLISH_INTERVAL_MINUTES / 60);

  state.energy += energyIncrement;

  return {
    status: "OK",
    data: {
      v: [voltage, voltage, voltage, voltage],
      i: [current, current, current, current],
      kw: powerKw.toFixed(2),
      kVA: (powerKw * 1.1).toFixed(2),
      klh: state.energy.toFixed(3),
      pf: randomFloat(0.9, 1).toFixed(2),
      vunbal: randomFloat(0, 0.02).toFixed(3),
      iunbal: randomFloat(0, 0.02).toFixed(3),
      time: new Date().toISOString(),
    },
  };
};

const randomFloat = (min, max) => Math.random() * (max - min) + min;
