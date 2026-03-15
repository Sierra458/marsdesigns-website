# MaRs Designs — Website Update & Deployment Guide

## Prerequisites
- Git installed on your computer
- GitHub account (github.com/sierra458)
- Vercel account linked to your GitHub
- Node.js v18+ installed (check with `node --version`)

---

## OPTION A: Full Replace (Recommended — Cleanest Approach)

### Step 1: Download the Project Files
Download all the files from this chat. You'll get a folder called `marsdesigns-website/` containing:

```
marsdesigns-website/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

### Step 2: Clone Your Existing Repo
Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
git clone https://github.com/sierra458/marsdesigns-website.git
cd marsdesigns-website
```

### Step 3: Clear Old Files
Delete everything EXCEPT the `.git` folder:

**Mac/Linux:**
```bash
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +
```

**Windows (PowerShell):**
```powershell
Get-ChildItem -Exclude .git | Remove-Item -Recurse -Force
```

### Step 4: Copy New Files In
Copy all the downloaded files into this folder. Make sure `index.html` and `package.json` are at the ROOT level (not nested inside another folder).

Your structure should look like:
```
marsdesigns-website/
├── .git/            (existing — don't touch)
├── index.html       ← must be at root
├── package.json     ← must be at root
├── vite.config.js
├── vercel.json
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

### Step 5: Test Locally
```bash
npm install
npm run dev
```
Open http://localhost:5173 in your browser. Verify everything looks good.

### Step 6: Commit & Push
```bash
git add .
git commit -m "v2.0 — Complete site rebuild with updated design"
git push origin main
```

### Step 7: Verify Vercel Auto-Deploys
1. Go to https://vercel.com/dashboard
2. Click your `marsdesigns-website` project
3. You should see a new deployment building automatically
4. Wait for the green checkmark (usually 30-60 seconds)
5. Click "Visit" to see your live site

### Step 8: Verify Vercel Settings
If the build fails, go to **Settings → General** and confirm:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Root Directory:** _(leave blank — files are at root now)_

If you previously set Root Directory to `marsdesigns-deploy`, **clear it** since files are now at the root.

---

## OPTION B: Quick Update (If You Just Need to Change Content)

If the site is already deployed and you only need to edit text, pricing, etc.:

### Step 1: Edit on GitHub Directly
1. Go to https://github.com/sierra458/marsdesigns-website
2. Navigate to `src/App.jsx`
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes"
6. Vercel auto-deploys within ~60 seconds

---

## Connecting Your Domain (marsdesigns.io)

### In Vercel:
1. Go to your project → **Settings** → **Domains**
2. Add `marsdesigns.io` and `www.marsdesigns.io`

### At Your Domain Registrar:
Add these DNS records:

| Type  | Name  | Value                 |
|-------|-------|-----------------------|
| A     | @     | 76.76.21.21           |
| CNAME | www   | cname.vercel-dns.com  |

Wait 5-30 minutes for DNS propagation. Vercel auto-provisions SSL.

---

## Contact Form Setup (Google Sheets Integration)

1. Open the Google Sheets tracker (created in a previous chat)
2. Go to **Extensions → Apps Script**
3. Paste the Apps Script code (from the `google_apps_script.js` file)
4. Click **Deploy → New Deployment → Web App**
5. Set "Who has access" to **Anyone**
6. Copy the deployment URL
7. In `src/App.jsx`, find `YOUR_SCRIPT_ID` and replace with your URL
8. Commit and push — Vercel auto-deploys

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Vercel | Check Settings → Framework = Vite, Output = dist |
| 404 after deploy | Clear Root Directory in Vercel settings |
| Site won't load | Check that `index.html` references `/src/main.jsx` |
| Contact form broken | Verify Google Apps Script URL in App.jsx |
| Domain not working | Check DNS records, wait up to 30 min |
| Old site still showing | Hard refresh (Ctrl+Shift+R) or clear cache |
