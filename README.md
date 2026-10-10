# S.A.F.E.R. — Satellite-Assisted Flood & Evacuation Router
### *NASA Space Apps Challenge 2026 — Bangladesh & Global Edition*

> **"Guiding lives to high ground through real-time NASA satellite intelligence."**

---

## 🌊 Overview & Core Problem

During extreme rainfall and transboundary surge events, traditional navigation apps (such as Google Maps) become hazardous because they only prioritize the *fastest* route—often directing fleeing families into submerged underpasses, low-lying riverbanks, or washed-out bridges.

**S.A.F.E.R.** is a flood and flash-flood emergency response platform designed for high-stress crisis scenarios. Powered by **NASA Earth Observation data** (GPM IMERG precipitation, SRTM elevation, and SMAP soil moisture), it provides:
1. **Stress-free High-Ground Evacuation Navigation** for citizens.
2. **Dynamic Locality Triage (Red $\rightarrow$ Yellow $\rightarrow$ Green)** for first responders.
3. **An Official Relief Audit & Situation Report (SitRep) Generator** for disaster authorities and NGOs.

---

## 🎯 Primary Focus & Benchmark Disaster Scenarios

1. **Bangladesh (Primary Pitch Scenario):**
   * **Focus:** 2024 Eastern Flash Floods (Feni, Parshuram, Fulgazi, and Chhagalnaiya).
   * **Challenge:** Low-elevation flat delta plains where sudden transboundary surges breach river embankments (*Muhuri river dam*).
   * **Solution:** Identifies verified multi-story concrete cyclone/flood shelters (+9.5m to +12m high ground) and highlights submerged roads to avoid.

2. **Nepal (Mountainous Flash Flood & Landslide Scenario):**
   * **Focus:** 2024 Kathmandu Valley & Bagmati / Nakkhu river flash floods.
   * **Challenge:** Steep mountain slopes (>28° slope angle) with severe debris flows and unstable riverbanks.
   * **Solution:** Evaluates slope failure risks (NASA LHASA) and routes evacuees up bedrock ridges to safety.

---

## 🛡️ Key Features

### 1. Dual-Portal Architecture
* **Citizen / Victim Portal:**
  * Clean, soothing light-gradient design with high contrast for outdoor sunlight readability.
  * Real-time elevation readout (`+4.2m — Danger Zone`).
  * Nearest verified dry shelter with occupancy counter and facilities list.
  * 1-Click safe high-ground route calculation.
  * Low-bandwidth emergency distress beacon (with pre-cached offline SMS code fallback).
* **Rescuer Operations Command Portal:**
  * Live Operations KPI Bar: Total People Rescued, Food Packs Delivered, Water Purification Kits, and Secured Sectors.
  * **Dynamic Locality Status Progression:**
    * 🔴 **Red Circle:** Critical / Unattended emergency zone.
    * 🟡 **Yellow Circle:** Rescue units actively en route or operating.
    * 🟢 **Green Circle:** Sector secured, citizens evacuated to shelters, and relief rations delivered.

### 2. Official Rescuer Audit & Relief Reporting System
* Comprehensive Situational Report (SitRep) modal tracking:
  * Number of localities visited and secured.
  * Total civilians rescued and evacuated.
  * Dry food boxes, water purification kits, and medical aid administered.
* **1-Click Export:** Download standardized `.csv` audit logs or print official PDF SitReps for disaster ministries (e.g., MoDMR), the Armed Forces, Red Crescent, and international humanitarian donors.

### 3. Modern, Eye-Pleasing Design System
* Soft light gradients (`#F8FAFC` $\rightarrow$ `#EFF6FF` $\rightarrow$ `#F0FDF4`).
* High-legibility typography (`Inter`) with high contrast.
* Professional SVG iconography (`lucide-react`) replacing playful emojis.

---

## 🚀 How to Run the Project

Inside the `SAFER` directory:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🛰️ NASA Earth Data Architecture

* **NASA GPM IMERG:** 30-minute near-real-time global precipitation rates.
* **NASA SRTM / NASADEM:** 30-meter high-resolution digital elevation model for slope and basin detection.
* **NASA SMAP:** Root-zone soil moisture saturation index.
* **OpenStreetMap (OSM):** Street network graph and verified disaster shelter points of interest.
