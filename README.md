# MARS Designs — marsdesigns.io

AI Implementation & Automation for Small Businesses. Houston, Texas.

## Quick Deploy (15 minutes total)

### Prerequisites
- A GitHub account (free at github.com)
- A Vercel account (free at vercel.com — sign up with your GitHub account)
- Your SquareSpace domain: marsdesigns.io

### Step 1: Push to GitHub (5 min)

1. Go to github.com, click +, New repository
2. Name it: marsdesigns-website, set Private, Create
3. Open Terminal and run:

```bash
cd marsdesigns-deploy
git init
git add .
git commit -m "Initial MARS Designs website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/marsdesigns-website.git
git push -u origin main
```

### Step 2: Deploy on Vercel (3 min)

1. Go to vercel.com, sign in with GitHub
2. Add New Project, select marsdesigns-website repo
3. Framework auto-detects Vite. Click Deploy.
4. Live in ~30 seconds at marsdesigns-website.vercel.app

### Step 3: Connect SquareSpace domain (7 min)

1. In Vercel: Settings > Domains > Add marsdesigns.io
2. In SquareSpace: Domains > marsdesigns.io > DNS Settings
3. Delete existing A records pointing to SquareSpace
4. Add: A Record | Host: @ | Value: 76.76.21.21
5. Add: CNAME | Host: www | Value: cname.vercel-dns.com
6. DNS propagates in 5-30 min. Done.

### Making Changes

Edit src/App.jsx, then: git add . && git commit -m "update" && git push
Vercel auto-deploys in 30 seconds.

## Tech Stack
React + Vite + Vercel (free) + SquareSpace (domain only)
