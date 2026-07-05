# builtbyaero — Aero Gel Umali portfolio

Static portfolio site (HTML/CSS/JS). Deployed with GitHub Pages on the domain builtbyaero.com.

## Structure
- `index.html` — the site (must stay at the repo root)
- `assets/` — css, js, images, video
- `CNAME` — custom domain for GitHub Pages
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Update
Edit files and push/upload to the repo. GitHub Pages redeploys automatically.

## Contact form
The form posts to a Make webhook (see `assets/js/script.js`). The email template
for the Make scenario is kept separately.
