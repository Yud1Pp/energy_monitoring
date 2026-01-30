
# 📘 Dokumentasi Database InfluxDB

Energy Monitoring System – Ravelware

==================================================

## 1️⃣ Environment Configuration (.env)

Seluruh konfigurasi InfluxDB dan MQTT disimpan di file `.env`
untuk menjaga keamanan credential dan memudahkan deployment.

```env
# InfluxDB Configuration
INFLUX_URL=
INFLUX_TOKEN=
INFLUX_ORG=
INFLUX_BUCKET=

# MQTT Configuration
MQTT_BROKER_URL=
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_CLIENT_ID=
```


==================================================

## 2️⃣ InfluxDB Configuration File

File: `src/config/influx.config.js`

```js
import "dotenv/config";
import { InfluxDB, Point } from "@influxdata/influxdb-client";

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({ url, token });

export const writeApi = influxDB.getWriteApi(org, bucket);
export const queryApi = influxDB.getQueryApi(org);

writeApi.useDefaultTags({ app: "energy-monitoring" });
```

==================================================

## 3️⃣ Desain Database InfluxDB

### Bucket

```text
energy_monitoring
```

### Measurement

```text
panel_energy
```

### Tag

```text
panel_id = lantai_1 | lantai_2 | lantai_3
```

### Fields

```text
voltage_a   (float)
voltage_b   (float)
voltage_c   (float)
current_a   (float)
current_b   (float)
current_c   (float)
power_kw    (float)
energy_kwh  (float)
pf          (float)
```

### Timestamp

```text
Timestamp diambil dari waktu server saat data diterima
(resolusi per menit)
```

==================================================

## 4️⃣ Contoh Penulisan Data ke InfluxDB

File: `src/models/energy.model.js`

```js
import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "../config/influx.config.js";

export const writeEnergyData = (panelId, payload) => {
  const point = new Point("panel_energy")
    .tag("panel_id", panelId)
    .floatField("voltage_a", payload.voltage_a)
    .floatField("voltage_b", payload.voltage_b)
    .floatField("voltage_c", payload.voltage_c)
    .floatField("current_a", payload.current_a)
    .floatField("current_b", payload.current_b)
    .floatField("current_c", payload.current_c)
    .floatField("power_kw", payload.power_kw)
    .floatField("energy_kwh", payload.energy_kwh)
    .floatField("pf", payload.pf)
    .timestamp(new Date());

  writeApi.writePoint(point);
};
```

==================================================

## 5️⃣ Contoh Data Tersimpan (Logical View)

```text
measurement: panel_energy
tag:
  panel_id = lantai_1

fields:
  voltage_a = 220.1
  voltage_b = 219.8
  voltage_c = 221.0
  current_a = 5.1
  current_b = 4.9
  current_c = 5.0
  power_kw  = 3.5
  energy_kwh= 132.1
  pf        = 0.92

timestamp:
  2026-01-30T08:40:00Z
```

==================================================

## 6️⃣ Prinsip Penyimpanan Data

```text
✔ Data disimpan mentah (raw data) setiap ±1 menit
✔ Tidak menyimpan data agregasi (daily/monthly/yearly)
✔ Semua perhitungan dilakukan saat query (Flux)
```

==================================================

## 7️⃣ Business Logic Berbasis InfluxDB

### Panel Status

```text
ONLINE  → data terakhir ≤ 5 menit
OFFLINE → data terakhir > 5 menit
```

### Today Usage

```text
today_usage = energy_kwh(sekarang) - energy_kwh(pukul 00:00)
```

### Cost

```text
cost = today_usage × 1500
```

### Monthly & Yearly Summary

```text
Dihitung dari query agregasi Flux
Tidak disimpan permanen
```

==================================================

## 8️⃣ Kesimpulan

```text
InfluxDB berfungsi sebagai time-series database utama
untuk menyimpan data sensor listrik per menit dan menjadi
sumber utama realtime monitoring, usage, dan cost calculation.
```

==================================================

```

```
