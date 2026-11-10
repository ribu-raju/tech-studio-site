# Tech Studio Solutions – Corporate Website

Static website for **Tech Studio Solutions and Trading FZ-LLC**. Pure HTML, CSS and JavaScript — no build step, no backend, no database.

```
index.html      All page content (edit text here)
styles.css      Design and layout (brand colours at the top)
script.js       Menu, scroll effects, enquiry form
robots.txt      Search engine rules
sitemap.xml     Sitemap for Google
CNAME           Custom domain for GitHub Pages
.nojekyll       Tells GitHub Pages to serve files as-is
assets/         logo.png, favicon.png, images/
```

## 1. Upload the files to GitHub
1. Sign in at https://github.com and click **New repository** (e.g. `tech-studio-website`), set it to **Public**, and create it.
2. Click **Add file → Upload files**, drag in **all files and the `assets` folder** from this project (keep `index.html` at the top level, not inside a sub-folder). Include `CNAME` and `.nojekyll`.
3. Click **Commit changes**.

## 2. Enable GitHub Pages
1. In the repository open **Settings → Pages**.
2. Under **Build and deployment**, Source: **Deploy from a branch**, Branch: **main**, Folder: **/ (root)** → **Save**.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## 3. Connect www.techstudiosolutions.com
1. In **Settings → Pages → Custom domain**, enter `www.techstudiosolutions.com` and click **Save** (the included `CNAME` file already contains this).
2. Optional but recommended: verify the domain under your GitHub profile **Settings → Pages → Verified domains**.

## 4. Configure DNS (at your domain registrar)
Add these records:

| Type  | Host / Name | Value |
|-------|-------------|-------|
| CNAME | `www`       | `<your-username>.github.io` |
| A     | `@`         | `185.199.108.153` |
| A     | `@`         | `185.199.109.153` |
| A     | `@`         | `185.199.110.153` |
| A     | `@`         | `185.199.111.153` |

The A records make `techstudiosolutions.com` (without www) redirect to `www`. Remove any old conflicting A/CNAME records for `@` and `www`. DNS can take up to 24–48 hours to update.

## 5. Enable HTTPS
Once DNS is working, return to **Settings → Pages** and tick **Enforce HTTPS**. (If the box is greyed out, wait for GitHub to finish issuing the certificate, then try again.)

## 6. Updating content later
- **Text:** open `index.html` on GitHub, click the pencil icon, edit the text between tags, then **Commit changes**. Each section is labelled with a comment such as `<!-- ===== SERVICES ===== -->`.
- **Images:** upload a new file to `assets/images/` with the same name to replace it (keep files under ~300 KB for speed).
- **Colours:** edit the variables at the top of `styles.css`.
- **Contact details:** search `index.html` for the phone number or email and update every occurrence (also in the JSON-LD block near the top and `COMPANY_EMAIL` in `script.js`).
- Changes go live automatically within about a minute.

## Enquiry form
The site has no server, so the enquiry form opens the visitor's own email app with a pre-filled message to sales@techstudiosolutions.com. The visitor presses **Send** in their email app. No message is stored on the website.
