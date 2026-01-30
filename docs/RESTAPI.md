````md
# 📘 Dokumentasi REST API

Energy Monitoring System – Ravelware  
Base URL: `http://localhost:3000/api/v1`

==================================================

## 1️⃣ GET Realtime Energy – Semua Panel

Digunakan oleh **dashboard realtime (card panel lantai 1–3)**

### Endpoint

```http
GET /energy/realtime
```
````

### Deskripsi

Mengambil data **realtime terakhir** dari seluruh panel listrik (lantai 1–3), termasuk:

- Tegangan
- Arus
- Daya
- Energi
- Status panel (ONLINE / OFFLINE)
- Cost hari ini

Status panel:

```text
ONLINE  → data terakhir ≤ 5 menit
OFFLINE → data terakhir > 5 menit
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "panel_id": "lantai_1",
      "voltage": 217.89,
      "current": 0.64,
      "power_kw": 0.92,
      "energy_kwh": 10.077,
      "pf": 0.95,
      "v_unbal": 0.011,
      "i_unbal": 0.001,
      "status": "ONLINE",
      "cost_rp": 17121,
      "timestamp": "2026-01-30T02:28:30.549Z"
    },
    {
      "panel_id": "lantai_2",
      "voltage": 222.82,
      "current": 0.73,
      "power_kw": 0.21,
      "energy_kwh": 20.061,
      "pf": 1,
      "v_unbal": 0.004,
      "i_unbal": 0.019,
      "status": "ONLINE",
      "cost_rp": 34084,
      "timestamp": "2026-01-30T02:28:30.55Z"
    },
    {
      "panel_id": "lantai_3",
      "voltage": 215.22,
      "current": 0.87,
      "power_kw": 0.31,
      "energy_kwh": 30.066,
      "pf": 0.94,
      "v_unbal": 0.011,
      "i_unbal": 0.019,
      "status": "ONLINE",
      "cost_rp": 51082,
      "timestamp": "2026-01-30T02:28:30.55Z"
    }
  ]
}
```

### Digunakan pada Mockup

```text
- Card Panel Lantai 1–3
- Status Bulat Hijau / Abu
- Nilai kW, A, V
- Today Usage & Cost per panel
```

==================================================

## 2️⃣ GET Realtime Energy – Per Panel

Digunakan saat user memilih **detail panel**

### Endpoint

```http
GET /energy/:panelId/realtime
```

### Path Parameter

```text
panelId = lantai_1 | lantai_2 | lantai_3
```

### Contoh Request

```http
GET /energy/lantai_3/realtime
```

### Response

```json
{
  "success": true,
  "data": {
    "panel_id": "lantai_3",
    "voltage": 215.63,
    "current": 0.31,
    "power_kw": 0.6,
    "energy_kwh": 30.076,
    "pf": 0.93,
    "v_unbal": 0.019,
    "i_unbal": 0.009,
    "status": "ONLINE",
    "cost_rp": 51099,
    "timestamp": "2026-01-30T02:29:30.662Z"
  }
}
```

### Digunakan pada Mockup

```text
- Detail panel per lantai
- Update realtime value
```

==================================================

## 3️⃣ GET Today Usage – Per Panel

Digunakan untuk menampilkan **Today’s Usage (kWh) & Cost**

### Endpoint

```http
GET /energy/:panelId/today
```

### Contoh Request

```http
GET /energy/lantai_3/today
```

### Response

```json
{
  "success": true,
  "data": {
    "panel_id": "lantai_3",
    "today_usage_kwh": 0.065,
    "cost_rp": 110
  }
}
```

### Perhitungan

```text
today_usage = energy_kwh(sekarang) - energy_kwh(pukul 00:00)
cost        = today_usage × 1.500
```

==================================================

## 4️⃣ GET Summary Today – Total Gedung

Digunakan untuk **total usage & cost seluruh panel**

### Endpoint

```http
GET /summary/today
```

### Response

```json
{
  "success": true,
  "data": {
    "total_today_usage_kwh": 0.286,
    "total_cost_rp": 486
  }
}
```

### Digunakan pada Mockup

```text
- Total Today Usage (gabungan panel)
- Total Cost Gedung
```

==================================================

## 5️⃣ GET Monthly Summary – Total Energy & Cost per Bulan

Digunakan untuk **grafik bar & line chart**

### Endpoint

```http
GET /summary/monthly?year=YYYY
```

### Query Parameter

```text
year = tahun (contoh: 2026)
```

### Contoh Request

```http
GET /summary/monthly?year=2026
```

### Response

```json
{
  "success": true,
  "data": [
    { "month": 1, "energy_kwh": 30.043, "cost_rp": 51043 },
    { "month": 2, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 3, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 4, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 5, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 6, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 7, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 8, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 9, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 10, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 11, "energy_kwh": 0, "cost_rp": 0 },
    { "month": 12, "energy_kwh": 0, "cost_rp": 0 }
  ]
}
```

### Digunakan pada Mockup

```text
- Grafik Total Energy Usage 2023
- Bar chart (kWh)
- Line chart (Cost)
```

==================================================

## 6️⃣ Routing Summary (Implementasi)

```js
// energy routes
energyRouter.get("/realtime", energyController.getRealtimeAllPanels);
energyRouter.get("/:panelId/realtime", energyController.getRealtimeByPanel);
energyRouter.get("/:panelId/today", energyController.getTodayUsageByPanel);

// summary routes
router.get("/today", summaryController.getTodaySummary);
router.get("/monthly", summaryController.getMonthlySummary);
```

==================================================

## 7️⃣ Catatan Integrasi Frontend (Mockup Friendly)

```text
✔ Response JSON konsisten
✔ Field sudah siap mapping ke UI
✔ Tidak perlu logic tambahan di frontend
✔ Backend bertanggung jawab penuh atas kalkulasi
```

==================================================
