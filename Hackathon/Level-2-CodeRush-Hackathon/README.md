# CodeRush Hackathon — Problem R2-01: Event Auction System

A transparent, real-time timed auction system built with the **MERN Stack** (MongoDB, Express, React, Node.js) and **Socket.IO**, designed with an ultra-clean **Black and White Monochrome Theme**.

---

## 🎯 Problem Statement Fulfillment

| Required Feature | Implementation Details |
| :--- | :--- |
| **Display the item and starting price** | Prominently displays the single lot item (*Leica M-Monochrom 'Stealth Edition'*), photo, description, and starting price (`$1,000`). |
| **Allow participants to place bids** | Input fields for Participant Name and Bid Amount with quick increment shortcuts (`+$50`, `+$100`, `+$250`, `+$500`) and 1-click persona switching. |
| **Reject bids that do not exceed current highest bid** | Client-side validation + strict server-side validation (`400 Bad Request`). Prominent high-contrast rejection banner explaining why the bid was rejected. |
| **Display current highest bid & bid history** | Real-time highlight card showing the leading bid and leader. Live audit table with Rank (#1 Leading, #2, etc.), Bidder, Amount, and exact Timestamp. |
| **Stop accepting bids when the auction ends** | Synchronized countdown timer. Once the clock reaches `00:00`, input fields and submit button automatically lock with an explicit `Auction Ended • Bids Closed` status. Backend rejects any late bids. |
| **Display the winner** | When time runs out, a high-contrast Winner Card is displayed with Trophy icon, Winner Name, Final Winning Bid, Hammer timestamp, and monochrome confetti. |
| **Black & White Theme** | Sleek, modern monochrome aesthetic (deep black backgrounds, dark zinc cards, stark white typography, monochrome badges, and high contrast). |
| **Organizer / Judge Controls** | Quick-control modal in header allowing judges to reset or set custom auction durations (e.g. 60s, 120s, 180s) for multiple test runs. |

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React (Vite), Tailwind CSS (v4), Socket.io-client, Lucide Icons, Canvas-Confetti
- **Backend**: Node.js, Express, Socket.IO (bidirectional real-time broadcast)
- **Database**: MongoDB via Mongoose with an automatic seamless in-memory fallback for zero-crash demo readiness.

---

## 🚀 How to Run Locally

### 1. Backend Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```
