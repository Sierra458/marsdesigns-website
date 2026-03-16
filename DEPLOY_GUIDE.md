# MARS Designs — Website v3 Deployment Guide

## What's in v3
- Updated logo (hexagon + Mars planet)
- New sections: Custom Agent Development, Agent-to-Agent Architecture, Answer Engine Optimization
- New pricing: Launchpad ($2,000-$5,000), Retainer ($458/mo), Agents & AEO ($500+)
- Contact email: discovery@marsdesigns.io
- Location: "Based in Texas. Available everywhere."
- Privacy policy (TCPA, CAN-SPAM, CCPA, Voice AI, SMS compliant)
- Contact form with consent text + Google Sheets integration

---

## Quick Deploy (5 minutes)

### 1. Clone your repo
```bash
git clone https://github.com/sierra458/marsdesigns-website.git
cd marsdesigns-website
```

### 2. Delete everything except .git
**Mac/Linux:**
```bash
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +
```
**Windows PowerShell:**
```powershell
Get-ChildItem -Exclude .git | Remove-Item -Recurse -Force
```

### 3. Copy new files in
Unzip `marsdesigns-website-v3.zip` and copy all contents into the repo folder. Verify `index.html` is at the ROOT.

### 4. Test locally
```bash
npm install
npm run dev
```
Open http://localhost:5173

### 5. Push
```bash
git add .
git commit -m "v3 — Agents, A2A, AEO, updated pricing & privacy"
git push origin main
```

### 6. Verify on Vercel
Vercel auto-deploys. Check dashboard for green checkmark (~30-60s).

---

## Vercel Settings
| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Root Directory | _(blank)_ |

## DNS (marsdesigns.io)
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

## Contact Form
Replace `YOUR_SCRIPT_ID` in `src/App.jsx` with your Google Apps Script deployment URL.

## Troubleshooting
- **Build fails:** Verify Vercel Framework = Vite
- **404:** Clear Root Directory in Vercel settings
- **Old site cached:** Ctrl+Shift+R to hard refresh
