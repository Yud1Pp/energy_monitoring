import "dotenv/config";
import app from "./app.js";
import mqttClient from "./mqtt/mqttClient.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mqttClient.initMqttClient();
});
