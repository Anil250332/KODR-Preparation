# 🩸 PulseRelay — Emergency Blood Coordination & Inter-Hospital Transfer Network

> **A mission-critical emergency blood coordination network connecting hospitals, regional blood banks, and healthcare authorities in real time to eliminate delays during the golden hour.**

---

## 📌 Executive Summary & Problem Statement

In life-threatening medical emergencies (trauma, surgical hemorrhage, post-partum complications), securing rare blood components within the **golden hour** is often a matter of life and death. 

Traditionally, hospitals rely on fragmented phone calls, manual spreadsheets, and outdated registries to locate compatible blood units in nearby facilities — leading to critical delays and expired units.

**PulseRelay** solves this by establishing a **unified, verified, real-time inter-hospital blood exchange grid**. Hospitals can broadcast emergency blood needs across the network, and nearby verified centers can immediately respond, allocate, and fulfill units with end-to-end telemetry and verification.

---

## 🚀 Key Platform Roles & Features

### 👑 1. Super Admin (Healthcare Authority / Network Oversight)
* **National Blood Telemetry**: Comprehensive visibility into total verified stock, participating hospitals, and active regional emergencies.
* **Hospital Verification & Approvals**: Review medical licenses, facility credentials, and compliance before onboarding onto the network.
* **Emergency Request Monitoring**: Live oversight of all open and accepted emergency broadcasts across hospitals.
* **Audit Trail & System Compliance**: Real-time logging of facility registrations, verifications, and unit allocations.

### 🏥 2. Hospital Admin (Hospital Operations)
* **Raise Emergency Broadcasts**: Broadcast critical blood group needs with urgency tags (`CRITICAL`, `HIGH`, `NORMAL`), required units, patient diagnosis, and deadlines.
* **Incoming Emergency Network**: Discover other hospitals in the network needing assistance and accept requests with one click.
* **In-House Inventory Management**: Real-time tracking of whole blood, PRBC, platelets, FFP, and cryoprecipitate with temperature logs.
* **Staff Management**: Add, manage, and toggle active status for doctors and blood bank officers.
* **Hospital Profile & Facility Telemetry**: Maintain facility contact info, emergency desk numbers, and ICU bed capacities.

### 🩸 3. Blood Bank Officer (Fulfillment & Lab Operations)
* **Real-Time Stock Matrix**: Visual breakdown of certified available units vs. reserved units across all blood groups.
* **One-Click Acceptance & Connection**: Direct acceptance of incoming emergency requests with automatic reservation locks.
* **Emergency Request Tracking**: Monitor all requests broadcasted by the officer's hospital with live partner hospital contact details.
* **Quick Stock Adjustments**: Instant increment/decrement adjustments with real-time sync.

---

## 🎨 UI/UX Excellence

* **Full Skeleton Loading Architecture**: Integrated skeleton loading states across every table, card grid, metric counter, and request feed for smooth user experience.
* **Clinical-Grade Color Aesthetics**: High-contrast, accessibility-focused medical theme built on teal (`#0d9488`), emerald, and critical rose alerts.
* **Interactive Simulator**: Built-in simulator on the landing page demonstrating real-time broadcast matching and fulfillment.
* **Responsive Layouts**: Designed for tablets, emergency desk terminals, and mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 19, TypeScript |
| **Build Tool & Bundler** | Vite 8 |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), React Redux |
| **Styling & Design System** | Tailwind CSS (v4), Vanilla CSS Utilities |
| **Iconography** | Lucide React |
| **Routing** | React Router DOM (v7) |
| **Networking & Telemetry** | Axios HTTP Client, Socket.io Client |

---

## 📂 Project Directory Structure

```plaintext
frontend/
├── public/
│   ├── favicon.svg             # Medical-grade heartbeat SVG favicon
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # Reusable UI primitives
│   │   │   ├── Badge.tsx       # Urgency & verification badges
│   │   │   ├── Header.tsx      # Top bar navigation & user profile
│   │   │   ├── Modal.tsx       # Dialog modal component
│   │   │   ├── Sidebar.tsx     # Role-based navigational drawer
│   │   │   ├── Skeleton.tsx    # Card, table row, & request skeletons
│   │   │   ├── StatCard.tsx    # Metric display card with skeleton support
│   │   │   └── ToastContainer.tsx
│   │   └── ui/
│   ├── hooks/                  # Typed Redux hooks
│   ├── layouts/                # AppLayout with dynamic navigation
│   ├── pages/
│   │   ├── auth/               # LoginPage & ForgotPasswordPage
│   │   ├── blood-bank/         # Officer overview, inventory & incoming
│   │   ├── hospital-admin/     # Hospital overview, requests & staff
│   │   ├── landing/            # Public marketing landing page & simulator
│   │   └── super-admin/        # Authority overview, facility approvals & inventory
│   ├── routes/                 # Role-based route definitions
│   ├── services/               # REST API client & real-time adapters
│   ├── store/                  # Redux slices (auth, emergency, hospital, inventory, toast)
│   ├── types/                  # TypeScript interface contracts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.js
```

---

## ⚡ Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anil250332/FinalRound-hackathon.git
   cd FinalRound-hackathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔑 Demo Access Credentials

Use the following pre-configured credentials to explore each role:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Super Admin** | `superadmin@pulserelay.org` | `Admin@123` | National Oversight, Hospital Approvals, Emergency Feed |
| **Hospital Admin** | `admin@citycare.org` | `Hospital@123` | Hospital Inventory, Emergency Broadcasts, Staff Management |
| **Blood Bank Officer** | `officer@citycare.org` | `Officer@123` | Real-time Stock Matrix, Accept Requests, Unit Reservations |

*(Quick switch button is also available directly on the login screen for instant evaluation).*

---

## 🔒 Security & Compliance
* **JWT Authentication**: Role-based access enforcement on protected routes.
* **Audit Trail**: Every verification, hospital onboarding, and unit allocation is logged with timestamps.
* **Cold Storage Telemetry**: Temperature and shelf-life tracking for certified medical compliance.

---

## 📄 License
This project was developed for the **CodeRush Hackathon Final Round**.
Licensed under the [MIT License](LICENSE).
