# 🚀 ProctorVision — Render & Vercel Deployment Guide

Yeh step-by-step guide hai **Backend ko Render par** aur **Frontend ko Vercel par** bina kisi error ke deploy karne ke liye.

---

## 🛠️ Step 1: Backend Deployment on Render (render.com)

Aapka backend repository already GitHub par live hai:  
`https://github.com/Ashishmeena01/sheriyansh-hackthon-backend.git`

### Render Steps:
1. [render.com](https://render.com) par jayein aur **GitHub** ke sath Sign in / Login karein.
2. Dashboard par **"New +"** button par click karein aur **"Web Service"** select karein.
3. **Build and deploy from a Git repository** choose karein aur **Next** dabayein.
4. Apna GitHub repo connect karein: `Ashishmeena01/sheriyansh-hackthon-backend`.
5. Configuration form me ye settings bharein:
   - **Name:** `proctorvision-backend` (ya apni pasand ka koi bhi naam)
   - **Region:** `Singapore` ya `Frankfurt` (India ke sabse paas Singapore hai)
   - **Branch:** `main`
   - **Root Directory:** *(Khali chhod dein / Blank)*
   - **Runtime / Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

6. **Environment Variables** add karein (**Add Environment Variable** par click karke):

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://ashishmeena250332:1234567890@sheryinas-hackathon.aqhsvuu.mongodb.net/?retryWrites=true&w=majority&appName=Sheryinas-hackathon` |
| `JWT_SECRET` | `proctor_vision_super_secret_jwt_key_2026_hackathon` |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `*` |
| `ANTHROPIC_API_KEY` | *(Aapki Claude API key)* |
| `ANTHROPIC_MODEL` | `claude-3-5-sonnet-latest` |

7. **"Deploy Web Service"** par click karein.
8. 2-3 minute me deploy ho jayega aur Render aapko ek live URL dega, jaise:  
   👉 `https://proctorvision-backend.onrender.com`

> **Verify:** Browser me `https://proctorvision-backend.onrender.com/api/v1/health` open karke dekhein. `{"status":"ok"}` aana chahiye.

---

## 🌐 Step 2: Frontend Deployment on Vercel (vercel.com)

Vercel par frontend deploy karne ke liye pehle `client` folder ko GitHub par push karna hoga.

### 2.1: Frontend ko GitHub par Push Karein
1. [github.com](https://github.com/new) par jayein aur ek **New Repository** banayein:
   - Repo Name: `proctorvision-frontend` (Public ya Private)
   - *"Initialize with README"* unchecked rakhein.
   - **Create repository** par click karein.

2. Apne computer me VS Code ke terminal me ye commands run karein:
```powershell
cd d:\KODR\Hackathon\Sheryians-Hackathon\client
git init
git add .
git commit -m "feat: Production deployment readiness for Vercel"
git branch -M main
git remote add origin https://github.com/Ashishmeena01/proctorvision-frontend.git
git push -u origin main
```
*(Apna GitHub repo URL lagayein)*

---

### 2.2: Vercel par Project Deploy Karein
1. [vercel.com](https://vercel.com) par jayein aur **GitHub** se Login karein.
2. Dashboard par **"Add New..."** button par click karke **"Project"** select karein.
3. Apni frontend repository `proctorvision-frontend` ke aage **"Import"** dabayein.
4. Project Configuration:
   - **Framework Preset:** `Vite` (Vercel automatically detect kar lega)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **Environment Variables** expand karein aur add karein:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://proctorvision-backend.onrender.com` *(Step 1 me mila Render backend URL)*
6. **"Deploy"** button par click karein.
7. Vercel 1 minute ke andar frontend live kar dega aur aapko domain de dega:  
   👉 `https://proctorvision-frontend.vercel.app`

---

## ⚡ Step 3: Final Connection (CORS Check)
Jab aapka Vercel URL live ho jaye (e.g. `https://proctorvision-frontend.vercel.app`):
1. Render ke Dashboard me apne backend par jayein.
2. **Environment** tab me `CLIENT_URL` ko update karke apna Vercel domain daal dein:  
   `CLIENT_URL` = `https://proctorvision-frontend.vercel.app,http://localhost:5173,http://localhost:5174`
3. Backend automatic restart ho jayega.

Aapka full-stack platform live ho chuka hai! 🎉
