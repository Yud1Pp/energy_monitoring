# 📘 Dokumentasi Arsitektur Sistem  
Energy Monitoring System – Ravelware

==================================================

## 1️⃣ Tujuan Arsitektur Sistem

Arsitektur sistem **Energy Monitoring** dirancang untuk:
- Menerima data sensor listrik secara realtime
- Menyimpan data time-series secara efisien
- Mengolah data menjadi informasi monitoring & billing
- Menyediakan REST API yang siap digunakan Web Dashboard

Sistem mengutamakan:
✔ Realtime
✔ Scalability
✔ Separation of Concerns
✔ Backend-driven logic

==================================================

## 2️⃣ Gambaran Umum Arsitektur

Sistem menggunakan pendekatan **event-driven ingestion** dan **RESTful service**.

### Alur Utama Sistem

```text
Sensor
  ↓
MQTT Broker
  ↓
MQTT Subscriber
  ↓
InfluxDB
  ↓
Backend Service
  ↓
REST API
  ↓
Web Dashboard
```

==================================================

## 3️⃣ Teknologi yang Digunakan
Sensor / Simulator : MQTT Publisher
Protocol           : MQTT
Message Broker     : test.mosquitto.org
Backend Runtime    : Node.js
Web Framework      : Express.js
Database           : InfluxDB OSS v2
Architecture       : Layered MVC
Data Format        : JSON

==================================================

## 4️⃣ Diagram Arsitektur Sistem (Logical View)

```text
+-------------------+
|  Sensor / Panel   |
|  (Power Meter)    |
+---------+---------+
          |
          | MQTT Publish (±1 menit)
          v
+-------------------+
|   MQTT Broker     |
| test.mosquitto.org|
+---------+---------+
          |
          | MQTT Subscribe
          v
+-------------------+
| MQTT Subscriber   |
| (Node.js Module)  |
+---------+---------+
          |
          | Write Raw Data
          v
+-------------------+
|    InfluxDB       |
| energy_monitoring |
+---------+---------+
          |
          | Flux Query
          v
+-------------------------------+
|   Backend Service Layer       |
| (Business Logic & Aggregator) |
+---------+---------------------+
          |
          | REST API (JSON)
          v
+-------------------+
|  Web Dashboard    |
| (Frontend Team)   |
+-------------------+
```

==================================================

## 5️⃣ Alur Data Sistem (Step-by-Step)

### 5.1 Sensor → MQTT Broker
- Sensor mengirim data setiap ±1 menit
- Protocol MQTT
- Topic:
  DATA/PM/PANEL_LANTAI_1
  DATA/PM/PANEL_LANTAI_2
  DATA/PM/PANEL_LANTAI_3

---

### 5.2 MQTT Broker → MQTT Subscriber
- MQTT Subscriber subscribe ke DATA/PM/#
- Broker meneruskan pesan ke subscriber
- Topic dipetakan menjadi panel_id

---

### 5.3 MQTT Subscriber → InfluxDB

- Payload divalidasi
- Data disimpan sebagai raw time-series
- Tidak ada data agregasi yang disimpan

Database design:

```text
Bucket      : energy_monitoring
Measurement : panel_energy
```

---

### 5.4 InfluxDB → Backend Service
- Backend Service melakukan query Flux
- Mengambil data terbaru & historis
- Melakukan perhitungan logika bisnis

Logika bisnis:
- Status panel (ONLINE / OFFLINE)
- Today usage (kWh)
- Cost (Rp)
- Monthly summary

---

### 5.5 Backend Service → REST API
- Controller menerima request HTTP
- Memanggil service layer
- Service mengembalikan data terstruktur

---

### 5.6 REST API → Web Dashboard
- Frontend hanya konsumsi data
- Tidak ada perhitungan di frontend
- Data langsung sesuai mockup

==================================================

## 6️⃣ Arsitektur Backend (Layered MVC)

```text
src/
├── config/        → environment, MQTT, InfluxDB
├── mqtt/          → subscriber & topic handler
├── models/        → data template / response contract
├── services/      → business logic & query DB
├── controllers/   → HTTP request handler
├── routes/        → endpoint mapping
└── simulators/    → sensor simulator
```

==================================================

## 7️⃣ Penjelasan Setiap Layer

### Config

```text
- Menyimpan konfigurasi global
- Menggunakan environment variable (.env)
```

### MQTT

```text
- Menangani komunikasi MQTT
- Fokus hanya pada ingestion data
```

### Model

```text
- Bukan ORM / DB access
- Template response API
- Menjaga konsistensi struktur data
```

### Service

```text
- Query InfluxDB
- Seluruh business logic berada di sini
```

### Controller

```text
- Handle request & response
- Tanpa logic bisnis
```

### Routes

```text
- Mapping URL ke controller
```

==================================================

## 8️⃣ Prinsip Desain Arsitektur
✔ Event-driven ingestion
✔ Single source of truth (InfluxDB)
✔ Clean separation of concerns
✔ Scalable (mudah tambah panel)
✔ Mockup-ready API

==================================================

## 9️⃣ Kesesuaian dengan Mockup Dashboard
✔ Realtime monitoring
✔ Status panel ONLINE / OFFLINE
✔ Today usage & cost
✔ Grafik bulanan
✔ Response siap langsung dipakai UI

==================================================
