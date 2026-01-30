# 📘 Panduan Konfigurasi & Menjalankan Sistem

Energy Monitoring System – Ravelware

==================================================

## 1️⃣ Menyiapkan InfluxDB Server

Sistem ini menggunakan **InfluxDB v2 (OSS atau Cloud)** sebagai database utama.

### Catatan Penting

```text
✔ Cara konfigurasi InfluxDB OSS dan InfluxDB Cloud adalah SAMA
✔ Perbedaan hanya pada nilai URL dan Token
✔ Kode backend tidak perlu diubah
```

### Langkah Umum

```text
1. Pastikan InfluxDB v2 sudah berjalan
   - OSS   : service lokal aktif
   - Cloud : akun & bucket sudah tersedia
2. Pastikan sudah memiliki:
   - Organization
   - Bucket
   - API Token (read/write)
```

InfluxDB **harus aktif terlebih dahulu** sebelum backend dijalankan.

==================================================

## 2️⃣ Menyiapkan Environment Variable (.env)

Backend menggunakan **environment variable** untuk menyimpan konfigurasi
agar aman dan mudah dipindahkan antar environment.

### Buat File `.env`

Di root project:

```text
.env
```

### Variabel yang Wajib Ada

> ⚠️ **Nilai tidak dituliskan di dokumentasi**

```env
INFLUX_URL=
INFLUX_TOKEN=
INFLUX_ORG=
INFLUX_BUCKET=

MQTT_BROKER_URL=
MQTT_USERNAME=
MQTT_PASSWORD=
MQTT_CLIENT_ID=
```

### Penjelasan Singkat

```text
INFLUX_URL       → alamat server InfluxDB (OSS / Cloud)
INFLUX_TOKEN     → token akses InfluxDB
INFLUX_ORG       → organization InfluxDB
INFLUX_BUCKET    → bucket penyimpanan data

MQTT_BROKER_URL  → alamat broker MQTT
MQTT_USERNAME    → username MQTT (opsional)
MQTT_PASSWORD    → password MQTT (opsional)
MQTT_CLIENT_ID   → client ID backend
```

==================================================

## 3️⃣ Menjalankan Backend Service

Pastikan semua dependency sudah ter-install.

### Install Dependency

```bash
npm install
```

### Menjalankan Aplikasi

```bash
npm run start
```

==================================================

## 4️⃣ Proses yang Terjadi Saat Aplikasi Berjalan

Saat perintah `npm run start` dijalankan, sistem akan:

```text
1. Load environment variable (.env)
2. Inisialisasi koneksi InfluxDB
3. Inisialisasi koneksi MQTT Broker
4. MQTT Subscriber mulai subscribe ke topic DATA/PM/#
5. Backend REST API aktif
```

==================================================

## 5️⃣ Alur Sistem Setelah Berjalan

```text
Sensor / Simulator
  ↓
MQTT Broker
  ↓
MQTT Subscriber (Backend)
  ↓
InfluxDB (data tersimpan)
  ↓
Backend Service (query & logic)
  ↓
REST API
  ↓
Web Dashboard
```

==================================================

## 6️⃣ Verifikasi Sistem Berjalan

Setelah backend aktif, REST API dapat diakses melalui:

```text
http://localhost:3000/api/v1
```

Contoh endpoint:

```text
GET /energy/realtime
GET /energy/lantai_1/realtime
GET /energy/lantai_1/today
GET /summary/today
GET /summary/monthly?year=YYYY
```

Jika data MQTT masuk dengan normal:

```text
✔ Data tersimpan di InfluxDB
✔ Status panel berubah ONLINE
✔ Dashboard dapat menampilkan data realtime
```

==================================================

## 7️⃣ Kesimpulan

```text
1. InfluxDB harus aktif terlebih dahulu (OSS / Cloud)
2. Konfigurasi backend dilakukan melalui file .env
3. Backend dijalankan dengan npm run start
4. Sistem siap menerima data dan melayani REST API
```

==================================================
