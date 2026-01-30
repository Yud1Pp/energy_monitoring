Siap 👍 ini kita **rapikan & luruskan dokumentasi arsitekturnya** supaya **sesuai dengan implementasi kamu** dan **secara teknis benar** (ini penting banget buat reviewer).

Intinya: **Model BUKAN akses database**, tapi **template / response mapper**.
Akses InfluxDB ada di **service layer**.

Di bawah ini **bagian dokumentasi yang sudah diperbaiki**, tinggal **copy–paste** menggantikan bagian terkait di dokumen arsitektur.

---

````md
## 5️⃣ Arsitektur Backend (MVC – Disesuaikan Implementasi)

Backend menggunakan pola **MVC ringan** dengan pemisahan tanggung jawab yang jelas.
Model pada sistem ini **bukan ORM / database access**, melainkan **template data response**.

==================================================

### Struktur Folder

```text
src/
├── config/        → konfigurasi environment, MQTT, InfluxDB
├── mqtt/          → MQTT subscriber & topic handler
├── models/        → data template / response mapper
├── services/      → business logic + query InfluxDB
├── controllers/   → REST API handler
├── routes/        → endpoint routing
└── simulators/    → MQTT publisher (sensor simulator)
```
````

==================================================

## 6️⃣ Penjelasan Layer Secara Detail

### 6.1 Config Layer

```text
Tanggung jawab:
- Load environment variables (.env)
- Inisialisasi koneksi MQTT
- Inisialisasi InfluxDB client
```

File utama:

```text
config/influx.config.js
config/mqtt.config.js
config/env.config.js
```

==================================================

### 6.2 MQTT Layer

```text
Tanggung jawab:
- Subscribe ke topic MQTT
- Menerima payload sensor
- Mapping topic → panel_id
- Meneruskan data ke service
```

Komponen:

```text
mqttClient.js
mqttSubscriber.js
topicMapper.js
```

==================================================

### 6.3 Model Layer (Template / Data Contract)

⚠️ **Model TIDAK melakukan akses database**

Model hanya berfungsi sebagai:

```text
- Data template
- Response formatter
- Kontrak data API (API contract)
```

Contoh implementasi:

```js
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
```

Fungsi model:

```text
✔ Menjaga konsistensi response API
✔ Menghindari logic di controller
✔ Memudahkan perubahan struktur data
```

==================================================

### 6.4 Service Layer (Core Logic)

Service layer adalah **pusat logika sistem**.

Tanggung jawab:

```text
- Query data ke InfluxDB (Flux)
- Menghitung status panel
- Menghitung today usage
- Menghitung cost
- Agregasi monthly & yearly
```

Contoh service:

```text
energy.service.js
status.service.js
cost.service.js
summary.service.js
```

Alur:

```text
Controller → Service → InfluxDB → Service → Model → Controller
```

==================================================

### 6.5 Controller Layer

```text
Tanggung jawab:
- Menerima HTTP request
- Validasi parameter
- Memanggil service layer
- Mengembalikan response JSON
```

Controller **tidak berisi logic bisnis**.

==================================================

### 6.6 Routes Layer

```text
Tanggung jawab:
- Mapping URL → Controller
- Menjaga struktur endpoint API
```

==================================================

## 7️⃣ Alur Data (Final & Akurat)

```text
Sensor
  ↓
MQTT Broker
  ↓
MQTT Subscriber
  ↓
InfluxDB
  ↓
Service Layer (query + logic)
  ↓
Model (response template)
  ↓
REST API
  ↓
Web Dashboard
```

==================================================

## 8️⃣ Kenapa Model Dibuat Sebagai Template?

```text
✔ Lebih ringan (tanpa ORM)
✔ Cocok untuk time-series database
✔ Response API konsisten
✔ Mudah dites
✔ Clean architecture
```

==================================================

## 9️⃣ Kesimpulan

```text
Model → hanya template data
Service → akses InfluxDB & logic
Controller → HTTP handler
```

Desain ini sesuai dengan kebutuhan sistem monitoring realtime
dan best practice backend modern.

```

---
```
